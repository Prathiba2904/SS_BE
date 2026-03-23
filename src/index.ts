import dotenv from "dotenv";
import express from "express";
import axios from "axios";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import xss from "xss-clean";
import connectDB from "./db/db.config";
import expenseRoutes from "./routes/expense.routes";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://spendsmartly-beta.vercel.app"
    ],
    credentials: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(helmet());
app.use(xss());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/expense", expenseRoutes);

let pipelineStatus: { status: string; message: string } = {
  status: "SUCCESS",
  message: "",
};

app.post("/pipeline-status", (req, res) => {
  const { status, message } = req.body;
  pipelineStatus = {
    status: status ?? "SUCCESS",
    message: message ?? "",
  };
  res.send("updated");
});

app.get("/pipeline-status", (_req, res) => {
  res.json(pipelineStatus);
});

app.get("/sonar-issues", async (_req, res) => {
  try {
    const sonarBaseUrl = process.env.SONAR_BASE_URL;
    const sonarToken = process.env.SONAR_TOKEN;
    const projectKey = process.env.SONAR_PROJECT_KEY || "spend-smartly";
    const severities = process.env.SONAR_SEVERITIES || "CRITICAL,HIGH";

    if (!sonarBaseUrl || !sonarToken) {
      return res.status(500).json({
        message: "SonarQube is not configured on the backend.",
      });
    }

    const response = await axios.get(`${sonarBaseUrl}/api/issues/search`, {
      params: {
        projectKeys: projectKey,
        severities,
      },
      auth: {
        username: sonarToken,
        password: "",
      },
      timeout: 8000,
    });

    type SonarIssue = {
      severity?: string;
      message?: string;
      component?: string;
      line?: number;
    };

    const issues = (response.data?.issues || []).map((issue: SonarIssue) => ({
      severity: issue.severity || "UNKNOWN",
      message: issue.message || "No message",
      component: issue.component || "Unknown file",
      line: issue.line ?? null,
    }));

    return res.status(200).json({ issues });
  } catch (error: any) {
    console.error("SonarQube fetch error:", error?.message || error);
    return res.status(500).json({
      message: "Failed to fetch SonarQube issues. SonarQube may be unreachable.",
    });
  }
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong",
  });
});

// Start server only after DB is connected (avoids 500 on register before DB ready)
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
