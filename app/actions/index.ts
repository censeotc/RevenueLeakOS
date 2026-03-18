"use server";

import { IntegrationProvider, IntegrationStatus, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getSessionUser } from "@/lib/session";
import {
  addCampaignStep,
  addOpportunityNote,
  archiveTemplate,
  assignOpportunityOwner,
  createCampaign,
  createTemplate,
  createUser,
  duplicateTemplate,
  enrollEstimateInFollowup,
  launchReactivationCampaign,
  logBooking,
  setEstimateOutcome,
  setIntegrationStatus,
  simulateMissedCallWorkflow,
  simulateReply,
  syncStaleEstimateOpportunities,
  updateBusinessSettings,
  updateCampaignStatus,
} from "@/lib/services/revenueleak";

const toNumber = (value: FormDataEntryValue | null, fallback = 0) => {
  const parsed = Number(value ?? fallback);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export async function assignOpportunityOwnerAction(formData: FormData) {
  await getSessionUser();
  const opportunityId = String(formData.get("opportunityId"));
  const assignedUserId = String(formData.get("assignedUserId") ?? "");
  await assignOpportunityOwner(opportunityId, assignedUserId || null);
  revalidatePath("/app/opportunities");
  revalidatePath("/app/dashboard");
}

export async function addOpportunityNoteAction(formData: FormData) {
  const user = await getSessionUser();
  const opportunityId = String(formData.get("opportunityId"));
  const content = String(formData.get("content") ?? "").trim();
  if (!content) return;
  await addOpportunityNote(opportunityId, user.id, content);
  revalidatePath("/app/opportunities");
  revalidatePath("/app/dashboard");
}

export async function simulateMissedCallAction(formData: FormData) {
  const user = await getSessionUser();
  await simulateMissedCallWorkflow({
    businessId: user.businessId,
    fromNumber: String(formData.get("fromNumber") ?? ""),
    toNumber: String(formData.get("toNumber") ?? "+12485550111"),
    contactName: String(formData.get("contactName") ?? ""),
  });
  revalidatePath("/app/calls");
  revalidatePath("/app/opportunities");
  revalidatePath("/app/dashboard");
  revalidatePath("/app/reports");
}

export async function simulateReplyAction(formData: FormData) {
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const body = String(formData.get("body") ?? "Yes, I would like to book.");
  if (!opportunityId) return;
  await simulateReply(opportunityId, body);
  revalidatePath("/app/calls");
  revalidatePath("/app/opportunities");
  revalidatePath("/app/dashboard");
}

export async function logBookingAction(formData: FormData) {
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const revenue = toNumber(formData.get("revenue"), 650);
  if (!opportunityId) return;
  await logBooking(opportunityId, revenue);
  revalidatePath("/app/calls");
  revalidatePath("/app/opportunities");
  revalidatePath("/app/dashboard");
  revalidatePath("/app/reports");
}

export async function syncStaleEstimateAction() {
  const user = await getSessionUser();
  await syncStaleEstimateOpportunities(user.businessId);
  revalidatePath("/app/estimates");
  revalidatePath("/app/opportunities");
  revalidatePath("/app/dashboard");
}

export async function enrollEstimateAction(formData: FormData) {
  const estimateId = String(formData.get("estimateId") ?? "");
  if (!estimateId) return;
  await enrollEstimateInFollowup(estimateId);
  revalidatePath("/app/estimates");
  revalidatePath("/app/opportunities");
  revalidatePath("/app/dashboard");
}

export async function setEstimateOutcomeAction(formData: FormData) {
  const estimateId = String(formData.get("estimateId") ?? "");
  const status = String(formData.get("status") ?? "responded") as
    | "responded"
    | "booked"
    | "lost";
  const revenue = toNumber(formData.get("revenue"), 0);
  if (!estimateId) return;
  await setEstimateOutcome({
    estimateId,
    status,
    revenue: revenue > 0 ? revenue : undefined,
  });
  revalidatePath("/app/estimates");
  revalidatePath("/app/opportunities");
  revalidatePath("/app/dashboard");
  revalidatePath("/app/reports");
}

export async function launchReactivationAction(formData: FormData) {
  const user = await getSessionUser();
  const segment = String(formData.get("segment")) as
    | "no_service_12_months"
    | "maintenance_due"
    | "membership_renewal"
    | "replacement_cycle";
  await launchReactivationCampaign({
    businessId: user.businessId,
    userId: user.id,
    segment,
  });
  revalidatePath("/app/reactivation");
  revalidatePath("/app/campaigns");
  revalidatePath("/app/opportunities");
  revalidatePath("/app/dashboard");
  revalidatePath("/app/reports");
}

export async function createCampaignAction(formData: FormData) {
  const user = await getSessionUser();
  await createCampaign({
    businessId: user.businessId,
    userId: user.id,
    name: String(formData.get("name") ?? "New Campaign"),
    segment: String(formData.get("segment") ?? "custom"),
  });
  revalidatePath("/app/campaigns");
}

export async function updateCampaignStatusAction(formData: FormData) {
  const campaignId = String(formData.get("campaignId") ?? "");
  const status = String(formData.get("status") ?? "draft");
  if (!campaignId) return;
  await updateCampaignStatus(campaignId, status);
  revalidatePath("/app/campaigns");
}

export async function addCampaignStepAction(formData: FormData) {
  const campaignId = String(formData.get("campaignId") ?? "");
  const channel = String(formData.get("channel") ?? "sms") as "sms" | "email";
  if (!campaignId) return;
  await addCampaignStep({
    campaignId,
    channel,
    delayHours: toNumber(formData.get("delayHours"), 24),
    bodyOverride: String(formData.get("bodyOverride") ?? ""),
  });
  revalidatePath("/app/campaigns");
}

export async function createTemplateAction(formData: FormData) {
  const user = await getSessionUser();
  await createTemplate({
    businessId: user.businessId,
    userId: user.id,
    name: String(formData.get("name") ?? ""),
    type: String(formData.get("type") ?? "sms") as "sms" | "email",
    subject: String(formData.get("subject") ?? "") || undefined,
    content: String(formData.get("content") ?? ""),
  });
  revalidatePath("/app/templates");
}

export async function duplicateTemplateAction(formData: FormData) {
  const templateId = String(formData.get("templateId") ?? "");
  if (!templateId) return;
  await duplicateTemplate(templateId);
  revalidatePath("/app/templates");
}

export async function archiveTemplateAction(formData: FormData) {
  const templateId = String(formData.get("templateId") ?? "");
  if (!templateId) return;
  await archiveTemplate(templateId);
  revalidatePath("/app/templates");
}

export async function setIntegrationStatusAction(formData: FormData) {
  const user = await getSessionUser();
  const provider = String(formData.get("provider")) as IntegrationProvider;
  const status = String(formData.get("status")) as IntegrationStatus;
  await setIntegrationStatus({
    businessId: user.businessId,
    provider,
    status,
  });
  revalidatePath("/app/integrations");
}

export async function updateBusinessSettingsAction(formData: FormData) {
  const user = await getSessionUser();
  await updateBusinessSettings({
    businessId: user.businessId,
    timezone: String(formData.get("timezone") ?? "America/Detroit"),
    staleEstimateDays: toNumber(formData.get("staleEstimateDays"), 7),
    attributionWindowDays: toNumber(formData.get("attributionWindowDays"), 14),
    highValueThreshold: toNumber(formData.get("highValueThreshold"), 2500),
    duplicateMissedCallSuppressionHours: toNumber(
      formData.get("duplicateMissedCallSuppressionHours"),
      4,
    ),
  });
  revalidatePath("/app/settings");
}

export async function createUserAction(formData: FormData) {
  const user = await getSessionUser();
  const password = String(formData.get("password") ?? "TempPass123!");
  await createUser({
    businessId: user.businessId,
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    role: String(formData.get("role") ?? "csr") as UserRole,
    passwordHash: await bcrypt.hash(password, 10),
  });
  revalidatePath("/app/settings");
}
