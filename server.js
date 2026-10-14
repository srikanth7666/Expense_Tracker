const AppError = require("./Backend/utils/AppError");

let expenses = [];

const addbtn = document.getElementById("add-btn");
const updatebtn = document.getElementById("updatebtn");
const cancellbtn = document.getElementById("cancell");
const title = document.getElementById("title");
const amount = document.getElementById("amount");

updatebtn.hidden = true;
cancellbtn.hidden = true;

const form = document.getElementById("formm");
form.addEventListener("submit", funk);
document.getElementById("updatebtn").addEventListener("click", updatefunk);



async function funk(e) {
  e.preventDefault();

  const titlee = document.getElementById("title").value;
  const amountt = Number(document.getElementById("amount").value);
  const catgory = document.getElementById("Categories").value;
  const errorr = document.getElementById("error");

  errorr.textContent = "";

  if (!validateExpenses(titlee, amountt)) {
    errorr.textContent =
      "Invalid input please enter the valid title and amount";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: titlee,
        amount: amountt,
        category: catgory,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create expense");
    }

    console.log("Backend response:", data);

    document.getElementById("formm").reset();

    await loadExpenses();
  } catch (error) {
    errorr.textContent = error.message;
  }
}




//This function Adds the Expense in to the Array and save to Localstorage and displays it on webpage...
// async function funk(e) {
//   e.preventDefault();

//   const titlee = document.getElementById("title").value;
//   const amountt = Number(document.getElementById("amount").value);
//   const catgory = document.getElementById("Categories").value;
//   const errorr = document.getElementById("error");
//   errorr.textContent = "";
//   if (!validateExpenses(titlee, amountt)) {
//     errorr.textContent =
//       "Invalid input please enter the valid title and amount ";
//     return;
//   }
//   const response = await fetch("http://localhost:3000/expenses", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       title: titlee,
//       amount: amountt,
//       category: catgory,
//     }),
//   });
//   const data = await response.json();
//   console.log("Backend response", data);
//   // const obj1 = {
//   //   id: crypto.randomUUID(),
//   //   Title: titlee,
//   //   Amount: amountt,
//   //   Category: catgory,
//   // };

//   // expenses.push(obj1);
//   // titlee.textContent="";`
//   // amountt.textContent=""
//   // catgory.value="NONE";
//   localStorage.setItem("Expenses", JSON.stringify(expenses));
//   displayExpenses(expenses);
// }
async function loadExpenses() {
  const response = await fetch("http://localhost:3000/expenses");

  const data = await response.json();
  console.log("FULL BACKEND RESPONSE:", data);
  console.log("FIRST EXPENSE:", data.expenses?.[0]);
  expenses = data.expenses;
  displayExpenses(data.expenses);
}
//This function display each and expense present in the expense array.including its total money
function displayExpenses(dataToDisplay) {
  console.log("DISPLAY DATA:", dataToDisplay);
  const errorr = document.getElementById("error");
  let totalcount = 0;
  const container = document.getElementById("expense-container");
  const totalexpenses = document.getElementById("total-expenses");
  const overallTotalExpenses = document.getElementById("overall");
  container.textContent = "";
  totalexpenses.textContent = "";
  errorr.textContent = "";
  for (let expense of dataToDisplay) {
    totalcount += expense.amount;
  }
  if (dataToDisplay.length === 0) {
    container.textContent = "";
    errorr.textContent = "Expense needed to be added ,Currently Empty";
    overallTotalExpenses.textContent =
      "The overall total expenses = " + totalcount;
    return;
  }
  if (expenses.length > 0 && dataToDisplay.length === 0) {
    errorr.textContent = "No Matching Expense found";
    totalexpenses.textContent = "Overall Total Expenses = " + totalcount;
    overallTotalExpenses.textContent = "FilteredAmount = " + 0;
    return;
  }
  let totalamount = 0;
  for (let expense of dataToDisplay) {
    totalamount += expense.amount;
    const deletebutton = document.createElement("button");
    deletebutton.textContent = "Delete";
    const editbutton = document.createElement("button");
    const info = document.createElement("div");
    info.className = "Expense-info";
    const actions = document.createElement("div");
    actions.className = "Expense-actions";
    editbutton.textContent = "Edit";
    editbutton.id = expense._id;
    deletebutton.id = expense._id;
    const temp = document.createElement("div");
    temp.className = "expense-card";
    const h3 = document.createElement("h3");
    const para = document.createElement("p");
    para.className = "expense-amount";
    const para2 = document.createElement("p");
    para2.className = "expense-category";
    para2.textContent = expense.category;
    para.textContent = "Amount:" + "₹ " + expense.amount;
    h3.textContent = expense.title;

    info.appendChild(h3);
    info.appendChild(para);
    info.appendChild(para2);
    actions.appendChild(deletebutton);
    actions.appendChild(editbutton);
    temp.appendChild(info);
    temp.appendChild(actions);
    container.appendChild(temp);
    form.reset();

    deletebutton.addEventListener("click", dell);
    editbutton.addEventListener("click", makeChanges);
  }

  totalexpenses.textContent = "₹ " + totalamount;
  overallTotalExpenses.textContent = "₹ " + totalcount;
}

