import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
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
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/expense", expenseRoutes);

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
function divide(a, b) {
    return a / b;
}

console.log(divide(10, 0)); 