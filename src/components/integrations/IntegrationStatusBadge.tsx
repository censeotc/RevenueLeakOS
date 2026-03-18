import { Badge } from "@/components/ui/badge";

const variantByStatus = { connected: "success", disconnected: "warning", error: "danger" } as const;

export function IntegrationStatusBadge({ status }: { status: string }) {
  return <Badge variant={variantByStatus[status as keyof typeof variantByStatus] ?? "neutral"}>{status}</Badge>;
}
