import express from "express";
import { addExpense, getExpenses, removeExpense } from "../controller/expense.controller";

const router = express.Router();

router.post("/create", addExpense);
router.get("/", getExpenses);
router.delete("/:id", removeExpense);

export default router;