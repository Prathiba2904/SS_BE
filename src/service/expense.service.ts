import Expense from "../model/expense.model";
import { getErrorMessage } from "../utils/errors";

export type ExpenseCreateInput = {
  Amount: number;
  Type: "Income" | "Expense";
  Category: string;
  Description?: string;
  Date: Date | string;
  userId: string;
};

export type ExpenseUpdateInput = Partial<Omit<ExpenseCreateInput, "userId">>;

export const createExpense = async (data: ExpenseCreateInput) => {
  return Expense.create(data);
};

export const getExpenseById = async (id: string, userId: string) => {
  return Expense.findOne({ _id: id, userId });
};

export const getAllExpenses = async (userId: string) => {
  return Expense.find({ userId });
};

export const updateExpense = async (
  id: string,
  userId: string,
  data: ExpenseUpdateInput
) => {
  try {
    const existingExpense = await Expense.findOne({ _id: id, userId });
    if (!existingExpense) {
      throw new Error("Expense not found");
    }

    Object.assign(existingExpense, data);

    const updatedExpense = await existingExpense.save();

    return updatedExpense;
  } catch (error: unknown) {
    throw new Error(`Failed to update expense: ${getErrorMessage(error)}`);
  }
};

export const deleteExpense = async (id: string, userId: string) => {
  return Expense.findOneAndDelete({ _id: id, userId });
};