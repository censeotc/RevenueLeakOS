"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { campaignService } from "@/lib/services/campaign-service";
import { opportunityService } from "@/lib/services/opportunity-service";

function revalidateApp() {
  [
    "/app/dashboard",
    "/app/opportunities",
    "/app/calls",
    "/app/estimates",
    "/app/reactivation",
    "/app/campaigns",
    "/app/contacts",
    "/app/reports",
    "/app/templates",
    "/app/integrations",
    "/app/demo-walkthrough",
    "/app/settings",
  ].forEach((path) => revalidatePath(path));
}

export async function updateOpportunityStatusAction(formData: FormData) {
  const opportunityId = String(formData.get("opportunityId"));
  const status = String(formData.get("status")) as Parameters<
    typeof opportunityService.updateOpportunityStatus
  >[1];

  opportunityService.updateOpportunityStatus(opportunityId, status);
  revalidateApp();
}

export async function assignOpportunityAction(formData: FormData) {
  const opportunityId = String(formData.get("opportunityId"));
  const ownerId = String(formData.get("ownerId"));

  opportunityService.assignOpportunity(opportunityId, ownerId);
  revalidateApp();
}

export async function addOpportunityNoteAction(formData: FormData) {
  const opportunityId = String(formData.get("opportunityId"));
  const authorId = String(formData.get("authorId"));
  const body = String(formData.get("body"));

  if (body.trim()) {
    opportunityService.addOpportunityNote(opportunityId, authorId, body.trim());
    revalidateApp();
  }
}

export async function simulateMissedCallAction(formData: FormData) {
  opportunityService.recordMissedCall({
    firstName: String(formData.get("firstName")),
    lastName: String(formData.get("lastName")),
    phone: String(formData.get("phone")),
    serviceType: String(formData.get("serviceType")),
    summary: String(formData.get("summary")),
    sourceLabel: String(formData.get("sourceLabel") ?? "Inbound call"),
    afterHours: formData.get("afterHours") === "on",
  });
  revalidateApp();
}

export async function simulateReplyAction(formData: FormData) {
  const opportunityId = String(formData.get("opportunityId"));
  const body = String(formData.get("body"));
  opportunityService.simulateReply(opportunityId, body);
  revalidateApp();
}

export async function logBookingAction(formData: FormData) {
  const opportunityId = String(formData.get("opportunityId"));
  const title = String(formData.get("title"));
  const revenue = Number(formData.get("revenue"));
  opportunityService.logBooking(opportunityId, title, revenue);
  revalidateApp();
}

export async function enrollEstimateAction(formData: FormData) {
  opportunityService.enrollEstimateFollowUp(String(formData.get("estimateId")));
  revalidateApp();
}

export async function updateEstimateStatusAction(formData: FormData) {
  opportunityService.updateEstimateStatus(
    String(formData.get("estimateId")),
    String(formData.get("status")) as "responded" | "booked" | "lost",
  );
  revalidateApp();
}

export async function launchReactivationCampaignAction(formData: FormData) {
  campaignService.launchReactivationCampaign(String(formData.get("segmentId")));
  revalidateApp();
}

export async function saveCampaignAction(formData: FormData) {
  campaignService.saveCampaign({
    name: String(formData.get("name")),
    type: String(formData.get("type")) as "missed_call_followup" | "estimate_rescue" | "reactivation",
    segmentName: String(formData.get("segmentName") ?? ""),
    channel: String(formData.get("channel")) as "sms" | "email",
    goal: String(formData.get("goal") ?? ""),
  });
  revalidateApp();
}

export async function updateCampaignStatusAction(formData: FormData) {
  campaignService.updateCampaignStatus(
    String(formData.get("campaignId")),
    String(formData.get("status")) as "draft" | "scheduled" | "active" | "paused" | "completed",
  );
  revalidateApp();
}

export async function duplicateTemplateAction(formData: FormData) {
  campaignService.duplicateTemplate(String(formData.get("templateId")));
  revalidateApp();
}

export async function archiveTemplateAction(formData: FormData) {
  campaignService.archiveTemplate(String(formData.get("templateId")));
  revalidateApp();
}

export async function setIntegrationStatusAction(formData: FormData) {
  campaignService.setIntegrationStatus(
    String(formData.get("integrationId")),
    String(formData.get("status")) as "connected" | "disconnected" | "error" | "pending",
  );
  revalidateApp();
}

export async function completeOnboardingAction() {
  redirect("/app/dashboard");
}
