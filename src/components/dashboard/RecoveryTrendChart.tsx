import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import type { TrendPoint } from "@/types/revenue";

export function RecoveryTrendChart({ points }: { points: TrendPoint[] }) {
  const maxValue = Math.max(...points.map((point) => point.recoveredRevenueCents));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recovery trend</CardTitle>
        <CardDescription>Recovered revenue by day for the current week.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {points.map((point) => (
          <div className="space-y-1" key={point.label}>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>{point.label}</span>
              <span>{formatCurrency(point.recoveredRevenueCents)}</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100">
              <div className="h-3 rounded-full bg-brand-600" style={{ width: `${(point.recoveredRevenueCents / maxValue) * 100}%` }} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
