import type { IntegrationStatus } from "@/types/revenue";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<IntegrationStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  CONNECTED: { label: "Connected", variant: "default" },
  DISCONNECTED: { label: "Disconnected", variant: "outline" },
  ERROR: { label: "Error", variant: "destructive" },
};

interface IntegrationStatusBadgeProps {
  status: IntegrationStatus;
}

export function IntegrationStatusBadge({ status }: IntegrationStatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
