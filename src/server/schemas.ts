import { z } from "zod";

const dateSchema = z.iso.date("Use the format YYYY-MM-DD");

export const transactionSchema = z.object({
  id: z.uuid("Invalid ID"),
  created_at: dateSchema,
  updated_at: dateSchema.optional(),
  date: dateSchema,
  recipient: z.string().min(1, "Recipient is required"),
  amount: z.number("Amount must be a number"),
});

export const DateRangeQuerySchema = z
  .object({
    from: dateSchema.optional(),
    to: dateSchema.optional(),
  })
  .refine((q) => !q.from || !q.to || q.from <= q.to, {
    error: "'from' date must be before 'to' date",
  });

export type DateRangeQuery = z.infer<typeof DateRangeQuerySchema>;

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

export type Classification = z.infer<typeof classificationSchema>;

export interface Transaction {
  id: string;
  recipient: string;
  amount: number;
  created_at: string;
  updated_at?: string;
  classification?: Classification;
  message?: string;
}
