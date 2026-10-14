const express = require("express");
const Cors=require('cors');
console.log("🔥🔥🔥 THIS APP.JS FILE IS RUNNING 🔥🔥🔥");
const app = express();
const dotEnv=require('dotenv');
dotEnv.config();
const expenseRoutes=require('./routes/expenseRoutes')
const connectDB=require('./config/db');


const AppError = require("./utils/AppError");
app.use(Cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use('/expenses',expenseRoutes);
connectDB()


let idx = 2;
// app.post("/expenses", (req, res) => {
//   const { name, age, dream } = req.body;
//   console.log(name, age, dream);
//   const objj = {
//     id: idx + 1,
//     name: name,
//     age: age,
//     dream: dream,
//   };
//   console.log(objj);
//   expenses.push(objj);
//   console.log(expenses);
//   idx++;
//   res.status(201).json({
//     message: "A new Expense Created Successfully",
//   });
// });

// app.get("/expenses/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const expense = expenses.find((expense) => expense.id === id);
//   if (!expense) {
//     console.log("404 not found");
//     return res.status(404).json({
//       message: "requested resources not found",
//     });
//   }
//   return res.status(200).json(expense);
// });

app.delete("/expenses/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = expenses.findIndex((expense) => expense.id == id);
  if(index == -1) {
    return res
      .status(404)
      .json({ message: "Expense which you are trying to delete is not found" });
  }
  expenses.splice(index, 1);
  return res.status(200).json({
    message: "Expense deleted Successfully",
    expenses,
  });
});

// app.patch("/expenses/:id", (req, res, next) => {
  
//   validatePatchData(req.body);
//   const id=Number(req.params.id);
//   const idx = expenses.findIndex((expense) => expense.id === id);

//   if (idx === -1) {
//     return next(new AppError("Expense not found", 404));
//   }

  

//   if ("name" in req.body) {
//     expenses[idx].name = req.body.name;
//   }
//   if ("age" in req.body) {
//     expenses[idx].age = req.body.age;
//   }
//   if ("dream" in req.body) {
//     expenses[idx].dream = req.body.dream;
//   }
//   return res.status(200).json({message:"Succesfully updated the Expense", expenses});
// });
// app.get("/test-error", (req, res, next) => {
//   const error = new Error("something went wrong!");
//   next(error);
// });
app.use((err, req, res, next) => {
  console.log("ERROR:", err);
  if(err.name==="CastError"){
    res.status(400).json({message:"invalid Request"});
  }
    if (err.name === "ValidationError") {
    return res.status(400).json({
      message: err.message
    });
  }
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Something went wrong on the server",
  });
});

// function validatePatchData(data) {
//   const fields=Object.keys(data);
//   if(fields.length===0){
//     throw new AppError("No files Provided for update", 400);
//   }
//   const allowedfields = ["name", "age", "dream"];
//   for (let field of fields) {
//     if (!allowedfields.includes(field)) {
//       throw new AppError('Invalid Field ',400);
//     }
//   }
//   if ("name" in data) {
//     if (
//       typeof data.name !== "string" ||
//       data.name.trim() == "" ||
//       data.name.trim() !== data.name
//     ) {
//       throw new AppError("Invalid name ", 400);
//     }
//   }
//   if ("age" in data) {
//     if (typeof data.age !== "number" || data.age <= 0) {
//       throw new AppError("Invalid Age,Please Enter a Valid Age", 400);
//     }
//   }
//   if ("dream" in data) {
//     if (typeof data.dream !== "string" || data.dream.trim() === "") {
//       throw new AppError("Invalid entry ", 400);
//     }
//   }
// }

app.listen(3000, () => {
  console.log("Your server is listening at port 3000");
});
