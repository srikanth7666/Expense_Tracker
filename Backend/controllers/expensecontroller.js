const Expense = require("../models/expenseModel");
const AppError = require("../utils/AppError");
const getExpenses = async (req, res, next) => {
  console.log("DATABASE:", Expense.db.name);
  console.log("COLLECTION:", Expense.collection.name);
  console.log("COUNT:", await Expense.countDocuments({}));
  const page = req.query.page ? Number(req.query.page) : 1;
  
  const limit = req.query.limit ? Number(req.query.limit) : 10;

  const skip = (page - 1) * limit;

  console.log("page:", page);
  console.log("limit:", limit);
  console.log("skip:", skip);

  try {
    const filter = {};
    const amountFilter = {};
    let minAmount;
    let maxAmt;
    if(req.query.search){
         filter.title={
          $regex:req.query.search,
          $options:"i"
         };
    }
    console.log("Search term:", req.query.search);
    console.log("Filter:", filter);
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.minAmount) {
      minAmount = Number(req.query.minAmount);
      if (Number.isNaN(minAmount) || minAmount < 0) {
        throw new AppError("minAmount must be a valid number", 400);
      }
      amountFilter.$gte = minAmount;
    }
    if (req.query.maxAmount) {
      maxAmt = Number(req.query.maxAmount);
      if (Number.isNaN(maxAmt) || maxAmt < 0) {
        throw new AppError("maxAmount must be a valid Number", 400);
      }
      amountFilter.$lte = maxAmt;
    }
    if (Object.keys(amountFilter).length > 0) {
      if (
        minAmount !== undefined &&
        maxAmt !== undefined &&
        minAmount > maxAmt
      ) {
        throw new AppError("Minamount cannot be greater than maxAmount", 400);
      }
      filter.amount = amountFilter;
    }

    //let direction = req.query.sort;
    let direction=1;
    let sortField="_id";
    
    console.log("Search term:", req.query.search);
console.log("Filter:", filter);
    const query = Expense.find(filter);

    if (req.query.sort !== undefined) {
      if (req.query.sort === "amount") {
        direction = 1;
        sortField="amount";
      } else if (req.query.sort === "-amount") {
        direction = -1;
        sortField="-amount";
      } else {
        throw new AppError("Invalid Amount type", 400);
      }
      query.sort({[sortField]: direction});
    }
    if (!Number.isInteger(page) || page < 1) {
      throw new AppError("invalid page ", 400);
    }
    if (!Number.isInteger(limit) || limit < 1) {
      throw new AppError("invalid limit", 400);
    }

    const totalExpenses = await Expense.countDocuments(filter);
    const totalPages = Math.ceil(totalExpenses / limit);
    if (totalPages > 0 && page > totalPages) {
      throw new AppError("Requested Page is greater than available pages", 400);
    }
    if (limit > 100) {
      throw new AppError("Limit cannot exceed 100", 400);
    }
    query.skip(skip).limit(limit);

    console.log("Total Expenses:", totalExpenses);
    console.log("Total pages:", totalPages);

    const expense = await query;

    res.status(200).json({
      page,
      limit,
      totalExpenses,
      totalPages,
      expenses: expense,
    });
  } catch (error) {
    next(error);
  }
};

const CreateExpenses = async (req, res, next) => {
  const { title, amount, category } = req.body;
  try {
    const newExpense = new Expense({
      title: title,
      amount: amount,
      category: category,
    });

    await newExpense.save();
    console.log("Created expense", newExpense);
    res
      .status(201)
      .json({ message: "Created an Expense successfully", newExpense });
  } catch (error) {
    next(error);
  }

  // const objj={
  //     name:req.body.name,
  //     age:req.body.age,
  //     goal:req.body.goal
  // }
  // const newExpense=Expense.create(objj);
  // res.status(201).json({message:"New Expense Created",expense:newExpense});
};

const getElementbyId = async (req, res, next) => {
  const id = req.params.id;
  try {
    const expense = await Expense.findById(id);
    if (!expense) {
      return next(new AppError("Expense not found", 404));
    }
    console.log("Here is your Requested Expense", expense);
    res.status(200).json({ message: "Success", expense });
  } catch (error) {
    next(error);
  }
};

const updateExpense = async (req, res, next) => {
  validatePatchData(req.body);
  const id = req.params.id;
  const data = req.body;
  try {
    console.log("Reached Mongoose update");
    const updatedExpense = await Expense.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updatedExpense) {
      return next(new AppError("Expense not found", 404));
    }
    res.status(200).json({
      message: "Expense updated Succesfully",
      expense: updatedExpense,
    });
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  const id = req.params.id;
  try {
    const exp = await Expense.findByIdAndDelete(id);
    if (!exp) {
      return next(AppError("Expense not found,delete operation failed", 404));
    }
    res.status(200).json({ message: "Expense deleted Successfully", exp });
  } catch (error) {
    next(error);
  }
};

function validatePatchData(data) {
  const fields = Object.keys(data);
  if (fields.length === 0) {
    throw new AppError("No files Provided for update", 400);
  }
  const allowedfields = ["title", "amount", "category"];
  for (let field of fields) {
    if (!allowedfields.includes(field)) {
      throw new AppError("Invalid Field ", 400);
    }
  }
  if ("title" in data) {
    if (
      typeof data.title !== "string" ||
      data.title.trim() === "" ||
      data.title.trim() !== data.title
    ) {
      throw new AppError("Invalid title ", 400);
    }
  }
  if ("amount" in data) {
    if (typeof data.amount !== "number" || data.amount <= 0) {
      throw new AppError("Invalid amount,Please input a valid amount", 400);
    }
  }
  if ("category" in data) {
    if (typeof data.category !== "string" || data.category.trim() === "") {
      throw new AppError("Invalid category ", 400);
    }
  }
}

module.exports = {
  getExpenses,
  CreateExpenses,
  getElementbyId,
  updateExpense,
  deleteExpense,
};
