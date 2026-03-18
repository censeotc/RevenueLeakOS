import { NextResponse } from "next/server";

import { canRunAction } from "@/lib/access";
import { auth } from "@/lib/auth";
import {
  addOpportunityNote,
  archiveTemplate,
  connectOrDisconnectIntegration,
  createCampaign,
  duplicateTemplate,
  testIntegration,
  updateCampaignStatus,
} from "@/lib/demo-data";
import { csvImportService } from "@/services/csv-import-service";
import { opportunityService } from "@/services/opportunity-service";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "Sign in to run demo actions." }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const action = payload?.action;

  if (!action || typeof action !== "string") {
    return NextResponse.json({ ok: false, error: "Invalid demo action payload." }, { status: 400 });
  }

  if (!canRunAction(session.user.role, action)) {
    return NextResponse.json({ ok: false, error: `The ${session.user.role} role cannot run ${action}.` }, { status: 403 });
  }

  let result: unknown = null;

  switch (action) {
    case "simulate_missed_call":
      result = opportunityService.simulateMissedInboundCall();
      break;
    case "simulate_reply":
      result = opportunityService.simulateReply(payload.opportunityId);
      break;
    case "log_booking":
      result = opportunityService.logBooking(payload.opportunityId);
      break;
    case "enroll_estimate_follow_up":
      result = opportunityService.enrollEstimateFollowUp(payload.estimateId);
      break;
    case "mark_estimate":
      result = opportunityService.markEstimateOutcome(payload.estimateId, payload.outcome);
      break;
    case "launch_reactivation":
      result = opportunityService.launchReactivationCampaign(payload.segmentKey);
      break;
    case "assign_owner":
      result = opportunityService.assignOpportunityOwner(payload.opportunityId, payload.ownerUserId);
      break;
    case "add_note":
      result = addOpportunityNote(payload.opportunityId, payload.body, payload.authorUserId);
      break;
    case "duplicate_template":
      result = duplicateTemplate(payload.templateId);
      break;
    case "archive_template":
      result = archiveTemplate(payload.templateId);
      break;
    case "create_campaign":
      result = createCampaign(payload);
      break;
    case "update_campaign_status":
      result = updateCampaignStatus(payload.campaignId, payload.status);
      break;
    case "toggle_integration":
      result = connectOrDisconnectIntegration(payload.provider);
      break;
    case "test_integration":
      result = testIntegration(payload.provider);
      break;
    case "preview_csv_import":
      result = csvImportService.previewCsvImport(payload.entity);
      break;
    default:
      return NextResponse.json({ ok: false, error: `Unknown demo action: ${action}` }, { status: 400 });
  }

  return NextResponse.json({ ok: true, result });
}
