import Expense from "../model/expense.model";

export const createExpense = async (data: any) => {
  return await Expense.create(data);
};

export const getAllExpenses = async () => {
  return await Expense.find();
};

export const updateExpense = async (id: string, data: any) => {
  try {
    // Get existing expense first
    const existingExpense = await Expense.findById(id);
    if (!existingExpense) {
      throw new Error("Expense not found");
    }

    // Update only the fields provided, keep others intact
    Object.assign(existingExpense, data);

    // Save the document (this will run validators)
    const updatedExpense = await existingExpense.save();

    return updatedExpense;
  } catch (error: any) {
    throw new Error(`Failed to update expense: ${error.message}`);
  }
};

export const deleteExpense = async (id: string) => {
  return await Expense.findByIdAndDelete(id);
};