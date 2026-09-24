import type { Request, Response } from "express";
import express from "express";

import type { Classification, ClassificationRule, Transaction } from "./data";
import {
  classify,
  loadClassificationRules,
  loadTransactions,
  saveTransactions,
} from "./data";
import { isDateString, isUUID } from "./utils";

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
app.get("/transactions", (req: Request, res: Response) => {
  let transactions: Transaction[] = loadTransactions();

  const { from, to } = req.query;

  if (from || to) {
    if (from && !isDateString(from as string)) {
      res.status(400).json({ error: "Invalid 'from' date. Use YYYY-MM-DD" });
      return;
    }
    if (to && !isDateString(to as string)) {
      res.status(400).json({ error: "Invalid 'to' date. Use YYYY-MM-DD" });
      return;
    }
    if (from && to && (from as string) > (to as string)) {
      res.status(400).json({ error: "'from' date must be before 'to' date" });
      return;
    }
    transactions = transactions.filter((t) => {
      if (from && t.date < (from as string)) return false;
      if (to && t.date > (to as string)) return false;
      return true;
    });
  }

  const classified: Transaction[] = transactions.map((t) => ({
    ...t,
    classification: classify(t.recipient),
  }));

  res.json(classified);
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
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const transactions = loadTransactions();
  const transaction = transactions.find((t) => t.id === id);

  if (!transaction) {
    res.status(404).json({ error: "Transaction not found" });
    return;
  }

  const classified: Transaction = {
    ...transaction,
    classification: classify(transaction?.recipient),
  };

  res.json(classified);
});

// Put transaction by id
app.put("/transactions/:id", (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!isUUID(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const transactions = loadTransactions();
  const index = transactions.findIndex((t) => t.id === id);

  if (index === -1) {
    res.status(404).json({ error: `Transaction ${id} not found` });
    return;
  }

  let { date, recipient, amount } = req.body;

  if (date && !isDateString(date as string)) {
    res.status(400).json({ error: "Invalid 'date' date. Use YYYY-MM-DD" });
    return;
  }
  if (amount !== undefined && typeof amount !== "number") {
    res.status(400).json({ error: "Invalid 'amount' must be a number" });
    return;
  }

  if (amount > 0) {
    amount = -amount;
  }

  transactions[index] = {
    ...transactions[index],
    ...(date !== undefined && { date }),
    ...(recipient !== undefined && { recipient }),
    ...(amount !== undefined && { amount }),
  };

  saveTransactions(transactions);

  const updated = transactions[index];
  const result = { ...updated, classification: classify(updated.recipient) };

  res.json({
    message: "Transaction updated successfully",
    transaction: result,
  });
});

// Post transaction
app.post("/transactions", (req: Request, res: Response) => {
  let { date, recipient, amount } = req.body;

  if (!date || !isDateString(date)) {
    res.status(400).json({ error: "Invalid 'date'. Use YYYY-MM-DD" });
    return;
  }
  if (typeof recipient !== "string") {
    return res.status(400).json({ error: "Recipient is required" });
  }
  if (typeof amount !== "number") {
    return res.status(400).json({ error: "Amount is required" });
  }
  if (amount > 0) {
    amount = -amount;
  }

  const transactions = loadTransactions();
  const newTransaction = {
    id: crypto.randomUUID(),
    date,
    recipient,
    amount,
  };

  transactions.push(newTransaction);
  saveTransactions(transactions);
  const transaction = newTransaction;
  const result = {
    ...transaction,
    classification: classify(transaction.recipient),
  };
  res.status(201).json({
    message: "New transaction added successfully",
    transaction: result,
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
  const result = {
    ...seclectedTransaction,
    classification: classify(seclectedTransaction.recipient),
  };
  res.json({
    message: "Transaction deleted successfully.",
    transaction: result,
  });
});

// Catch all other paths and return 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
