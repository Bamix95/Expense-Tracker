let balance = document.querySelector(".balance_bal");
let expense = document.querySelector(".expense");
let income = document.querySelector(".income");
let monthSelect = document.querySelector("#months");
let form = document.getElementById("form");
let expense_type = document.querySelector(".expense_type");
let amount = document.querySelector(".amount");
let submit_btn = document.querySelector(".submit_btn");
let current_balance = 0;
let isModalShow = false;

const monthsArray = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let Trans_date = new Date().getMonth();
let modal_container = document.querySelector(".modal_container");
let modal_content = document.querySelector(".modal_content");

// Declare a variable to hold the chart instance
let incomeExpenseChart = null;

// Handle Form Submission
const handleSubmit = (event) => {
  event.preventDefault();
  if (
    !expense_type.value ||
    !amount.value ||
    (expense_type.value !== "expense" && expense_type.value !== "income")
  ) {
    console.error("Please provide valid input");
    return;
  }
  let transaction_array =
    JSON.parse(localStorage.getItem("transaction_array")) || [];

  let Transaction_data = {
    Expense: expense_type.value,
    Amount: amount.value,
    Month: monthsArray[Trans_date],
    id: crypto.randomUUID(),
  };
  transaction_array.push(Transaction_data);
  localStorage.setItem("transaction_array", JSON.stringify(transaction_array));

  // Clear Input Fields
  expense_type.value = "";
  amount.value = "";
  handleTransaction(transaction_array);
};
form.addEventListener("submit", handleSubmit);

// Handle Transaction
const handleTransaction = (transaction_array) => {
  let incomeTransactions = transaction_array.filter(
    (transaction) => transaction.Expense.toLowerCase() === "income"
  );

  const incomeTotal = incomeTransactions.reduce((sum, transaction) => {
    return sum + Number(transaction.Amount);
  }, 0);

  let expenseTransactions = transaction_array.filter(
    (transaction) => transaction.Expense.toLowerCase() === "expense"
  );

  let expenseTotal = expenseTransactions.reduce((sum, transaction) => {
    return sum + Number(transaction.Amount);
  }, 0);

  // Calculate Current Balance
  current_balance = incomeTotal - expenseTotal;
  balance.textContent = `$${current_balance.toFixed(2)}`;

  // Update Pie Chart
  updatePieChart(incomeTotal, expenseTotal);
};

// Update Pie Chart
const updatePieChart = (incomeTotal, expenseTotal) => {
  const ctx = document.getElementById("incomeExpenseChart").getContext("2d");

  // Check if a chart already exists
  if (incomeExpenseChart) {
    // Destroy the existing chart before creating a new one
    incomeExpenseChart.destroy();
  }

  // Create a new chart
  incomeExpenseChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Income", "Expenses"],
      datasets: [
        {
          label: "Income vs Expenses",
          data: [incomeTotal, expenseTotal],
          backgroundColor: ["#28a745", "#dc3545"],
          borderColor: ["#ffffff", "#ffffff"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: $${context.raw.toFixed(2)}`,
          },
        },
      },
    },
  });
};

// Modal Display for Expenses
document.addEventListener("DOMContentLoaded", () => {
  let transaction_array =
    JSON.parse(localStorage.getItem("transaction_array")) || [];
  handleTransaction(transaction_array); // Update balance and pie chart on load
});

// Handle modal closing when clicking outside the modal content or on the close button
modal_container.addEventListener("click", function (e) {
  if (
    e.target.classList.contains("modal_container") ||
    e.target.classList.contains("close-btn")
  ) {
    modal_container.classList.remove("show");
    isModalShow = false;
  }
});

// Modal Content for Expense List
let handleExpenseList = () => {
  isModalShow = true;
  modal_container.classList.add("show");

  modal_content.innerHTML = `
  <table>
    <thead>
      <tr>
        <th>Amount</th>
        <th>Month</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>`;

  const tableBody = modal_content.querySelector("tbody");
  let transaction_array =
    JSON.parse(localStorage.getItem("transaction_array")) || [];
  let expense_transaction = transaction_array.filter(
    (transaction) => transaction.Expense.toLowerCase() === "expense"
  );

  const renderTableRows = () => {
    tableBody.innerHTML = "";
    expense_transaction.forEach((transaction) => {
      tableBody.innerHTML += `
      <tr>
        <td>${transaction.Amount}</td>
        <td>${transaction.Month.slice(0, 3)}</td>
        <td>
          <button class="delete-btn" data-id="${transaction.id}">Delete</button>
        </td>
      </tr>`;
    });

    const delete_btns = tableBody.querySelectorAll(".delete-btn");
    delete_btns.forEach((button) => {
      button.addEventListener("click", (e) => {
        const transactionId = e.target.dataset.id;

        expense_transaction = expense_transaction.filter(
          (transaction) => transaction.id !== transactionId
        );
        transaction_array = transaction_array.filter(
          (transaction) => transaction.id !== transactionId
        );
        localStorage.setItem(
          "transaction_array",
          JSON.stringify(transaction_array)
        );

        renderTableRows();
        handleTransaction(transaction_array); // Update balance and pie chart after delete
      });
    });
  };

  renderTableRows();
};

expense.addEventListener("click", handleExpenseList);

// Modal Content for Income List
const handleIncomeList = () => {
  isModalShow = true;
  modal_container.classList.add("show");

  modal_content.innerHTML = `
  <table>
    <thead>
      <tr>
        <th>Amount</th>
        <th>Month</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>`;

  const tableBody = modal_content.querySelector("tbody");
  let transaction_array =
    JSON.parse(localStorage.getItem("transaction_array")) || [];
  let income_transaction = transaction_array.filter(
    (transaction) => transaction.Expense.toLowerCase() === "income"
  );

  const renderTableRows = () => {
    tableBody.innerHTML = "";
    income_transaction.forEach((transaction) => {
      tableBody.innerHTML += `
      <tr>
        <td>${transaction.Amount}</td>
        <td>${transaction.Month.slice(0, 3)}</td>
        <td>
          <button class="delete-btn" data-id="${transaction.id}">Delete</button>
        </td>
      </tr>`;
    });

    const delete_btns = tableBody.querySelectorAll(".delete-btn");
    delete_btns.forEach((button) => {
      button.addEventListener("click", (e) => {
        const transactionId = e.target.dataset.id;

        income_transaction = income_transaction.filter(
          (transaction) => transaction.id !== transactionId
        );
        transaction_array = transaction_array.filter(
          (transaction) => transaction.id !== transactionId
        );
        localStorage.setItem(
          "transaction_array",
          JSON.stringify(transaction_array)
        );

        renderTableRows();
        handleTransaction(transaction_array); // Update balance and pie chart after delete
      });
    });
  };

  renderTableRows();
};

income.addEventListener("click", handleIncomeList);
