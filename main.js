const url = "https://acb-api.algoritmika.org/api/transaction";

// Функция для загрузки транзакций с API
const fetchTransactions = async () => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch transactions');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error loading transactions:", error);
        return [];
    }
};

// Отображение транзакций
const renderTransactions = (transactions) => {
    const grid = document.getElementById("transactionGrid");
    grid.innerHTML = ""; // Очищаем перед рендером
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

// Функция для добавления новой транзакции через API
const addTransaction = async () => {
    const from = prompt("From:");
    const to = prompt("To:");
    const amount = prompt("Amount:");

    if (from && to && amount) {
        const newTransaction = {
            from,
            to,
            amount: parseFloat(amount),
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTransaction),
            });

            if (!response.ok) {
                throw new Error("Failed to add transaction");
            }

            const data = await response.json();
            transactions.push(data); // Добавляем новую транзакцию в локальный список
            renderTransactions(transactions);
        } catch (error) {
            console.error("Error adding transaction:", error);
        }
    }
};

// Функция для редактирования транзакции через API
const editTransaction = async (id) => {
    const transaction = transactions.find((t) => t.id === id);
    if (!transaction) return;

    const from = prompt("Edit From:", transaction.from);
    const to = prompt("Edit To:", transaction.to);
    const amount = prompt("Edit Amount:", transaction.amount);

    if (from && to && amount) {
        const updatedTransaction = {
            from,
            to,
            amount: parseFloat(amount),
        };

        try {
            const response = await fetch(`${url}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedTransaction),
            });

            if (!response.ok) {
                throw new Error("Failed to edit transaction");
            }

            const data = await response.json();
            const index = transactions.findIndex((t) => t.id === id);
            transactions[index] = data; // Обновляем локальную транзакцию
            renderTransactions(transactions);
        } catch (error) {
            console.error("Error editing transaction:", error);
        }
    }
};

// Функция для удаления транзакции через API
const deleteTransaction = async (id) => {
    const confirmation = confirm("Are you sure you want to delete this transaction?");
    if (confirmation) {
        try {
            const response = await fetch(`${url}/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete transaction");
            }

            transactions = transactions.filter((t) => t.id !== id); // Удаляем из локального списка
            renderTransactions(transactions);
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    }
};

// Инициализация страницы
const init = async () => {
    try {
        transactions = await fetchTransactions(); // Загружаем транзакции с API
        renderTransactions(transactions); // Отображаем транзакции
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
};

// Слушатель на кнопку добавления транзакции
document.getElementById("addTransaction").addEventListener("click", addTransaction);

// Инициализация
init();