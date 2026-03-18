import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAppPath } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { reportingService } from "@/lib/services/reportingService";
import { currency } from "@/lib/utils";

export default async function ReportsPage() {
  const session = await requireAppPath("/app/reports");
  const [reportData, snapshots] = await Promise.all([
    reportingService.getReportsData(session.user.businessId),
    prisma.reportSnapshot.findMany({
      where: { businessId: session.user.businessId },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Recovered revenue, attribution, workflow conversion, and response performance insights."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent>
            <p className="text-sm text-slate-500">Recovered Revenue</p>
            <p className="text-2xl font-semibold text-slate-900">
              {currency(reportData.recoveredRevenue)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-slate-500">Direct Revenue</p>
            <p className="text-2xl font-semibold text-slate-900">
              {currency(reportData.directRevenue)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-slate-500">Influenced Revenue</p>
            <p className="text-2xl font-semibold text-slate-900">
              {currency(reportData.influencedRevenue)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-slate-500">Conversion</p>
            <p className="text-2xl font-semibold text-slate-900">
              {reportData.bookedOpportunities}/{Object.values(reportData.byWorkflow).reduce((a, b) => a + b, 0)}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Workflow comparison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(reportData.byWorkflow).map(([workflow, count]) => (
              <div
                key={workflow}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2"
              >
                <span className="text-sm capitalize text-slate-700">{workflow.replace("_", " ")}</span>
                <Badge>{count} opportunities</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report snapshots</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshots.map((snapshot) => (
              <div key={snapshot.id} className="rounded-lg border border-slate-200 p-3">
                <p className="font-medium text-slate-900">{snapshot.label}</p>
                <p className="text-xs text-slate-500">
                  {snapshot.fromDate.toLocaleDateString("en-US")} -{" "}
                  {snapshot.toDate.toLocaleDateString("en-US")}
                </p>
                <pre className="mt-2 overflow-x-auto rounded bg-slate-50 p-2 text-xs text-slate-600">
                  {JSON.stringify(snapshot.metrics, null, 2)}
                </pre>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
