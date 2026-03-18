import { PageHeader } from "@/components/app-shell/page-header";
import { RecoveryTrendChart } from "@/components/charts/recovery-trend-chart";
import { WorkflowPerformanceChart } from "@/components/charts/workflow-performance-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getConversionSummary,
  getRecoveryTrend,
  getResponseTimeSummary,
  getRevenueSummary,
  getWorkflowComparison,
  getWorkflowPerformance,
} from "@/lib/services/reporting-service";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function ReportsPage() {
  const revenue = getRevenueSummary();
  const workflowComparison = getWorkflowComparison();
  const responseTime = getResponseTimeSummary();
  const conversion = getConversionSummary();
  const workflowPerformance = getWorkflowPerformance();
  const trend = getRecoveryTrend();

  return (
    <>
      <PageHeader
        eyebrow="Revenue reporting"
        title="Reports"
        description="Measure recovered revenue, direct vs influenced attribution, workflow conversion, and response-time efficiency."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recovered revenue summary</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-slate-950">
            {formatCurrency(revenue.totalRevenue)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Direct revenue</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-slate-950">
            {formatCurrency(revenue.directRevenue)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Influenced revenue</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-slate-950">
            {formatCurrency(revenue.influencedRevenue)}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Workflow comparison</CardTitle>
            <CardDescription>Recovered revenue by opportunity type</CardDescription>
          </CardHeader>
          <CardContent>
            <WorkflowPerformanceChart data={workflowPerformance} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Direct vs influenced revenue</CardTitle>
            <CardDescription>Trendline across the current reporting window</CardDescription>
          </CardHeader>
          <CardContent>
            <RecoveryTrendChart data={trend} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Workflow conversion summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workflowComparison.map((workflow) => (
              <div key={workflow.type} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900">{workflow.type.replace(/_/g, " ")}</p>
                  <p className="text-sm text-slate-500">{workflow.conversionRate}%</p>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {workflow.bookingCount} bookings from {workflow.opportunityCount} opportunities
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {formatCurrency(workflow.revenue)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {responseTime.map((item, index) => (
              <div key={`${item.label}-${index}`} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900 capitalize">{item.label}</p>
                  <p className="text-sm text-slate-500">{item.minutes} min</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {conversion.map((item) => (
              <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900">{item.label}</p>
                  <p className="text-xl font-semibold text-slate-950">{item.value}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
