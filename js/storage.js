// ***************** local storage functions *****************

export function saveExpense(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getExpense(key) {
   return JSON.parse(localStorage.getItem(key)) || [];
}

//'budget_List'