import type { Request, Response } from "express";
import express from "express";

import type { Transaction } from "./data";
import {
  classify,
  loadClassificationRules,
  loadTransactions,
  saveTransactions,
} from "./data";

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

//get transaction by id

app.get('/transactions/:id', (req: Request, res:Response) => {
  const id = Number(req.params.id);
  const transaction = loadTransactions();
  const transaction = transactions.find((t) => t.id === id);

  if (!transaction) {
    res.status(404).json({ message: "Transaction not found" });
    return;
  }

  res.json(transaction);
});



// Get transactions
app.get("/transactions", (_req: Request, res: Response) => {
  const transactions: Transaction[] = loadTransactions();
  res.json(transactions);
});

// Catch all other paths and return 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});


