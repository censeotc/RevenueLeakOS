import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AlertItem } from "@/types/revenue";

const severityVariant = { critical: "danger", warning: "warning", info: "info" } as const;

export function AlertsPanel({ alerts }: { alerts: AlertItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts</CardTitle>
        <CardDescription>Issues that may affect recovery rates or routing quality.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <div className="rounded-xl border border-slate-100 p-4" key={alert.id}>
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-slate-900">{alert.title}</p>
              <Badge variant={severityVariant[alert.severity]}>{alert.severity}</Badge>
            </div>
            <p className="mt-2 text-sm text-slate-600">{alert.detail}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
