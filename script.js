let expenses =
    JSON.parse(
        localStorage.getItem("myExpenses")
    ) || [];
let editingIndex = -1;
let expenseChart = null;
let selectedCategory = "All";
let sortState = {
    column: "",
    direction: "desc"
};

const sortFunctions = {
        name:   (a,b)=>a.name.localeCompare(b.name),
        amount: (a,b)=>a.amount - b.amount,
        category: (a,b)=>a.category.localeCompare(b.category),
        date: (a, b) => new Date(a.date) - new Date(b.date)
    };


const searchInput =
    document.getElementById("search-input");

searchInput.addEventListener("input", searchExpenses);

const expenseBtn = 
    document.getElementById("expenseBtn-input");
expenseBtn.addEventListener("click", addExpense);

document
    .getElementById("sort-expenseName")
    .addEventListener("click", () => sortExpenses("name"));

document
    .getElementById("sort-amount")
    .addEventListener("click", () => sortExpenses("amount"));
 
document
    .getElementById("sort-category")
    .addEventListener("click", () => sortExpenses("category"));    

document
    .getElementById("sort-date")
    .addEventListener("click", () => sortExpenses("date"));    



refreshUI(); 

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

    refreshUI();
    clearInputs();
}

function displayExpenses(expenseArray = expenses) {
    const expenseList = document.getElementById("expenseList");
    expenseList.innerHTML = "";
    

    expenseArray.forEach((expense) => {
        const originalIndex = expenses.indexOf(expense);
        expenseList.innerHTML += `
            <tr class="border-b border-slate-600 align-middle">
                <td class="p-3 text-center break-words">${expense.name}</td>
                <td class="p-3 text-center break-words">₱${expense.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td class="p-3 text-center break-words">${expense.category}</td>
                <td class="p-3 text-center break-words">${expense.date}</td>
                <td class="p-3 text-center break-words">
                    <button onclick="editExpense(${originalIndex})" class="bg-blue-500 px-3 py-1 rounded mr-2">
                        Edit
                    </button>
                    <button onclick="deleteExpense(${originalIndex})" class="bg-red-500 px-3 py-1 rounded">
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


function updateDashboard(expenseArray = expenses){
    
    if(expenseArray && expenseArray.length > 0 ){
        let total = 0;
        let highestExpenseValue = expenseArray[0].amount;
        

            for(let i = 0; i<expenseArray.length; i++){
                total += expenseArray[i].amount;
               
                    //highest expense calculation
                    if(expenseArray[i].amount>highestExpenseValue){
                        highestExpenseValue = expenseArray[i].amount;
                        
                    }
                    
            }
        //Total Expense
        const totalElement = document.getElementById("totalExpense");   
            totalElement.innerHTML = `₱ ${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        //Transaction Count
        const transactionElement = document.getElementById("transactionCount");  
            transactionElement.innerHTML = expenses.length;    

        //Highest Expense
         const highestExpenseElement = document.getElementById("highestExpense");
            highestExpenseElement.innerHTML = `₱ ${highestExpenseValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        //Average Expense
        let averageExpenseValue = total/expenses.length;
        const averageExpenseElement = document.getElementById("averageExpense");
        averageExpenseElement.innerHTML = `₱ ${averageExpenseValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    }

    else{ 
        
        document.getElementById("totalExpense").innerHTML = "₱ 0.00";
        document.getElementById("transactionCount").innerHTML = "0";
        document.getElementById("highestExpense").innerHTML = "₱ 0.00";
        document.getElementById("averageExpense").innerHTML = "₱ 0.00";
        }
}

function updateChart(expenseArray = expenses) {
    const totals = getCategoryTotal(expenseArray);
    const labels = Object.keys(totals);
    const data = Object.values(totals);

    const canvas = document.getElementById("expenseChart");
    const chartWrapper = document.getElementById("chartWrapper");
    const chartEmptyState = document.getElementById("chartEmptyState");

    if (!canvas || !chartWrapper || !chartEmptyState) {
        console.error("Chart elements not found.");
        return;
    }

    const currencyFormatter = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const hasData = data.some(value => value > 0);

    if (expenseChart) {
        expenseChart.destroy();
        expenseChart = null;
    }

    if (labels.length === 0 || data.length === 0 || !hasData) {
        chartWrapper.classList.add("hidden");
        chartEmptyState.classList.remove("hidden");
        chartEmptyState.classList.add("flex");
        return;
    }

    chartEmptyState.classList.add("hidden");
    chartEmptyState.classList.remove("flex");
    chartWrapper.classList.remove("hidden");

    expenseChart = new Chart(canvas, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Category",
                data: data,
                backgroundColor: [
                    "#39ff14",
                    "#00e5ff",
                    "#ff4d6d",
                    "#ffd60a",
                    "#9b5de5",
                    "#00f5d4",
                    "#ff9f1c",
                    "#2ec4b6"
                ],
                hoverBackgroundColor: [
                    "#66ff66",
                    "#33ebff",
                    "#ff758f",
                    "#ffe14d",
                    "#b388ff",
                    "#33ffe0",
                    "#ffb84d",
                    "#4ddbcc"
                ],
                borderRadius: 12,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: "#0f172a",
                    titleColor: "#39ff14",
                    bodyColor: "#ffffff",
                    borderColor: "#39ff14",
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return currencyFormatter.format(context.raw);
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: "#ffffff"
                    },
                    grid: {
                        display: false
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: "#ffffff",
                        callback: function(value) {
                            return currencyFormatter.format(value);
                        }
                    },
                    grid: {
                        color: "rgba(255,255,255,0.08)"
                    },
                    border: {
                        display: false
                    }
                }
            }
        }
    });
}

function getCategoryTotal(){
    let categoryTotals = {};

    for(let value of expenses){
        let category = value.category;
        let amount = value.amount;

            if(categoryTotals[category]){
                categoryTotals[category] += amount;
            }
            else{
                categoryTotals[category] = amount;
            }
    }
    return categoryTotals;
}

function searchExpenses(){ //food
   const searchKey = searchInput.value
   const filteredExpenses = filterExpenses(searchKey, expenses);
   refreshUI();
}

function filterExpenses(searchKey, expenseArray){
    const keyWord = searchKey.toLowerCase().trim();
        if(keyWord === ""){
            return expenseArray;
        }
       
    return expenseArray.filter(expense => 
            expense.name.toLowerCase().trim().includes(keyWord) ||
            expense.category.toLowerCase().trim().includes(keyWord) ||
            expense.date.toLowerCase().trim().includes(keyWord));
        
}

function sortExpenses(type) { 

   if(sortState.column === type){
    sortState.direction = sortState.direction === "desc" ? "asc" : "desc";
   }
   else{
    sortState.column = type;
    sortState.direction = "desc";
   }
   refreshUI();
}


function applySorting(expenseArray){
    const compare = sortFunctions[sortState.column];

    // If no valid sort column is selected,
    // return the original array.
    if (!compare) {
        return expenseArray;
    }
    expenseArray.sort((a, b) =>

        sortState.direction === "desc"

            ? compare(b, a)

            : compare(a, b)

    );
return expenseArray;
}

function saveExpenses() {
    localStorage.setItem(   
        "myExpenses",
        JSON.stringify(expenses)
    );
}

function refreshUI(){
    let currentState = [...expenses]
    currentState = filterExpenses(searchInput.value, currentState);
    currentState = applySorting(currentState);

        displayExpenses(currentState);
        updateDashboard(currentState);
        updateChart(currentState);
        saveExpenses(); //save the data to the storage
}


