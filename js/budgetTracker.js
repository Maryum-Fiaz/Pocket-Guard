// budget tracker
import { saveExpense, getExpense } from "./storage.js";
import { calculateMoneySpend, calculateMoneyLeft } from "./utils.js";

// select items
const moneySpend = document.getElementById("moneySpend");
const price = document.getElementById("price");
const form = document.querySelector(".formData");
const submitBtn = document.querySelector(".submit-btn");
const budgetSpend = document.querySelector(".budgetSpend");
const budgetUl = document.querySelector(".budget-ul");
const budgetLeft = document.querySelector(".budgetLeft");

// *********** GETTING TOTAL BUDGET *************
const totalMoneyInput = document.getElementById("totalMoney");
const getBudget = document.querySelector(".getBudget");
const budget = document.getElementById("total-budget");

budget.textContent = Number(getExpense("total_Budget"));
let totalMoney = Number(getExpense("total_Budget"));

budgetLeft.textContent = totalMoney;

let buttonIsEdit = false; // if false, btn is submit. if true, btn is edit

let arrOfBudgetObj = JSON.parse(localStorage.getItem("budget_List")) || [];

// ************ function call ***************
// get list saved in localStorage
addItemsToList(arrOfBudgetObj);
let checkspend = Number(calculateMoneySpend(arrOfBudgetObj));
let checkLeft = Number(calculateMoneyLeft(checkspend));

//************* EVENT LISTENERS *************

// 1.
getBudget.addEventListener("click", (e) => {
  totalMoney = Number(totalMoneyInput.value);
  if (totalMoney === 0) {
    alert("Not enough Balance!");
    return;
  }
  if (checkspend > totalMoney) {
    alert("Not enough Balance!");
    return;
  }

  saveExpense("total_Budget", totalMoney);

  checkLeft = Number(calculateMoneyLeft(checkspend));

  budget.textContent = totalMoney;
  budgetLeft.textContent = checkLeft;
  budgetSpend.textContent = checkspend;
});

// 2.
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // if fields are empty
  if (!moneySpend.value || !price.value) {
    alert("Enter values...");
    return;
  }

  let priceValue = Number(price.value);
  let currentSpend = Number(calculateMoneySpend(arrOfBudgetObj));
  let currentBalanceLeft = Number(calculateMoneyLeft(currentSpend));

  if (buttonIsEdit) {
    const targetItem = arrOfBudgetObj.find((obj) => obj.id === editId);
    const difference = priceValue - targetItem.amount;
    if (currentBalanceLeft < difference) {
      alert(
        `Can't change to ${difference + targetItem.amount} as it's more than your balance!`,
      );
      return;
    }
  } else {
    if (currentBalanceLeft < priceValue) {
      alert("Not enough Balance!");
      return;
    }
  }

  if (!buttonIsEdit) {
    // false as buttonIsEdit is false, submit btn will work
    const newProduct = {
      id: Date.now(),
      name: moneySpend.value,
      amount: Number(price.value),
    };

    arrOfBudgetObj = [...arrOfBudgetObj, newProduct];
    saveExpense("budget_List", arrOfBudgetObj);

    addItemsToList(arrOfBudgetObj);
  } else {
    // NOTE: button is 'Edit'
    // changing values of name and amount
    arrOfBudgetObj = arrOfBudgetObj.map((obj) =>
      obj.id === editId
        ? { ...obj, name: moneySpend.value, amount: Number(price.value) }
        : obj,
    );

    saveExpense("budget_List", arrOfBudgetObj);
    addItemsToList(arrOfBudgetObj);

    submitBtn.textContent = "Add";
    buttonIsEdit = false;
  }

  moneySpend.value = "";
  price.value = "";
});

// ************ FUNCTIONS **************

// 1. make list and add items in it

function addItemsToList(budgetList) {
  budgetUl.innerHTML = "";
  let li = "";

  budgetList.forEach((obj) => {
    li = document.createElement("li");
    li.innerHTML = `
            <div data-id ="${obj.id}">
                <span style="display:block; font-weight:600;">${obj.name}</span>
                <span style="color:#94a3b8; font-size:0.8rem;">${obj.amount}</span>
            </div>
            <div>
                <span class="edit-action" style="color:#38bdf8; cursor:pointer; margin-right:10px; font-size:0.8rem;">Edit</span>
                <span class="del-action" style="color:#f43f5e; cursor:pointer; font-size:0.8rem;">Del</span>
            </div>
            `;
    li.setAttribute("data-id", obj.id);
    budgetUl.appendChild(li);
  });
  const moneySpend = Number(calculateMoneySpend(arrOfBudgetObj));
  const moneyLeft = Number(calculateMoneyLeft(moneySpend));
  budgetSpend.textContent = moneySpend;

  budgetLeft.textContent = moneyLeft;
}

// ************ DELETE/EDIT EVENT LISTENER ***********
let editId = null;

budgetUl.addEventListener("click", (e) => {
  const li = e.target.closest("li");

  if (e.target.classList.contains("del-action")) {
    const itemToDel = e.target.closest("li");

    const targetId = Number(li.dataset.id);

    if (itemToDel) {
      arrOfBudgetObj = arrOfBudgetObj.filter((obj) => obj.id !== targetId);
      saveExpense("budget_List", arrOfBudgetObj);
      addItemsToList(arrOfBudgetObj);
    }
  }

  if (e.target.classList.contains("edit-action")) {
    console.log("edit clicked");

    const li = e.target.closest("li");

    editId = Number(li.dataset.id);

    const targetObj = arrOfBudgetObj.find((obj) => obj.id === editId);

    moneySpend.value = targetObj.name;
    price.value = Number(targetObj.amount);
    // focusing on name field
    moneySpend.focus();

    // changing btn text submit --> edit
    submitBtn.textContent = "Edit";

    // doing it true so that we can now use submit btn as edit btn
    buttonIsEdit = true;
  }
});
