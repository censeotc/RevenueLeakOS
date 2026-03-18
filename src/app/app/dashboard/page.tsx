import { QuickActions } from "@/components/interactive";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/demo-data";
import { formatCurrency, formatDate, minutesLabel } from "@/lib/utils";

export default async function DashboardPage() {
  const data = getDashboardData();

  const metrics = [
    { label: "Revenue Influenced", value: formatCurrency(data.summary.revenueInfluenced) },
    { label: "Opportunities Recovered", value: `${data.summary.opportunitiesRecovered}` },
    { label: "Bookings Created", value: `${data.summary.bookingsCreated}` },
    { label: "Avg Response Time", value: minutesLabel(data.summary.avgResponseTimeMinutes) },
    { label: "Estimates Reopened", value: `${data.summary.estimatesReopened}` },
    { label: "Customers Reactivated", value: `${data.summary.customersReactivated}` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">Dashboard</p>
          <h1 className="text-3xl font-semibold tracking-tight">Opportunity-centered revenue recovery</h1>
          <p className="mt-2 max-w-3xl text-sm text-zinc-500">
            Every missed call, estimate rescue, and reactivation flow creates or updates a shared opportunity record for attribution and operational follow-through.
          </p>
        </div>
        <Badge variant="info">Demo tenant: {data.business.name}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="pb-3">
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-3xl">{metric.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>
              Trigger the mocked missed-call workflow, simulate replies, and create bookings to watch the dashboard and reports update.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <QuickActions />
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-zinc-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Open missed calls</p>
                <p className="mt-2 text-2xl font-semibold">{data.quickActionCounts.missedCallsOpen}</p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Stale estimates</p>
                <p className="mt-2 text-2xl font-semibold">{data.quickActionCounts.staleEstimates}</p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Dormant segment size</p>
                <p className="mt-2 text-2xl font-semibold">{data.quickActionCounts.dormantContacts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
            <CardDescription>Critical items surfaced from activity and workflow state.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.alerts.map((alert) => (
              <div key={alert.id} className="rounded-xl border border-zinc-200 p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <Badge variant={alert.severity === "critical" ? "danger" : alert.severity === "warning" ? "warning" : "info"}>{alert.severity}</Badge>
                  <span className="text-xs text-zinc-500">{formatDate(alert.createdAt)}</span>
                </div>
                <p className="font-medium">{alert.title}</p>
                <p className="mt-1 text-sm text-zinc-500">{alert.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Recent bookings, messages, alerts, and campaign events across the unified opportunity pipeline.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.recentActivity.map((item) => (
            <div key={item.id} className="flex flex-col gap-2 rounded-xl border border-zinc-200 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-zinc-500">{item.detail}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{item.type}</Badge>
                <span className="text-xs text-zinc-500">{formatDate(item.createdAt)}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
