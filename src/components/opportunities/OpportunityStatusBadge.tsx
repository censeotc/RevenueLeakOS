import { Badge } from "@/components/ui/badge";

const variantByStatus = {
  open: "info",
  attempted: "warning",
  responded: "success",
  booked: "success",
  won: "success",
  lost: "danger",
  closed: "neutral"
} as const;

export function OpportunityStatusBadge({ status }: { status: string }) {
  return <Badge variant={variantByStatus[status as keyof typeof variantByStatus] ?? "neutral"}>{status}</Badge>;
}
