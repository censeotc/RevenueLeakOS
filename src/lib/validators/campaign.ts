import { z } from "zod";

export const campaignStepSchema = z.object({
  order: z.number().int().positive(),
  channel: z.enum(["sms", "email"]),
  templateId: z.string().optional(),
  delayDays: z.number().int().min(0).default(0),
});

export const campaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required").max(200),
  type: z.enum(["ESTIMATE_FOLLOWUP", "REACTIVATION", "MISSED_CALL", "CUSTOM"]),
  steps: z.array(campaignStepSchema).min(1, "At least one step is required"),
});

export type CampaignInput = z.infer<typeof campaignSchema>;
export type CampaignStepInput = z.infer<typeof campaignStepSchema>;
