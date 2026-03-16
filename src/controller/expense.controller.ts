import { Response } from "express";
import {
  createExpense,
  getAllExpenses,
  getExpenseById as getExpenseByIdService,
  updateExpense,
  deleteExpense,
} from "../service/expense.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const addExpense = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "User ID not found in token. Please login again." });
    }

    const expenseData = {
      ...req.body,
      userId,
    };

    const expense = await createExpense(expenseData);
    res.status(201).json(expense);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const expenses = await getAllExpenses();
    res.json(expenses);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getExpenseById = async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "User ID not found in token. Please login again." });
    }

    const expense = await getExpenseByIdService(id, userId);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.status(200).json(expense);
  } catch (err: any) {
    console.error("getExpenseById error:", err);
    return res.status(500).json({
      message: "Failed to fetch expense. Please try again.",
    });
  }
};

export const editExpense = async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updatedExpense = await updateExpense(id, req.body);
    res.json({
      message: "Expense updated successfully",
      data: updatedExpense,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const removeExpense = async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await deleteExpense(id);
    res.json({ message: "Deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};