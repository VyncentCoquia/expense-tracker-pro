let expenses = [];

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

    const expense = {
        name: expenseName,
        amount: expenseAmount,
        category: expenseCategory,
        date: expenseDate
    };

    console.log(expense);

    expenses.push(expense);
    displayExpenses();
    clearInputs();
}

function displayExpenses() {
    const expenseList = document.getElementById("expenseList");
    expenseList.innerHTML = "";

    expenses.forEach((expense, index) => {
        expenseList.innerHTML += `
            <tr class="border-b border-slate-600 align-middle">
                <td class="p-3 text-center break-words">${expense.name}</td>
                <td class="p-3 text-center break-words">₱${expense.amount}</td>
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
    expenses.splice(index, 1);
    displayExpenses();
}

function editExpense(index) {
    const expense = expenses[index];

    document.getElementById("expenseName-input").value = expense.name;
    document.getElementById("amount-input").value = expense.amount;
    document.getElementById("category-input").value = expense.category;

    expenses.splice(index, 1);
    displayExpenses();
}

function clearInputs() {
    document.getElementById("expenseName-input").value = "";
    document.getElementById("amount-input").value = "";
    document.getElementById("category-input").selectedIndex = 0;
    document.getElementById("date-input").value = "";
}