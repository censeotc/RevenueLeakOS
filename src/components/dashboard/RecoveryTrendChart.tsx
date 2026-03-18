"use client";

import type { RecoveryTrendPoint } from "@/types/revenue";

interface RecoveryTrendChartProps {
  data: RecoveryTrendPoint[];
}

export function RecoveryTrendChart({ data }: RecoveryTrendChartProps) {
  return (
    <div className="rounded-lg border p-6">
      <h3 className="mb-4 font-semibold">Recovery Trend</h3>
      <div className="flex h-48 items-end gap-2">
        {data.map((point) => (
          <div key={point.date} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex w-full gap-0.5">
              <div
                className="w-1/2 rounded-t bg-primary"
                style={{ height: `${(point.recovered / 100) * 1}px` }}
              />
              <div
                className="w-1/2 rounded-t bg-muted-foreground/30"
                style={{ height: `${(point.missed / 100) * 1}px` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{point.date.slice(5)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
