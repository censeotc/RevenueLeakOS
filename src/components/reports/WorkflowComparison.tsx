import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import type { WorkflowPerformance } from "@/types/revenue";

export function WorkflowComparison({ workflows }: { workflows: WorkflowPerformance[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow comparison</CardTitle>
        <CardDescription>Break down each workflow by win rate, value, and speed-to-first-response.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {workflows.map((workflow) => (
          <div className="grid gap-2 rounded-xl border border-slate-100 p-4 md:grid-cols-4" key={workflow.workflow}>
            <p className="font-medium text-slate-900">{workflow.workflow}</p>
            <p className="text-sm text-slate-600">{formatPercent(workflow.winRate)} win rate</p>
            <p className="text-sm text-slate-600">{formatCurrency(workflow.recoveredRevenueCents)}</p>
            <p className="text-sm text-slate-600">{workflow.averageResponseHours.toFixed(1)}h response</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
