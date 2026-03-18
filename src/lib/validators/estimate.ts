import { z } from "zod";

export const estimateImportRowSchema = z.object({
  number: z.string().min(1),
  customer: z.string().min(1),
  serviceType: z.string().min(1),
  amountCents: z.number().int().nonnegative(),
  sentAt: z.string().min(1)
});
