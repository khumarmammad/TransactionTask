const url = "https://acb-api.algoritmika.org/api/transaction";
let transactions = [];
const fetchTransactions = async () => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch transactions");
        return await response.json();
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return [];
    }
};
const renderTransactions = (transactions) => {
    const grid = document.querySelector(".transaction-grid");
    grid.innerHTML = "";
    transactions.forEach((transaction) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>Transaction #${transaction.id}</h3>
            <p><strong>From:</strong> ${transaction.from}</p>
            <p><strong>To:</strong> ${transaction.to}</p>
            <p><strong>Amount:</strong> $${transaction.amount}</p>
            <div class="actions">
            <button class="edit" onclick="editTransaction(${transaction.id})">Edit</button>
            <button class="delete" onclick="deleteTransaction(${transaction.id})">Delete</button>
            </div>
        `;
        grid.appendChild(card);
    });
};
const addTransaction = async () => {
    const from = document.querySelector(".modal-from").value.trim();
    const to = document.querySelector(".modal-to").value.trim();
    const amount = document.querySelector(".modal-amount").value.trim();
    if (from && to && amount) {
        const newTransaction = { from, to, amount: parseFloat(amount) };
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTransaction),
            });
            if (!response.ok) throw new Error("Failed to add transaction");
            const data = await response.json();
            transactions.push(data);
            renderTransactions(transactions);
            closeModal();
        } catch (error) {
            console.error("Error adding transaction:", error);
        }
    } else {
        alert("Please fill out all fields!");
    }
};
const editTransaction = async (id) => {
    const transaction = transactions.find((t) => t.id === id);
    if (!transaction) return;
    const from = prompt("Edit From:", transaction.from);
    const to = prompt("Edit To:", transaction.to);
    const amount = prompt("Edit Amount:", transaction.amount);
    if (from && to && amount) {
        const updatedTransaction = { from, to, amount: parseFloat(amount) };
        try {
            const response = await fetch(`${url}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedTransaction),
            });
            if (!response.ok) throw new Error("Failed to edit transaction");
            const data = await response.json();
            const index = transactions.findIndex((t) => t.id === id);
            transactions[index] = data;
            renderTransactions(transactions);
        } catch (error) {
            console.error("Error editing transaction:", error);
        }
    }
};
const deleteTransaction = async (id) => {
    const confirmation = confirm("Are you sure you want to delete this transaction?");
    if (confirmation) {
        try {
            const response = await fetch(`${url}/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete transaction");
            transactions = transactions.filter((t) => t.id !== id);
            renderTransactions(transactions);
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    }
};
const closeModal = () => {
    document.querySelector(".transaction-modal").style.display = "none";
    document.querySelector(".modal-from").value = "";
    document.querySelector(".modal-to").value = "";
    document.querySelector(".modal-amount").value = "";
};
const init = async () => {
    try {
        transactions = await fetchTransactions();
        renderTransactions(transactions);
    } catch (error) {
        console.error("Error initializing app:", error);
    }
};
document.querySelector(".add-transaction").addEventListener("click", () => {
    document.querySelector(".transaction-modal").style.display = "block";
});
document.querySelector(".close-button").addEventListener("click", closeModal);
document.querySelector(".modal-add-transaction").addEventListener("click", addTransaction);
window.addEventListener("click", (event) => {
    if (event.target === document.querySelector(".transaction-modal")) {
        closeModal();
    }
});
init();