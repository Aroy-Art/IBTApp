import { z } from "zod";

const dateSchema = z.iso.date("Use the format YYYY-MM-DD");

export const classificationSchema = z.enum([
  "Household",
  "Transport",
  "Food",
  "Entertainment",
  "Unknown",
]);

export const createTransactionSchema = z.object({
  created_at: dateSchema,
  recipient: z.string().trim().min(1, "Recipient is required"),
  amount: z.number("Amount must be a number"),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const transactionSchema = createTransactionSchema.extend({
  id: z.uuid("Invalid ID"),
  updated_at: dateSchema.nullable(),
  classification: classificationSchema,
});

// Params
export const idParamsSchema = transactionSchema.pick({ id: true });

export const dateRangeQuerySchema = z
  .object({
    from: dateSchema.optional(),
    to: dateSchema.optional(),
  })
  .refine((q) => !q.from || !q.to || q.from <= q.to, {
    error: "'from' date must be before 'to' date",
  });

export type Classification = z.infer<typeof classificationSchema>;
export type CreateTransaction = z.infer<typeof createTransactionSchema>;
export type UpdateTransaction = z.infer<typeof updateTransactionSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type DateRangeQuery = z.infer<typeof dateRangeQuerySchema>;
