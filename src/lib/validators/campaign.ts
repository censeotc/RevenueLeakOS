import { z } from "zod";

export const campaignStepSchema = z.object({
  order: z.number().int().min(1),
  type: z.enum(["SMS", "EMAIL", "WAIT", "CONDITION"]),
  delayDays: z.number().int().min(0),
  delayHours: z.number().int().min(0).max(23),
  subject: z.string().max(500).optional().or(z.null()),
  body: z.string().min(1, "Step body is required").max(1600),
  templateId: z.string().cuid().optional().or(z.null()),
});

export const campaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required").max(200),
  type: z.enum(["ESTIMATE_FOLLOWUP", "MISSED_CALL", "REACTIVATION", "WIN_BACK", "REVIEW_REQUEST", "CUSTOM"]),
  description: z.string().max(1000).optional(),
  goal: z.string().max(500).optional(),
  steps: z.array(campaignStepSchema).min(1, "At least one step is required"),
});

export const campaignUpdateSchema = campaignSchema.partial();

export type CampaignInput = z.infer<typeof campaignSchema>;
export type CampaignUpdateInput = z.infer<typeof campaignUpdateSchema>;
export type CampaignStepInput = z.infer<typeof campaignStepSchema>;
