import { z } from "zod";

const dateString = z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Use a valid date");

export const paymentSchema = z.object({
  member_name: z.string().trim().min(2, "Member name is required"),
  amount: z.coerce.number().positive("Amount must be positive").max(10000000, "Amount is too large"),
  payment_date: dateString.refine((value) => {
    const input = new Date(`${value}T00:00:00`);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return input <= today;
  }, "Payment date cannot be in the future"),
  due_date: z.string().optional().nullable(),
  status: z.enum(["Paid", "Pending", "Overdue"]),
  payment_method: z.enum(["Transfer", "Cash", "Other"]),
  transaction_ref: z.string().trim().max(50, "Reference is too long").optional().nullable(),
  notes: z.string().trim().max(1000, "Notes are too long").optional().nullable(),
  receipt_url: z.string().url().optional().nullable(),
  receipt_path: z.string().optional().nullable()
});

export const paymentUpdateSchema = paymentSchema.partial().refine((value) => Object.keys(value).length > 0, "No updates supplied");

export const filtersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["All", "Paid", "Pending", "Overdue"]).optional(),
  method: z.enum(["All", "Transfer", "Cash", "Other"]).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortBy: z.enum(["payment_date", "amount", "member_name", "created_at"]).optional(),
  sortDir: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional()
});

export const memberSchema = z.object({
  name: z.string().trim().min(2, "Member name is required"),
  tag: z.string().trim().max(64).optional().nullable(),
  role: z.enum(["Member", "Officer", "Commander"])
});

export const uuidSchema = z.string().uuid();

export type PaymentInput = z.infer<typeof paymentSchema>;
export type PaymentUpdateInput = z.infer<typeof paymentUpdateSchema>;
export type MemberInput = z.infer<typeof memberSchema>;
