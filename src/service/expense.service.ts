import Expense from "../model/expense.model";

export const createExpense = async (data: any) => {
  return await Expense.create(data);
};

export const getAllExpenses = async () => {
  return await Expense.find();
};

export const getExpenseById = async (id: string, userId: string) => {
  return await Expense.findOne({ _id: id, userId });
};

export const updateExpense = async (id: string, data: any) => {
  try {
    const existingExpense = await Expense.findById(id);
    if (!existingExpense) {
      throw new Error("Expense not found");
    }

    Object.assign(existingExpense, data);

    const updatedExpense = await existingExpense.save();

    return updatedExpense;
  } catch (error: any) {
    throw new Error(`Failed to update expense: ${error.message}`);
  }
};

export const deleteExpense = async (id: string) => {
  return await Expense.findByIdAndDelete(id);
};