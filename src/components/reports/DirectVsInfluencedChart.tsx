"use client";

import { formatCurrency } from "@/lib/formatters";

interface DirectVsInfluencedChartProps {
  direct: number;
  influenced: number;
}

export function DirectVsInfluencedChart({ direct, influenced }: DirectVsInfluencedChartProps) {
  const total = direct + influenced;
  const directPct = total > 0 ? (direct / total) * 100 : 0;

  return (
    <div className="rounded-lg border p-6">
      <h3 className="mb-4 font-semibold">Direct vs. Influenced</h3>
      <div className="space-y-4">
        <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary" style={{ width: `${directPct}%` }} />
        </div>
        <div className="flex justify-between text-sm">
          <div>
            <span className="font-medium">Direct</span>
            <p className="text-muted-foreground">{formatCurrency(direct)}</p>
          </div>
          <div className="text-right">
            <span className="font-medium">Influenced</span>
            <p className="text-muted-foreground">{formatCurrency(influenced)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
