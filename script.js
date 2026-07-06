let expenses = [];

const expenseBtn = 
    document.getElementById("expenseBtn-input");

expenseBtn.addEventListener("click", addExpense);

function addExpense(){
    
    const expenseName =
        document.getElementById("expenseName-input").value;
    
    const expenseAmount =
        document.getElementById("amount-input").value;
        
    const expenseCategory =
        document.getElementById("category-input").value;    

    const expenseDate =
        document.getElementById("date-input").value;    

    let expense =
        {
            name: expenseName,
            amount: expenseAmount,
            category: expenseCategory,
            date: expenseDate
        }
    ;
        
        expenses.push(expense);
        console.log(expenses);
   
};

//1.  it retrieves the string or integer and then passes it to the variable for storage for data manipulaton
//2. parsefloat() is for decimals because it was an amount and all know that when we store money it is not just a whole number, so we need to consider the value to converted to float
