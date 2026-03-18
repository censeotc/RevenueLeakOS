import type { CampaignStatus } from "@/types/revenue";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<CampaignStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  DRAFT: { label: "Draft", variant: "outline" },
  ACTIVE: { label: "Active", variant: "default" },
  PAUSED: { label: "Paused", variant: "secondary" },
  COMPLETED: { label: "Completed", variant: "secondary" },
};

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
}

export function CampaignStatusBadge({ status }: CampaignStatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
