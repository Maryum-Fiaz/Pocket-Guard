// BUDGET CALCULATIONS

import { getExpense } from "./storage.js";

// 1.
export function calculateMoneySpend(arrayOfObj) {
  let initialValue = 0;

  const spentMoney = arrayOfObj.reduce(
    (acc, obj) => acc + obj.amount,
    initialValue,
  );

  return spentMoney;
}

// 2.
export function calculateMoneyLeft(spentMoney) {
  const totalMoney = Number(getExpense("total_Budget"));

  const moneyLeft = totalMoney - spentMoney;

  return moneyLeft;
}
