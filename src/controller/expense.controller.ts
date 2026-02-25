import { Request, Response } from "express";
import { createExpense, getAllExpenses, deleteExpense } from "../service/expense.service";

export const addExpense = async (req: Request, res: Response) => {
  try {
    const expense = await createExpense(req.body);
    res.status(201).json(expense);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await getAllExpenses();
    res.json(expenses);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const removeExpense = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await deleteExpense(id);
    res.json({ message: "Deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};