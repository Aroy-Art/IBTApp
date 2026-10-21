import { pool as db } from "./db";
import type {
  CreateTransaction,
  DateRangeQuery,
  Transaction,
  UpdateTransaction,
} from "./schemas";

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

export async function deleteTransaction(
  id: string,
): Promise<Transaction | undefined> {
  const { rows } = await db.query<Transaction>(
    `WITH t AS (DELETE FROM transactions WHERE id = $1 RETURNING *) ${CLASSIFIED}`,
    [id],
  );
  return rows[0] ?? undefined;
}

export async function updateTransaction(
  id: string,
  { created_at, recipient, amount }: UpdateTransaction,
): Promise<Transaction | undefined> {
  const { rows } = await db.query<Transaction>(
    `WITH t AS (
    UPDATE transactions 
      SET created_at = COALESCE($2::date, created_at), 
          recipient  = COALESCE($3::text, recipient),
          amount = COALESCE($4::numeric, amount)
      WHERE id = $1
      RETURNING *
    ) ${CLASSIFIED}`,
    [id, created_at ?? null, recipient ?? null, amount ?? null],
  );
  return rows[0] ?? undefined;
}
