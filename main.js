let transactions = [];
const fetchTransactions = async () => {
    return [
        { id: 1, from: "Riyad", to: "Khumar", amount: 50 },
        { id: 2, from: "Teymur", to: "Ali", amount: 100 },
        { id: 3, from: "Davud", to: "Nargis", amount: 75 },
        { id: 4, from: "Elvina", to: "Namig", amount: 60 },
        { id: 5, from: "Saida", to: "Gunay", amount: 80 },
    ];
};
const renderTransactions = () => {
    const grid = document.getElementById("transactionGrid");
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
    const from = prompt("From:");
    const to = prompt("To:");
    const amount = prompt("Amount:");
    if (from && to && amount) {
        const newTransaction = {
            id: transactions.length > 0 ? transactions[transactions.length - 1].id + 1 : 1,
            from,
            to,
            amount: parseFloat(amount),
        };
        transactions.push(newTransaction);
        renderTransactions();
    }
};

const deleteTransaction = async (id) => {
    transactions = transactions.filter((t) => t.id !== id);
    renderTransactions();
};
