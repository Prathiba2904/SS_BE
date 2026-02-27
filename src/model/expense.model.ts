import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  Amount: {
    type: Number,
    required: true,
  },
  Type: {
    type: String,
    enum: ["Income", "Expense"],
    required: true,
    set: (value: string) => {
      // Convert to proper case: first letter uppercase, rest lowercase
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    },
  },
  Category: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: false,
  },
  Date: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
},
{ timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);