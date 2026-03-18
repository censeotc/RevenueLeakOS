import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  value: string;
};

export function StatusBadge({ value }: StatusBadgeProps) {
  const normalized = value.toLowerCase();
  const variant =
    normalized === "booked" || normalized === "active" || normalized === "connected"
      ? "success"
      : normalized === "lost" || normalized === "error" || normalized === "archived"
        ? "danger"
        : normalized === "paused" || normalized === "stale" || normalized === "pending"
          ? "warning"
          : normalized === "responded" || normalized === "qualified" || normalized === "scheduled"
            ? "info"
            : "default";

  return <Badge variant={variant}>{value.replace(/_/g, " ")}</Badge>;
}
