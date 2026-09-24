import { confirm, input, select } from "@inquirer/prompts";

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

async function viewOne() {
  const id = await selectTransaction();
  const t = await apiFetch(`/transactions/${id}`);
  console.table([t]);
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
      }
    } catch (err) {
      console.error(`\nError: ${(err as Error).message}\n`);
    }
  }
}

main();
