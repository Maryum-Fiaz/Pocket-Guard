// budget tracker

// select items
const moneySpend= document.getElementById('moneySpend');
const price= document.getElementById('price');
const form = document.querySelector('.formData')
const submitBtn = document.querySelector('.submit-btn');
const budgetSpend= document.querySelector('.budgetSpend');
const budgetUl = document.querySelector('.budget-ul');
const budgetLeft = document.querySelector('.budgetLeft');


// *********** GETTING TOTAL BUDGET *************
const totalMoneyInput = document.getElementById('totalMoney');
const getBudget = document.querySelector('.getBudget');
let totalMoney = 0;

getBudget.addEventListener('click', ()=> {
    totalMoney = totalMoneyInput.value;
    budgetLeft.textContent = totalMoney;
})
console.log(totalMoney);



let buttonIsEdit = false;  // if false btn is submit, if true btn is edit
// let arrOfBudgetObj = [];  vanishing data because of this

let arrOfBudgetObj = JSON.parse(localStorage.getItem('budget_List')) || [];
console.log(arrOfBudgetObj);


// ************ function call ***************
addItemsToList(arrOfBudgetObj);
console.log('money spend: ',calculateMoneySpend(arrOfBudgetObj));
// calculateMoneySpend(arrOfBudgetObj)

// ***************** local storage functions *****************

function saveExpense(value) {
    console.log('value is: ',value);
    localStorage.setItem('budget_List', JSON.stringify(value));
}

function getExpense() {
   return JSON.parse(localStorage.getItem('budget_List')) || [];
}



//*************event listener to get data*************
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // if fields are empty
    if(!moneySpend.value || !price.value) {
        console.log('Enter values...');
        return;
    }
    if(!buttonIsEdit){  // false as buttonIsEdit is false submit btn will work
        const newProduct = {
            id: Date.now(),
            name: moneySpend.value,
            amount: Number(price.value),
        }
    
    
    
        arrOfBudgetObj = [...arrOfBudgetObj, newProduct]
        saveExpense(arrOfBudgetObj);

        console.log('arr of obj: ', arrOfBudgetObj);
    
        addItemsToList(arrOfBudgetObj);

    }   else {

        // NOTE: button is 'Edit'
        // changing values of name and amount
        const arrOfBudgetObj2 = arrOfBudgetObj.map(obj => 
            obj.id === editId ? {...obj, name: moneySpend.value, amount: Number(price.value)} : obj
        )    // TODO fix this bug: arrOfBudgetObj2
    
        console.log('arrOfBudgetObj2 in edit: ', arrOfBudgetObj2);

        saveExpense(arrOfBudgetObj2);
        addItemsToList(arrOfBudgetObj2);

        submitBtn.textContent = 'Add';
        buttonIsEdit = false;

    }

    moneySpend.value = '';
    price.value='';
})

console.log('arr of obj: ', arrOfBudgetObj);

// ************ FUNCTIONS **************
// 1. make list and add items in it

function addItemsToList(budgetList) {

    budgetUl.innerHTML = '';
    let li='';

    budgetList.forEach(obj => {
        li = document.createElement('li');
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
            li.setAttribute('data-id', obj.id);
        budgetUl.appendChild(li);
        
    });
    calculateMoneySpend(budgetList);
}


// 2. calculating budget

function calculateMoneySpend(arrayOfObj) {
    let initialValue = 0;

    const spentMoney = arrayOfObj.reduce((acc, obj) => acc + obj.amount,
    initialValue)
    
    calculateMoneyLeft(spentMoney)
    return budgetSpend.textContent = spentMoney;
}

function calculateMoneyLeft(spentMoney){

    const moneyLeft = totalMoney - spentMoney
    if(moneyLeft < 0 ){
        return budgetLeft.textContent = 'No money Left!'

        }

        return budgetLeft.textContent = moneyLeft;
}

// TODO: if money finish we show 'No money Left!' but list still increaing and money still adding in spentMoney, correct this



// ************ DELETE/EDIT EVENT LISTENER ***********
let editId = null;

budgetUl.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    
    if(e.target.classList.contains('del-action')){
        const itemToDel = e.target.closest('li');

            const targetId = Number(li.dataset.id);


            if(itemToDel){
                arrOfBudgetObj = arrOfBudgetObj.filter(obj => obj.id !== targetId);
                saveExpense(arrOfBudgetObj)
                addItemsToList(arrOfBudgetObj);
                
            }
    }

    if(e.target.classList.contains('edit-action')){
         console.log('edit clicked')
         
         const li = e.target.closest('li');
         console.log(li);

         editId = Number(li.dataset.id);
        console.log('editId ',editId);

        const targetObj = arrOfBudgetObj.find(obj => obj.id === editId);

        // putting both values in fields above to edit
        console.log('targetObj: ', targetObj);
        
         moneySpend.value = targetObj.name;
         price.value = Number(targetObj.amount);
        // focusing on name field
        moneySpend.focus()
        
        // changing btn text submit --> edit
        submitBtn.textContent = 'Edit';

        // doing it true so that we can now use submit btn as edit btn
        buttonIsEdit = true;




    }

})

