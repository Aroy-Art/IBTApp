import { z } from "zod";

const dateSchema = z.iso.date("Use the format YYYY-MM-DD" );

export const transactionSchema = z.object({
  id: z.uuid("Invalid ID"),
  date: dateSchema,
  recipient: z.string().min(1, "Recipient is required"),
  amount: z.number("Amount must be a number"),
});

// pick means take only the id field

export const idParamsSchema = transactionSchema.pick({ id: true });

//omit takes everything exept the id(for POST)

export const createTransactionSchema = transactionSchema.omit({ id: true });

//makes all the fields optional (for PUT)

export const updateTransactionSchema = createTransactionSchema.partial();

export const classificationSchema = z.enum([
  "Household",
  "Transport",
  "Food",
  "Entertainment",
  "Unknown",
]);