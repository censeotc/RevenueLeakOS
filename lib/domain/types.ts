import { z } from "zod";

export const industries = [
  "hvac",
  "plumbing",
  "electrical",
  "multi_trade",
  "other",
] as const;
export const userRoles = ["owner", "manager", "csr", "readonly"] as const;
export const contactTypes = ["lead", "customer", "former_customer"] as const;
export const contactStatuses = ["active", "dormant", "archived"] as const;
export const opportunityTypes = [
  "missed_call",
  "estimate_rescue",
  "reactivation",
] as const;
export const opportunityStatuses = [
  "new",
  "attempted",
  "responded",
  "qualified",
  "booked",
  "lost",
  "paused",
  "closed",
] as const;
export const estimateStatuses = [
  "open",
  "stale",
  "responded",
  "booked",
  "lost",
] as const;
export const campaignTypes = [
  "missed_call_followup",
  "estimate_rescue",
  "reactivation",
] as const;
export const campaignStatuses = [
  "draft",
  "scheduled",
  "active",
  "paused",
  "completed",
] as const;
export const channelTypes = ["sms", "email"] as const;
export const messageDirections = ["outbound", "inbound"] as const;
export const messageStatuses = [
  "queued",
  "sent",
  "delivered",
  "failed",
  "replied",
] as const;
export const attributionMethods = ["direct", "influenced"] as const;
export const bookingSourceTypes = [
  "missed_call",
  "estimate_rescue",
  "reactivation",
  "manual",
] as const;
export const integrationProviders = [
  "twilio",
  "jobber",
  "housecall_pro",
  "servicetitan",
  "gmail",
  "outlook",
  "google_calendar",
  "csv",
] as const;
export const integrationStatuses = [
  "connected",
  "disconnected",
  "error",
  "pending",
] as const;

export const onboardingSchema = z.object({
  businessName: z.string().min(2),
  timezone: z.string().min(3),
  staleEstimateDays: z.number().min(1).max(60),
  attributionWindowDays: z.number().min(1).max(45),
  highValueThreshold: z.number().min(500),
});

export const templateEditorSchema = z.object({
  name: z.string().min(2),
  type: z.enum(campaignTypes),
  channel: z.enum(channelTypes),
  body: z.string().min(10),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type UserRoleValue = (typeof userRoles)[number];
export type OpportunityTypeValue = (typeof opportunityTypes)[number];

export type DashboardKpi = {
  label: string;
  value: string;
  trend: string;
};

export type RecoveryTrendPoint = {
  date: string;
  influencedRevenue: number;
  recoveredRevenue: number;
};

export type WorkflowPerformancePoint = {
  workflow: "missed_call" | "estimate_rescue" | "reactivation";
  opportunities: number;
  recovered: number;
};
