import type { Alert } from "@/types/revenue";
import { cn } from "@/lib/utils";

interface AlertsPanelProps {
  alerts: Alert[];
}

const severityStyles: Record<string, string> = {
  critical: "border-destructive/50 bg-destructive/5 text-destructive",
  warning: "border-yellow-500/50 bg-yellow-50 text-yellow-800",
  info: "border-blue-500/50 bg-blue-50 text-blue-800",
};

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Alerts</h3>
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              "rounded-md border px-4 py-3 text-sm",
              severityStyles[alert.severity] ?? severityStyles.info
            )}
          >
            {alert.message}
          </div>
        ))}
      </div>
    </div>
  );
}
