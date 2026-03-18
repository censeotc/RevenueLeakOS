import { z } from "zod";

export const estimateSchema = z.object({
  number: z.string().min(1, "Estimate number is required"),
  amount: z.number().positive("Amount must be positive"),
  status: z.enum(["PENDING", "APPROVED", "DECLINED", "EXPIRED", "FOLLOW_UP"]),
  issuedAt: z.string().datetime(),
  contactId: z.string().cuid(),
});

export type EstimateInput = z.infer<typeof estimateSchema>;

export const csvEstimateRowSchema = z.object({
  estimate_number: z.string().min(1),
  amount: z.string().transform(Number),
  status: z.string().optional(),
  issued_date: z.string(),
  customer_email: z.string().optional(),
  customer_phone: z.string().optional(),
});
