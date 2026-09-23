import type { Request, Response } from "express";
import express from "express";

import type { Classification, ClassificationRule, Transaction } from "./data";
import {
  classify,
  loadClassificationRules,
  loadTransactions,
  saveTransactions,
} from "./data";
import { isUUID } from "./utils";

const app = express();
const PORT = 3000;

app.use(express.json());

// log the requests to terminal
app.use((req: Request, res: Response, next) => {
  res.on("finish", () => {
    console.log(`${req.method} ${req.url} ${res.statusCode}`);
  });

  next();
});

// Get transactions
app.get("/transactions", (_req: Request, res: Response) => {
  const transactions: Transaction[] = loadTransactions();
  res.json(transactions);
});

// Get classifications
app.get("/classifications", (_req: Request, res: Response) => {
  const classifications: ClassificationRule[] = loadClassificationRules();
  res.json(classifications);
});

// Get transaction by id
app.get("/transactions/:id", (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!isUUID(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  const transactions = loadTransactions();
  const transaction = transactions.find((t) => t.id === id);

  if (!transaction) {
    res.status(404).json({ message: "Transaction not found" });
    return;
  }

  res.json(transaction);
});

// Post transaction
app.post("/transactions", (req: Request, res: Response) => {
  if (
    !req.body.date ||
    !req.body.recipient ||
    !req.body.amount ||
    typeof req.body.date !== "string" ||
    typeof req.body.recipient !== "string" ||
    typeof req.body.amount !== "number"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const transactions = loadTransactions();

  const newTransaction = {
    id: crypto.randomUUID(),
    date: req.body.date,
    recipient: req.body.recipient,
    amount: req.body.amount,
  };

  transactions.push(newTransaction);
  saveTransactions(transactions);
  res.status(201).json({
    message: "New transaction added successfully",
    transaction: newTransaction,
  });
});

// Delete transaction
app.delete("/transactions/:id", (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!isUUID(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  let transactions = loadTransactions();
  const seclectedTransaction = transactions.find((t) => t.id === id);
  if (!seclectedTransaction) {
    res.status(404).json({ message: "Transaction not found" });
    return;
  }
  transactions = transactions.filter((t) => t.id !== id);

  saveTransactions(transactions);
  res.json({
    message: "Transaction deleted successfully.",
    transaction: seclectedTransaction,
  });
});

// Catch all other paths and return 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
