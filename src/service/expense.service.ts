import Expense from "../model/expense.model";

export const createExpense = async (data: any) => {
  return await Expense.create(data);
};

export const getAllExpenses = async () => {
  return await Expense.find();
};

export const deleteExpense = async (id: string) => {
  return await Expense.findByIdAndDelete(id);
};