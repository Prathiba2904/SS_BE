import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/db.config";
import expenseRoutes from "./routes/expense.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://spendsmartly-beta.vercel.app/",
    ],
    credentials: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/expense", expenseRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});