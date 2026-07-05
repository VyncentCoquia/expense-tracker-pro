let expenses = [];

const expenseBtn = 
    document.getElementById("expenseBtn-input");

expenseBtn.addEventListener("click", addExpense);

function addExpense(){
    const expenseName =
        document.getElementById("expenseName-input").value;
    
    const amount =
        document.getElementById("amount-input").value;
        
    const category =
        document.getElementById("category-input").value;    

    const date =
        document.getElementById("date-input").value;    


    console.log(expenseName);
    console.log(amount);   
    console.log(category);
    console.log(date); 
};

