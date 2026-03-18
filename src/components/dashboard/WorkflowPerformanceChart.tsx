import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import type { WorkflowPerformance } from "@/types/revenue";

export function WorkflowPerformanceChart({ workflows }: { workflows: WorkflowPerformance[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow performance</CardTitle>
        <CardDescription>Compare win rate, response speed, and recovered value by workflow.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {workflows.map((workflow) => (
          <div className="rounded-xl border border-slate-100 p-4" key={workflow.workflow}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-slate-900">{workflow.workflow}</p>
                <p className="text-sm text-slate-600">Avg. response {workflow.averageResponseHours.toFixed(1)}h</p>
              </div>
              <div className="text-right text-sm text-slate-600">
                <p>{formatPercent(workflow.winRate)} win rate</p>
                <p>{formatCurrency(workflow.recoveredRevenueCents)}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
