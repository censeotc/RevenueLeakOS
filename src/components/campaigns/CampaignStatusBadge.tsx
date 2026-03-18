import { Badge } from "@/components/ui/badge";

const variantByStatus = { active: "success", draft: "neutral", paused: "warning", completed: "info" } as const;

export function CampaignStatusBadge({ status }: { status: string }) {
  return <Badge variant={variantByStatus[status as keyof typeof variantByStatus] ?? "neutral"}>{status}</Badge>;
}
