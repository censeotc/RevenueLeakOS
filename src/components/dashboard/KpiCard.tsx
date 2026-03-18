import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { KpiMetric } from "@/types/revenue";

const toneClasses = { positive: "text-emerald-600", neutral: "text-slate-500", warning: "text-amber-600" } as const;

export function KpiCard({ metric }: { metric: KpiMetric }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{metric.label}</CardDescription>
        <CardTitle className="text-3xl">{metric.value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={toneClasses[metric.tone ?? "neutral"]}>{metric.change}</p>
      </CardContent>
    </Card>
  );
}
