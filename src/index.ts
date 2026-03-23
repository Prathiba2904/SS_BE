import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import xss from "xss-clean";
import connectDB from "./db/db.config";
import expenseRoutes from "./routes/expense.routes";
import authRoutes from "./routes/auth.routes";
import sonarRoutes from "./routes/sonar.routes";
import { fetchAndStoreSonarIssues } from "./service/sonar.service";

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
// Express 5 exposes req.query as a getter; xss-clean expects a writable object.
app.use((req, _res, next) => {
  Object.defineProperty(req, "query", {
    value: { ...req.query },
    writable: true,
    configurable: true,
    enumerable: true,
  });
  next();
});
app.use(xss());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api", sonarRoutes);
app.use("/", sonarRoutes);

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

  const fetchIntervalMs = Number(process.env.SONAR_FETCH_INTERVAL_MS || 60000);
  const safeFetchIntervalMs = Number.isFinite(fetchIntervalMs) && fetchIntervalMs > 0
    ? fetchIntervalMs
    : 60000;

  const fetchSonarIssuesJob = async () => {
    try {
      const result = await fetchAndStoreSonarIssues();
      console.log(
        `Sonar sync complete: added=${result.addedCount}, total=${result.totalCount}`
      );
    } catch (error: any) {
      console.error("Sonar scheduled sync failed:", error?.message || error);
    }
  };

  // Run immediately at startup, then poll every N ms.
  void fetchSonarIssuesJob();
  setInterval(() => {
    void fetchSonarIssuesJob();
  }, safeFetchIntervalMs);
});
