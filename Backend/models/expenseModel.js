const mongoose=require('mongoose');
const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  amount: {
    type: Number,
    required: true,
    min: 0
  },

  category: {
    type: String,
    required: true,
    enum: ["FOOD", "TRAVEL", "Entertainment", "SHOPPING", "Other","ELECTRONICS"]
  }
});
const Expense=mongoose.model("Expense",expenseSchema);
module.exports=Expense;
