"use client";

import type { WorkflowPerformance } from "@/types/revenue";
import { formatCurrency } from "@/lib/formatters";

interface WorkflowPerformanceChartProps {
  data: WorkflowPerformance[];
}

export function WorkflowPerformanceChart({ data }: WorkflowPerformanceChartProps) {
  return (
    <div className="rounded-lg border p-6">
      <h3 className="mb-4 font-semibold">Workflow Performance</h3>
      <div className="space-y-4">
        {data.map((wf) => (
          <div key={wf.workflow} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>{wf.workflow}</span>
              <span className="font-medium">{formatCurrency(wf.revenue)}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${(wf.converted / wf.sent) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {wf.converted}/{wf.sent} converted
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
