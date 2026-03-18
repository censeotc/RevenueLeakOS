import type { OpportunityStatus } from "@/types/revenue";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<OpportunityStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  OPEN: { label: "Open", variant: "outline" },
  IN_PROGRESS: { label: "In Progress", variant: "default" },
  WON: { label: "Won", variant: "secondary" },
  LOST: { label: "Lost", variant: "destructive" },
  DISMISSED: { label: "Dismissed", variant: "secondary" },
};

interface OpportunityStatusBadgeProps {
  status: OpportunityStatus;
}

export function OpportunityStatusBadge({ status }: OpportunityStatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