cancellbtn.addEventListener("click", function (e) {
  ExpenseTobeEdited = null;

  updatebtn.hidden = true;
  cancellbtn.hidden = true;
  addbtn.hidden = false;
  form.reset();
});

let ExpenseTobeEdited = null;

//THis is a Edit function which will capture the object ID ,

function makeChanges(e) {
  console.log("Clicked ID:", e.target.id, typeof e.target.id);

  console.log("MongoDB ID:", expenses[0]?._id, typeof expenses[0]?._id);

  console.log(
    "All IDs:",
    expenses.map((item) => item._id),
  );

  updatebtn.hidden = false;
  cancellbtn.hidden = false;
  addbtn.hidden = true;
  const id = e.target.id;
  const expense = expenses.find((item) => item._id === id);
  if (!expense) {
    console.log("Expense not found");
    return;
  }
  ExpenseTobeEdited = expense._id;
  document.getElementById("title").value = expense.title;
  document.getElementById("amount").value = expense.amount;
  document.getElementById("Categories").value = expense.category;
}

function validateExpenses(title, amt) {
  if (title.trim() === "") {
    return false;
  }
  if (amt <= 0) {
    return false;
  }
  return true;
}

async function updatefunk(e) {
  e.preventDefault();
  const error = document.getElementById("error");
  const updatebtn = document.getElementById("updatebtn");
  const cancellbtn = document.getElementById("cancell");
  if (ExpenseTobeEdited === null) {
    error.textContent = "Please Select and Expense First to Edit";
    return;
  }
  const tit = document.getElementById("title").value;
  const Amt = Number(document.getElementById("amount").value);
  const Cat = document.getElementById("Categories").value;
  if (!validateExpenses(tit, Amt)) {
    error.textContent = "Invalid title or amount";
    return;
  }
  try {
    const response = await fetch(
      `http://localhost:3000/expenses/${ExpenseTobeEdited}`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          title: tit,
          amount: Amt,
          category: Cat,
        }),
      },
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update expense");
    }
    ExpenseTobeEdited = null;
    updatebtn.hidden = true;
    cancellbtn.hidden = true;
    addbtn.hidden = false;
    await loadExpenses();
    error.textContent = "Expense updated successfully";
  } catch (err) {
    error.textContent = err.message;
  }
}

async function dell(e) {
  const id = e.target.id;
  const response = await fetch(`http://localhost:3000/expenses/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete expense");
  }
  await loadExpenses();
}

const SearchExpenses = document.getElementById("search");
const sortbyAmt = document.getElementById("sortbyAmount");
const filtercat = document.getElementById("filterCategory");
SearchExpenses.addEventListener("input", applyfilterSorted);
sortbyAmt.addEventListener("change", applyfilterSorted);
filtercat.addEventListener("change", applyfilterSorted);

async function applyfilterSorted() {
  let hashQuery=false;
  const catx = document.getElementById("filterCategory").value;
  let sortbyAmt=document.getElementById("sortbyAmount").value;
  const searchText=document.getElementById('search').value
  if(sortbyAmt!=="NONE"){
    if(sortbyAmt==="LOW_HIGH"){
      sortbyAmt="amount";
     
    }else{
      sortbyAmt="-amount";
    }
  }
  
  let url = "http://localhost:3000/expenses";

  if (catx !== "ALL") {
    url += `?category=${encodeURIComponent(catx)}`;
    hashQuery=true;
  }
  if(sortbyAmt!=="NONE"){

    if(!hashQuery){
      url += `?sort=${encodeURIComponent(sortbyAmt)}`;
    }else{
       url+=`&sort=${encodeURIComponent(sortbyAmt)}`
    }
    hashQuery=true;
  
  }
  if(searchText){
    if(hashQuery){
      url+=`&search=${encodeURIComponent(searchText)}`;
    }else{
      url+=`?search=${encodeURIComponent(searchText)}`;
      hashQuery=true;
    }
  }



  try {
    console.log("Selected category:", catx);
  console.log("Request URL:", url);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to filter expenses");
    }

    const data = await response.json();
    console.log("Filtered response:", data);
console.log("Filtered expenses:", data.expenses);

    expenses = data.expenses;
    displayExpenses(expenses);
  } catch (error) {
    document.getElementById("error").textContent = error.message;
  }
}

// function applyfilterSorted() {
//   const catx = document.getElementById("filterCategory").value;
//   const sorty = document.getElementById("sortbyAmount").value;
//   const search = document.getElementById("search").value;
//   console.log("Selected:", catx);
//   console.log("Selected length:", catx.length);
//   let result = [...expenses];
//   if (catx !== "ALL") {
//     result = result.filter((expense) => {
//       return expense.Category === catx;
//     });
//   }
//   result = result.filter((expense) => {
//     return expense.Title.toLowerCase().includes(search.toLowerCase());
//   });
//   if (sorty !== "NONE") {
//     if (sorty === "LOW_HIGH") {
//       result.sort((a, b) => {
//         return a.Amount - b.Amount;
//       });
//     } else {
//       result.sort((a, b) => {
//         return b.Amount - a.Amount;
//       });
//     }
//   }
//   displayExpenses(result);
// }

const storage = localStorage.getItem("Expenses");
if (storage !== null) {
  const storedexpenses = JSON.parse(storage);
  expenses.push(...storedexpenses);
}
loadExpenses();
displayExpenses(expenses);
