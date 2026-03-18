import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireAppPath } from "@/lib/auth/guards";
import { reportingService } from "@/lib/services/reportingService";
import { RecoveryTrendChart } from "@/components/charts/recovery-trend-chart";
import { WorkflowPerformanceChart } from "@/components/charts/workflow-performance-chart";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default async function DashboardPage() {
  const session = await requireAppPath("/app/dashboard");
  const data = await reportingService.getDashboardData(session.user.businessId);

  return (
    <div>
      <PageHeader
        title="Recovered Revenue Overview"
        description="Unified recovery dashboard across missed calls, stale estimates, and dormant customers."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="space-y-2">
              <p className="text-sm text-slate-500">{kpi.label}</p>
              <p className="text-3xl font-semibold text-slate-900">{kpi.value}</p>
              <Badge variant="info">{kpi.trend} vs previous period</Badge>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Recovery trend</CardTitle>
          </CardHeader>
          <CardContent>
            <RecoveryTrendChart data={data.recoveryTrend} />
          </CardContent>
        </Card>
        <div className="space-y-6 xl:col-span-2">
          <QuickActions />
          <Card>
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.alerts.length === 0 ? (
                <p className="text-sm text-slate-500">No active alerts.</p>
              ) : (
                data.alerts.map((alert) => (
                  <div key={alert.id} className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p className="text-sm font-medium text-amber-900">{alert.summary}</p>
                    <p className="mt-1 text-xs text-amber-700">
                      {alert.createdAt.toLocaleString("en-US")}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Workflow performance</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkflowPerformanceChart data={data.workflowPerformance} />
          </CardContent>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentActivity.map((event) => (
              <div key={event.id} className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-medium text-slate-900">{event.summary}</p>
                <p className="text-xs text-slate-500">{event.createdAt.toLocaleString("en-US")}</p>
              </div>
            ))}
            <Link href="/app/opportunities" className="inline-flex">
              <Button variant="ghost" className="px-0 text-slate-600">
                View opportunities
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
