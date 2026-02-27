import express from "express";
import { addExpense, getExpenses, editExpense, removeExpense } from "../controller/expense.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/create", protect, addExpense);
router.get("/", protect, getExpenses);
router.put("/:id", protect, editExpense);
router.delete("/:id", protect, removeExpense);

export default router;