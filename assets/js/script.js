document.addEventListener("DOMContentLoaded", () => {
    let subscriptions = [];
    let chartInstance;
    let budgetChartInstance;
    let budgetLimit = 0; // Default budget

    // Update the table with subscriptions
    function updateTable() {
        let tableBody = document.getElementById("subTable");
        tableBody.innerHTML = "";

        subscriptions.forEach((sub, index) => {
            let row = `<tr>
                <td>${sub.name}</td>
                <td>₹${sub.price.toFixed(2)}</td>
                <td>${sub.nextBillingDate}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteSubscription(${index})">Delete</button>
                </td>
            </tr>`;
            tableBody.innerHTML += row;
        });

        updateExpenseChart();
        updateBudgetChart();
        checkBudget();
    }

    // Add Subscription
    function addSubscription() {
        let name = document.getElementById("subName").value;
        let price = parseFloat(document.getElementById("subPrice").value);
        let date = document.getElementById("subDate").value;

        if (!name || isNaN(price) || !date) {
            alert("Please fill out all fields correctly!");
            return;
        }

        subscriptions.push({ name, price, nextBillingDate: date });
        updateTable();

        // Clear input fields
        document.getElementById("subName").value = "";
        document.getElementById("subPrice").value = "";
        document.getElementById("subDate").value = "";
    }

    // Delete Subscription
    function deleteSubscription(index) {
        subscriptions.splice(index, 1);
        updateTable();
    }

    // Check Budget Limit
    function checkBudget() {
        let totalExpense = subscriptions.reduce((sum, sub) => sum + sub.price, 0);
        if (totalExpense > budgetLimit) {
            alert(`🚨 Warning: Your expenses (₹${totalExpense}) have exceeded the budget (₹${budgetLimit})!`);
        }
    }

    // Set Budget Limit
    function setBudget() {
        let budgetInput = prompt("Enter your monthly budget (₹):");
        if (budgetInput && !isNaN(budgetInput)) {
            budgetLimit = parseFloat(budgetInput);
            alert(`✅ Budget set to ₹${budgetLimit}`);
            updateBudgetChart();
            checkBudget();
        } else {
            alert("Invalid budget value!");
        }
    }

    // Update Expense Chart (Pie Chart)
    function updateExpenseChart() {
        let ctx = document.getElementById("expenseChart").getContext("2d");

        if (chartInstance) chartInstance.destroy();
        if (subscriptions.length === 0) return;

        let labels = subscriptions.map(sub => `💰 ${sub.name} (₹${sub.price})`);
        let data = subscriptions.map(sub => sub.price);

        chartInstance = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"],
                    borderWidth: 2,
                    borderColor: "#fff"
                }]
            },
            options: {
                responsive: true,
                cutout: "50%",
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: { color: "#fff", font: { size: 14, family: "Poppins" } }
                    }
                }
            }
        });
    }

    // Update Budget Chart (Bar Chart)
    function updateBudgetChart() {
        let ctx = document.getElementById("budgetChart").getContext("2d");
        let totalExpense = subscriptions.reduce((sum, sub) => sum + sub.price, 0);

        if (budgetChartInstance) budgetChartInstance.destroy();

        budgetChartInstance = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Budget 💰", "Total Expenses 📉"],
                datasets: [{
                    label: "INR",
                    data: [budgetLimit, totalExpense],
                    backgroundColor: [
                        "rgba(54, 162, 235, 0.8)", 
                        totalExpense > budgetLimit ? "rgba(255, 99, 132, 0.8)" : "rgba(75, 192, 192, 0.8)"
                    ],
                    borderColor: "#fff",
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: "#fff", font: { size: 14 } }
                    },
                    x: { ticks: { color: "#fff", font: { size: 14 } } }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    // Export CSV
    function exportCSV() {
        if (subscriptions.length === 0) {
            alert("No data to export!");
            return;
        }

        let csvContent = "Name,Price,NextBillingDate\n" +
            subscriptions.map(sub => `${sub.name},${sub.price},${sub.nextBillingDate}`).join("\n");

        let blob = new Blob([csvContent], { type: "text/csv" });
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "subscriptions.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Attach functions to global window object
    window.addSubscription = addSubscription;
    window.deleteSubscription = deleteSubscription;
    window.exportCSV = exportCSV;
    window.setBudget = setBudget;
});
