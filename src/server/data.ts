import fs from "node:fs";
import path from "node:path";

import { pool as db } from "./db";
import type { CreateTransaction, DateRangeQuery, Transaction } from "./schemas";

export type Classification =
  | "Household"
  | "Transport"
  | "Food"
  | "Entertainment"
  | "Unknown";

export interface ClassificationRule {
  recipient: string[];
  classification: Exclude<Classification, "Unknown">;
}

const DATA_DIR = path.join(__dirname, "../../data");

const CLASSIFIED = `
  SELECT t.id, t.created_at, t.recipient, t.amount,
         COALESCE(c.classification, 'Unknown') AS classification
  FROM t
  LEFT JOIN classifications c ON LOWER(c.recipient) = LOWER(t.recipient)
`;

export async function getTransactions({
  from,
  to,
}: DateRangeQuery): Promise<Transaction[]> {
  const { rows } = await db.query<Transaction>(
    `WITH t AS (
       SELECT * FROM transactions
       WHERE ($1::date IS NULL OR created_at >= $1)
         AND ($2::date IS NULL OR created_at <= $2)
     )
     ${CLASSIFIED}
     ORDER BY t.created_at, t.recipient`,
    [from ?? null, to ?? null],
  );
  return rows;
}

export async function getTransaction(
  id: string,
): Promise<Transaction | undefined> {
  const { rows } = await db.query<Transaction>(
    `WITH t AS (SELECT * FROM transactions WHERE id = $1) ${CLASSIFIED}`,
    [id],
  );
  return rows[0] ?? undefined;
}

export async function createTransaction({
  created_at,
  recipient,
  amount,
}: CreateTransaction): Promise<Transaction> {
  const { rows } = await db.query<Transaction>(
    `WITH t AS (INSERT INTO transactions (created_at, recipient, amount) VALUES ($1, $2, $3) RETURNING *) ${CLASSIFIED}`,
    [created_at, recipient, amount],
  );
  return rows[0];
}

export function loadTransactions(): Transaction[] {
  const raw = fs.readFileSync(path.join(DATA_DIR, "transactions.json"), {
    encoding: "utf-8",
    flag: "r",
  });
  return JSON.parse(raw);
}

export function saveTransactions(transactions: Transaction[]): void {
  fs.writeFileSync(
    path.join(DATA_DIR, "transactions.json"),
    JSON.stringify(transactions, null, 2),
  );
}

export function loadClassificationRules(): ClassificationRule[] {
  const raw = fs.readFileSync(path.join(DATA_DIR, "classifications.json"), {
    encoding: "utf-8",
    flag: "r",
  });
  return JSON.parse(raw);
}

export function classify(recipient: string): Classification {
  const rules = loadClassificationRules();
  const match = rules.find((rule) =>
    rule.recipient.some(
      (name) => name.toLowerCase() === recipient.toLowerCase(),
    ),
  );
  return match ? match.classification : "Unknown";
}

export async function deleteTransaction(
  id: string,
): Promise<Transaction | undefined> {
  const { rows } = await db.query<Transaction>(
    `WITH t AS (DELETE FROM transactions WHERE id = $1 RETURNING *) ${CLASSIFIED}`,
    [id],
  );
  return rows[0] ?? undefined;
}
