let expenses =
    JSON.parse(
        localStorage.getItem("myExpenses")
    ) || [];
let editingIndex = -1;

const expenseBtn = document.getElementById("expenseBtn-input");
expenseBtn.addEventListener("click", addExpense);

function addExpense() {
    const expenseName = document.getElementById("expenseName-input").value;
    const expenseAmount = parseFloat(document.getElementById("amount-input").value);
    const expenseCategory = document.getElementById("category-input").value;

    let expenseDate = document.getElementById("date-input").value;


        if (expenseDate) {
            const [year, month, day] = expenseDate.split("-");
            expenseDate = `${month}/${day}/${year}`;
        }
    
        if (
            !expenseName ||
            !expenseAmount ||
            !expenseCategory ||
            !expenseDate
                ) {
            alert("Please complete all fields.");
            return;
        }

    const expense = {
        name: expenseName,
        amount: expenseAmount,
        category: expenseCategory,
        date: expenseDate
    };

         if (editingIndex === -1) {
            // Mode: Add New
            expenses.push(expense);
        } else {
            // Mode: Save Changes to existing item
        expenses[editingIndex] = expense;
        editingIndex = -1; // Reset tracking state back to normal
        document.getElementById("expenseBtn-input").innerText = "Add Expense";
        }

    displayExpenses();
    clearInputs();
}

function displayExpenses() {
    const expenseList = document.getElementById("expenseList");
    expenseList.innerHTML = "";

    expenses.forEach((expense, index) => {
        expenseList.innerHTML += `
            <tr class="border-b border-slate-600 align-middle">
                <td class="p-3 text-center bxreak-words">${expense.name}</td>
                <td class="p-3 text-center break-words">₱${expense.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td class="p-3 text-center break-words">${expense.category}</td>
                <td class="p-3 text-center break-words">${expense.date}</td>
                <td class="p-3 text-center break-words">
                    <button onclick="editExpense(${index})" class="bg-blue-500 px-3 py-1 rounded mr-2">
                        Edit
                    </button>
                    <button onclick="deleteExpense(${index})" class="bg-red-500 px-3 py-1 rounded">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

function deleteExpense(index) {
    if(confirm("Delete this expense?")){
        expenses.splice(index,1);
        refreshUI();
        clearInputs();
    }
}

function editExpense(index) {
    const expense = expenses[index];
    editingIndex = index;

    document.getElementById("expenseName-input").value = expense.name;
    document.getElementById("amount-input").value = expense.amount;
    document.getElementById("category-input").value = expense.category;

        if (expense.date) {
            const [month, day, year] = expense.date.split("/");
            document.getElementById("date-input").value = `${year}-${month}-${day}`;
        }
    document.getElementById("expenseBtn-input").innerText = "Save Changes";
    refreshUI();
}

function clearInputs() {
    document.getElementById("expenseName-input").value = "";
    document.getElementById("amount-input").value = "";
    document.getElementById("category-input").selectedIndex = 0;
    document.getElementById("date-input").value = "";
    document.getElementById("expenseBtn-input").innerText = "Add Expense";
    editingIndex = -1;
}

function updateTotal(){
    let total = 0;
    
        for(let i = 0; i<expenses.length; i++){
            total += expenses[i].amount;

        }

    document.getElementById("totalExpense").innerHTML = 
        `₱ ${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function saveExpenses() {
    localStorage.setItem(   
        "myExpenses",
        JSON.stringify(expenses)
    );
}

function refreshUI(){
    displayExpenses();
    updateTotal();
    saveExpenses(); //save the data to the storage
}