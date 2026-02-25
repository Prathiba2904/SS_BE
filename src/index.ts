import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./db/db.config";
import expenseRoutes from "./routes/expense.routes";

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/expenses", expenseRoutes);

// example Express setup

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://spendsmartly-beta.vercel.app",
    ],
    credentials: true,
  })
);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});