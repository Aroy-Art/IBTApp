import { confirm, input, number, select } from "@inquirer/prompts";

const BASE_URL = "http://localhost:3000";

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
        case "add":
          await addTransaction();
          break;

      }
    } catch (err) {
      console.error(`\nError: ${(err as Error).message}\n`);
    }
  }
}

main();
