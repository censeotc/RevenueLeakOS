import { KpiCard } from "@/components/kpi-card";
import { SectionHeader } from "@/components/section-header";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionUser } from "@/lib/session";
import { formatCurrency } from "@/lib/utils";
import { getDashboardData } from "@/lib/services/reportingService";
import {
  launchReactivationAction,
  simulateMissedCallAction,
  syncStaleEstimateAction,
} from "@/app/actions";

export default async function DashboardPage() {
  const user = await getSessionUser();
  const data = await getDashboardData(user.businessId);

  const kpis = [
    { label: "Revenue Influenced", value: formatCurrency(data.kpis.revenueInfluenced) },
    { label: "Opportunities Recovered", value: String(data.kpis.opportunitiesRecovered) },
    { label: "Bookings Created", value: String(data.kpis.bookingsCreated) },
    { label: "Avg Response Time", value: `${data.kpis.avgResponseTime} min` },
    { label: "Estimates Reopened", value: String(data.kpis.estimatesReopened) },
    { label: "Customers Reactivated", value: String(data.kpis.customersReactivated) },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Dashboard"
        description="Unified revenue leak recovery overview for the demo tenant."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentActivity.map((item) => (
                <div key={item.id} className="rounded-md border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-slate-900">{item.message}</p>
                    <Badge variant="outline">{item.action.replace("_", " ")}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.createdAt.toLocaleString("en-US")}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.alerts.map((alert) => (
              <div key={alert.id} className="rounded-md border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm font-medium text-amber-900">{alert.message}</p>
                <p className="text-xs text-amber-700">{alert.alertLevel ?? "notice"}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <form action={simulateMissedCallAction} className="rounded-md border border-slate-200 p-3">
            <input type="hidden" name="contactName" value="Pat Riley" />
            <input type="hidden" name="fromNumber" value="+12485559876" />
            <input type="hidden" name="toNumber" value="+12485550111" />
            <p className="mb-2 text-sm font-medium">Simulate missed call workflow</p>
            <SubmitButton size="sm" pendingLabel="Simulating...">
              Run missed-call flow
            </SubmitButton>
          </form>

          <form action={syncStaleEstimateAction} className="rounded-md border border-slate-200 p-3">
            <p className="mb-2 text-sm font-medium">Refresh stale estimate opportunities</p>
            <SubmitButton size="sm" pendingLabel="Syncing...">
              Sync stale estimates
            </SubmitButton>
          </form>

          <form action={launchReactivationAction} className="rounded-md border border-slate-200 p-3">
            <input type="hidden" name="segment" value="no_service_12_months" />
            <p className="mb-2 text-sm font-medium">Launch reactivation campaign</p>
            <SubmitButton size="sm" pendingLabel="Launching...">
              Launch campaign
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
