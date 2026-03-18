/**
 * Opportunity Service
 *
 * Centralises all business logic for opportunity lifecycle management.
 * In demo mode, mutations are logged and return mock results.
 * Connect to Prisma to make mutations persistent.
 */

import { demoOpportunities, demoContacts, demoUsers } from "@/lib/demo-data";
import { sendSMS } from "./twilio";

export type OpportunityType = "missed_call" | "estimate_rescue" | "reactivation";
export type OpportunityStatus =
  | "new"
  | "contacted"
  | "in_progress"
  | "responded"
  | "booked"
  | "won"
  | "lost"
  | "closed";

export interface OpportunityFilters {
  businessId: string;
  type?: OpportunityType;
  status?: OpportunityStatus;
  assignedToId?: string;
  contactId?: string;
}

export interface CreateOpportunityInput {
  type: OpportunityType;
  title: string;
  description?: string;
  estimatedValue?: number;
  contactId: string;
  businessId: string;
  assignedToId?: string;
  source?: string;
}

export interface UpdateOpportunityInput {
  id: string;
  status?: OpportunityStatus;
  assignedToId?: string;
  actualValue?: number;
  resolvedAt?: Date;
}

// ── Query ─────────────────────────────────────────────────────────────────────

export function listOpportunities(filters: OpportunityFilters) {
  let result = demoOpportunities;
  if (filters.type) result = result.filter((o) => o.type === filters.type);
  if (filters.status) result = result.filter((o) => o.status === filters.status);
  if (filters.assignedToId)
    result = result.filter((o) => o.assignedToId === filters.assignedToId);
  if (filters.contactId)
    result = result.filter((o) => o.contactId === filters.contactId);
  return result;
}

export function getOpportunity(id: string) {
  return demoOpportunities.find((o) => o.id === id) ?? null;
}

export function getOpportunityWithRelations(id: string) {
  const opp = demoOpportunities.find((o) => o.id === id);
  if (!opp) return null;
  const contact = demoContacts.find((c) => c.id === opp.contactId) ?? null;
  const assignedTo = opp.assignedToId
    ? demoUsers.find((u) => u.id === opp.assignedToId) ?? null
    : null;
  return { ...opp, contact, assignedTo };
}

// ── Mutations (demo — logs to console, returns synthetic result) ──────────────

export function createOpportunity(input: CreateOpportunityInput) {
  const id = `opp_${Date.now()}`;
  const opp = {
    id,
    ...input,
    status: "new" as const,
    estimatedValue: input.estimatedValue ?? 0,
    actualValue: null,
    createdAt: new Date(),
    resolvedAt: null,
  };
  console.log("[opportunityService] createOpportunity", opp);
  return opp;
}

export function updateOpportunity(input: UpdateOpportunityInput) {
  console.log("[opportunityService] updateOpportunity", input);
  return { ...input, updatedAt: new Date() };
}

export function markWon(id: string, actualValue: number) {
  return updateOpportunity({
    id,
    status: "won",
    actualValue,
    resolvedAt: new Date(),
  });
}

export function markLost(id: string) {
  return updateOpportunity({ id, status: "lost", resolvedAt: new Date() });
}

// ── High-level workflow helpers ───────────────────────────────────────────────

export interface ContactOpportunityResult {
  opportunity: ReturnType<typeof createOpportunity>;
  smsSent: boolean;
  smsBody: string;
}

export async function createMissedCallOpportunity(
  callerNumber: string,
  callerName: string,
  businessName: string,
  businessPhone: string,
  businessId: string
): Promise<ContactOpportunityResult> {
  const firstName = callerName.split(" ")[0] || "Customer";
  const contactId = `ct_new_${Date.now()}`;
  const smsBody = `Hi ${firstName}, we missed your call at ${businessName}! We're sorry we couldn't pick up. How can we help? Reply here or call us back at ${businessPhone}.`;

  const opportunity = createOpportunity({
    type: "missed_call",
    title: `Missed call - ${callerName}`,
    description: "Inbound missed call, auto-SMS sent",
    estimatedValue: 300,
    contactId,
    businessId,
    source: "phone",
  });

  const smsResult = await sendSMS({
    to: callerNumber,
    from: businessPhone,
    body: smsBody,
  });

  return {
    opportunity,
    smsSent: smsResult.status !== "failed",
    smsBody,
  };
}

// ── Metrics ───────────────────────────────────────────────────────────────────

export function computeOpportunityMetrics(businessId: string) {
  const all = demoOpportunities;
  const won = all.filter((o) => o.status === "won");
  const active = all.filter(
    (o) => !["won", "lost", "closed"].includes(o.status)
  );

  const totalEstimatedValue = active.reduce(
    (sum, o) => sum + o.estimatedValue,
    0
  );
  const totalRecoveredValue = won.reduce(
    (sum, o) => sum + (o.actualValue ?? 0),
    0
  );
  const conversionRate = all.length > 0 ? (won.length / all.length) * 100 : 0;

  const byType = {
    missed_call: all.filter((o) => o.type === "missed_call").length,
    estimate_rescue: all.filter((o) => o.type === "estimate_rescue").length,
    reactivation: all.filter((o) => o.type === "reactivation").length,
  };

  return {
    total: all.length,
    active: active.length,
    won: won.length,
    totalEstimatedValue,
    totalRecoveredValue,
    conversionRate: Math.round(conversionRate * 10) / 10,
    byType,
  };
}
