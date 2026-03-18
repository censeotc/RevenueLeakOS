import { CampaignStatus, IntegrationStatus, OpportunityStatus, OpportunityType } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { OPPORTUNITY_TYPE_LABELS } from "@/lib/constants";

export function OpportunityTypeBadge({ type }: { type: OpportunityType }) {
  const variant =
    type === "missed_call" ? "warning" : type === "estimate_rescue" ? "secondary" : "success";
  return <Badge variant={variant}>{OPPORTUNITY_TYPE_LABELS[type]}</Badge>;
}

export function OpportunityStatusBadge({ status }: { status: OpportunityStatus }) {
  const variant =
    status === "booked"
      ? "success"
      : status === "lost"
        ? "destructive"
        : status === "responded"
          ? "secondary"
          : "outline";
  return <Badge variant={variant}>{status.replace("_", " ")}</Badge>;
}

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const variant =
    status === "active"
      ? "success"
      : status === "paused"
        ? "warning"
        : status === "completed"
          ? "secondary"
          : "outline";
  return <Badge variant={variant}>{status}</Badge>;
}

export function IntegrationStatusBadge({ status }: { status: IntegrationStatus }) {
  const variant =
    status === "connected" ? "success" : status === "error" ? "destructive" : "outline";
  return <Badge variant={variant}>{status}</Badge>;
}
