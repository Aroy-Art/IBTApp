import type { NextFunction, Request, Response } from "express";
import express from "express";
import { z } from "zod";

import type { Classification, ClassificationRule } from "./data";
import {
  classify,
  createTransaction,
  deleteTransaction,
  getTransaction,
  getTransactions,
  loadClassificationRules,
  loadTransactions,
  saveTransactions,
} from "./data";
import { pool as db } from "./db";
import {
  createTransactionSchema,
  dateRangeQuerySchema,
  idParamsSchema,
  updateTransactionSchema,
} from "./schemas";
import { isDateString, isUUID } from "./utils";

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

function validate<T extends z.ZodType>(
  schema: T,
  data: unknown,
  res: Response,
): z.infer<T> | undefined {
  const result = schema.safeParse(data);
  if (!result.success) {
    res.status(400).json({ error: z.prettifyError(result.error) });
    return undefined;
  }
  return result.data;
}

app.use(express.json());

// log the requests to terminal
app.use((req: Request, res: Response, next: NextFunction) => {
  res.on("finish", () => {
    console.log(`${req.method} ${req.url} ${res.statusCode}`);
  });

  next();
});

// Get transactions
app.get("/transactions", async (req: Request, res: Response) => {
  const query = validate(dateRangeQuerySchema, req.query, res);
  if (!query) return;

  res.json(await getTransactions(query));
});

// Get classifications
app.get("/classifications", (_req: Request, res: Response) => {
  const classifications: ClassificationRule[] = loadClassificationRules();
  res.json(classifications);
});

// Get transaction by id
app.get("/transactions/:id", async (req: Request, res: Response) => {
  const params = validate(idParamsSchema, req.params, res);
  if (!params) return;

  const transaction = await getTransaction(params.id);
  if (!transaction) {
    res.status(404).json({ error: `Transaction ${params.id} not found` });
    return;
  }

  res.json(transaction);
});

// Put transaction by id
app.put("/transactions/:id", (req: Request, res: Response) => {
  const valId = idParamsSchema.safeParse(req.params);

  if (!valId.success) {
    return res.status(400).json({ errors: z.flattenError(valId.error) });
  }
  const { id } = valId.data;
  const valBody = updateTransactionSchema.safeParse(req.body);

  if (!valBody.success) {
    return res.status(400).json({ errors: z.flattenError(valBody.error) });
  }

  let { date, recipient, amount } = valBody.data;

  const transactions = loadTransactions();
  const index = transactions.findIndex((t) => t.id === id);

  if (index === -1) {
    res.status(404).json({ error: `Transaction ${id} not found` });
    return;
  }

  if (amount !== undefined && amount > 0) {
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
app.post("/transactions", async (req: Request, res: Response) => {
  const valBody = validate(createTransactionSchema, req.body, res);

  if (!valBody) return;

  if (valBody.amount > 0) {
    valBody.amount = -valBody.amount;
  }

  const transaction = await createTransaction(valBody);

  res.status(201).json({
    message: "New transaction added successfully",
    transaction,
  });
});

// Delete transaction
app.delete("/transactions/:id", async (req: Request, res: Response) => {
  const params = validate(idParamsSchema, req.params, res);
  if (!params) return;

  const transaction = await deleteTransaction(params.id);

  if (!transaction) {
    res.status(404).json({ error: `Transaction ${params.id} not found` });
    return;
  }

  res.json({ message: "Transaction deleted successfully.", transaction });
});

// Catch all other paths and return 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof SyntaxError) {
    res.status(400).json({ error: "Request body is not valid JSON" });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Check DB Connection before start
db.query(`SELECT 1`)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error(`Could not connect to database: ${err.message}`);
    console.error("Is it running? Try: docker compose up -d");
    process.exit(1);
  });
