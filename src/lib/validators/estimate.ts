import { z } from "zod";

export const estimateSchema = z.object({
  externalId: z.string().max(200).optional(),
  title: z.string().max(500).optional(),
  amount: z.number().min(0, "Amount must be non-negative").max(10_000_000),
  status: z.enum(["PENDING", "VIEWED", "ACCEPTED", "DECLINED", "EXPIRED"]).optional(),
  sentAt: z.string().datetime().optional().or(z.null()),
  viewedAt: z.string().datetime().optional().or(z.null()),
  respondedAt: z.string().datetime().optional().or(z.null()),
  notes: z.string().max(2000).optional(),
  contactId: z.string().cuid().optional().or(z.null()),
});

export const estimateUpdateSchema = estimateSchema.partial();

export type EstimateInput = z.infer<typeof estimateSchema>;
export type EstimateUpdateInput = z.infer<typeof estimateUpdateSchema>;
