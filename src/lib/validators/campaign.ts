import { z } from "zod";

export const campaignDraftSchema = z.object({
  name: z.string().min(2),
  type: z.string().min(2),
  audienceLabel: z.string().min(2),
  steps: z.array(z.object({
    channel: z.enum(["sms", "email"]),
    delayHours: z.number().int().nonnegative(),
    bodyPreview: z.string().min(5)
  }))
});
