import Link from "next/link";
import { ArrowRight, PhoneCall, PlayCircle, Plus, Receipt } from "lucide-react";

import { KpiCard } from "@/components/app-shell/kpi-card";
import { PageHeader } from "@/components/app-shell/page-header";
import { RecoveryTrendChart } from "@/components/charts/recovery-trend-chart";
import { WorkflowPerformanceChart } from "@/components/charts/workflow-performance-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAlerts, getBusiness, getRecentActivity } from "@/lib/data/selectors";
import {
  getDashboardMetrics,
  getRecoveryTrend,
  getWorkflowPerformance,
} from "@/lib/services/reporting-service";
import { formatCompactCurrency, formatCurrency, formatRelativeTime, titleCase } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const business = getBusiness();
  const metrics = getDashboardMetrics();
  const alerts = getAlerts();
  const recentActivity = getRecentActivity();
  const workflowPerformance = getWorkflowPerformance();
  const recoveryTrend = getRecoveryTrend();

  return (
    <>
      <PageHeader
        eyebrow={business.name}
        title="Recovered Revenue Overview"
        description="Track recovered bookings, influenced revenue, and workflow efficiency across missed calls, stale estimates, and reactivation plays."
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/app/demo-walkthrough">
                <PlayCircle className="h-4 w-4" />
                View walkthrough
              </Link>
            </Button>
            <Button asChild>
              <Link href="/app/opportunities">
                <ArrowRight className="h-4 w-4" />
                Open inbox
              </Link>
            </Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <KpiCard
          title="Revenue Influenced"
          value={formatCompactCurrency(metrics.revenueInfluenced)}
          change="+18%"
          helper="Attributed to recovery workflows and reactivation sequences"
        />
        <KpiCard
          title="Opportunities Recovered"
          value={String(metrics.opportunitiesRecovered)}
          change="+11%"
          helper="Opportunities that have progressed to responded, qualified, or booked"
        />
        <KpiCard
          title="Bookings Created"
          value={String(metrics.bookingsCreated)}
          change="+9%"
          helper="Bookings logged from missed-call, estimate rescue, and reactivation flows"
        />
        <KpiCard
          title="Avg Response Time"
          value={`${metrics.avgResponseMinutes} min`}
          change="-3m"
          helper="Speed to first outbound touch after workflow trigger"
        />
        <KpiCard
          title="Estimates Reopened"
          value={String(metrics.estimatesReopened)}
          change="+6%"
          helper="Stale proposals now back in conversation or booked"
        />
        <KpiCard
          title="Customers Reactivated"
          value={String(metrics.customersReactivated)}
          change="+14%"
          helper="Dormant households that returned to the funnel"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Workflow performance</CardTitle>
            <CardDescription>Recovered revenue by opportunity type</CardDescription>
          </CardHeader>
          <CardContent>
            <WorkflowPerformanceChart data={workflowPerformance} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recovery trend</CardTitle>
            <CardDescription>Direct and influenced revenue trend over time</CardDescription>
          </CardHeader>
          <CardContent>
            <RecoveryTrendChart data={recoveryTrend} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Latest operational changes across the tenant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div>
                  <p className="font-medium text-slate-900">{activity.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{activity.message}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {activity.opportunity?.title ?? activity.contact?.firstName ?? "System"}
                  </p>
                </div>
                <span className="text-xs text-slate-400">{formatRelativeTime(activity.createdAt)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
              <CardDescription>Operator-facing priorities surfaced from demo data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-900">{alert.title}</p>
                    <Badge
                      variant={
                        alert.severity === "high"
                          ? "danger"
                          : alert.severity === "medium"
                            ? "warning"
                            : "info"
                      }
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{alert.message}</p>
                  <Button asChild variant="ghost" className="mt-3 px-0 text-sky-700 hover:bg-transparent">
                    <Link href={alert.href}>{alert.actionLabel}</Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>Common next steps for an owner or manager</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {[
                {
                  href: "/app/calls",
                  icon: PhoneCall,
                  title: "Review missed calls",
                  subtitle: "Respond to missed and after-hours leads fast",
                },
                {
                  href: "/app/estimates",
                  icon: Receipt,
                  title: "Enroll stale estimates",
                  subtitle: "Pull aging proposals into estimate rescue",
                },
                {
                  href: "/app/reactivation",
                  icon: Plus,
                  title: "Launch reactivation segment",
                  subtitle: "Recover dormant customers with a campaign",
                },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-slate-100 p-2">
                      <action.icon className="h-4 w-4 text-slate-700" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{action.title}</p>
                      <p className="text-sm text-slate-500">{action.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business defaults</CardTitle>
              <CardDescription>Tenant-level workflow controls loaded from seed data</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-slate-600">
              {[
                ["Timezone", business.timezone],
                ["Stale estimate threshold", `${business.staleEstimateDays} days`],
                ["Attribution window", `${business.attributionWindowDays} days`],
                ["High-value threshold", formatCurrency(business.highValueThreshold)],
                [
                  "Missed-call suppression",
                  `${business.duplicateMissedCallSuppressionHours} hours`,
                ],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <span>{titleCase(label)}</span>
                  <span className="font-medium text-slate-900">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
