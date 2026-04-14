import dotenv from "dotenv";
import express from "express";
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

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://spendsmartly-beta.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Security middlewares
app.use(helmet());

// Fix for Express 5 + xss-clean issue
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/expense", expenseRoutes);

// Pipeline status (optional feature - kept as is)
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

// Global error handler
app.use((err: any, req: any, res: any, _next: any) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong",
  });
});

// Start server after DB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});