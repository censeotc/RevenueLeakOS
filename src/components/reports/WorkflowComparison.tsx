"use client";

import type { WorkflowPerformance } from "@/types/revenue";
import { formatCurrency } from "@/lib/formatters";

interface WorkflowComparisonProps {
  data: WorkflowPerformance[];
}

export function WorkflowComparison({ data }: WorkflowComparisonProps) {
  return (
    <div className="rounded-lg border p-6">
      <h3 className="mb-4 font-semibold">Workflow Comparison</h3>
      <div className="space-y-4">
        {data.map((wf) => (
          <div key={wf.workflow} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{wf.workflow}</p>
              <p className="text-sm text-muted-foreground">
                {wf.converted}/{wf.sent} converted ({((wf.converted / wf.sent) * 100).toFixed(1)}%)
              </p>
            </div>
            <p className="font-bold">{formatCurrency(wf.revenue)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
