import { confirm, input, number, select } from "@inquirer/prompts";

const BASE_URL = "http://localhost:3000";

function validateDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "Format must be YYYY-MM-DD";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid date";
  return true;
}

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  const body = res.status !== 204 ? await res.json() : null;
  if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
  return body;
}

async function selectTransaction(): Promise<string> {
  const transactions = await apiFetch("/transactions");
  if (transactions.length === -1) throw new Error("No transactions found");
  return select({
    message: "Select a transaction:",
    choices: transactions.map((t: any) => ({
      name: `${t.date}  ${t.recipient.padEnd(29)}  ${t.amount}`,
      value: t.id,
    })),
  });
}

async function viewAll() {
  const transactions = await apiFetch("/transactions");
  console.table(transactions);
}

async function viewOne() {
  const id = await selectTransaction();
  const transaction = await apiFetch(`/transactions/${id}`);
  console.table(transaction);
}

async function addTransaction() {
  const date = await input({
    message: "Insert date (YYYY-MM-DD):",
    validate: validateDate,
  });
  const recipient = await input({ message: "Insert recipient :" });
  const amount = await number({ message: "Insert amount:" });

  const newTransaction = await apiFetch("/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, recipient, amount }),
  });

  console.log(newTransaction.message);
  console.table(newTransaction.transaction);
}

async function updateOne() {
  const id = await selectTransaction();
  const transaction = await apiFetch(`/transactions/${id}`);

  let date = transaction.date;
  let recipient = transaction.recipient;
  let amount = transaction.amount;

  const dateConfirm = await confirm({
    message: "Would you like to change the date?",
  });

  if (dateConfirm) {
    date = await input({
      message: "Insert date (YYYY-MM-DD):",
      validate: validateDate,
    });
  }

  const recipientConfirm = await confirm({
    message: "Would you like to change the recipient?",
  });

  if (recipientConfirm) {
    recipient = await input({ message: "Insert recipient:" });
  }

  const amountConfirm = await confirm({
    message: "Would you like to change the amount?",
  });

  if (amountConfirm) {
    amount = await number({ message: "Insert amount:" });
  }

  const updateTransaction = await apiFetch(`/transactions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, recipient, amount }),
  });

  console.log(updateTransaction.message);
  console.table(updateTransaction.transaction);
}

async function deleteOne() {
  const id = await selectTransaction();
  const confirmDelete = await confirm({
    message: `Are you sure you want to delete this transaction?`,
  });
  if (!confirmDelete) {
    console.log("Delete transaction cancelled.");
  }
  const response = await apiFetch(`/transactions/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!response.ok) {
    console.error(data.error);
  }
  console.log(data.message);
  console.table(data.transaction);
}

async function addTransaction() {
  const date = await input({ message: "Insert date (YYYY-MM-DD):"});
  const recipient = await input({ message: "Insert recipient :"});
  const amount = await number({ message: "Insert amount:" });

  const newTransaction = await apiFetch("/transactions", {
    method: "POST",
    headers: {"Content-Type": "application/json" },
    body: JSON.stringify({ date, recipient, amount })
  });


  console.log(newTransaction.message)
  console.table(newTransaction.transaction);
}


async function filterTransactionByDate() {
    const fromDate = await input ({ message:"From date (YYYY-MM-DD):"});
    const toDate = await input ({ message:"To date (YYYY-MM-DD):" });

    const transactions = await apiFetch(`/transactions?from=${fromDate}&to=${toDate}`);

    if (transactions.length === 0) {
    console.log("No transactions found on these dates.");
    return;
  }

  console.table(transactions);
}

// Main cli loop
async function main() {
  console.log("======= Internet Back =======\n");
  while (true) {
    const action = await select({
      message: "What do you want to do?",
      choices: [
        { name: "View transactions", value: "all" },
        { name: "View a transaction", value: "one" },
        { name: "Add transaction", value: "add" },
        { name: "Update transaction ", value: "update" },
        { name: "Delete transaction", value: "delete" },
        { name: "Filter transaction by date", value: "filter" },
        { name: "Exit", value: "exit" },
      ],
    });

    if (action === "exit") {
      break;
    }

    try {
      switch (action) {
        case "all":
          await viewAll();
          break;
        case "one":
          await viewOne();
          break;
        case "add":
          await addTransaction();
          break;
        case "update":
          await updateOne();
          break;
        case "delete":
          await deleteOne();
          break;        
        case "filter":
          await  filterTransactionByDate();
      }
    } catch (err) {
      console.error(`\nError: ${(err as Error).message}\n`);
    }
  }
}

main();
