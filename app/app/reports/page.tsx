import { SectionHeader } from "@/components/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSessionUser } from "@/lib/session";
import { getReportsData } from "@/lib/services/revenueleak";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default async function ReportsPage() {
  const user = await getSessionUser();
  const data = await getReportsData(user.businessId);

  const conversionRate =
    data.conversionSummary.totalOpportunities === 0
      ? 0
      : data.conversionSummary.booked / data.conversionSummary.totalOpportunities;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Reports"
        description="Recovered and influenced revenue, workflow performance, and conversion outcomes."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Recovered Revenue</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-slate-900">
            {formatCurrency(data.recoveredRevenue)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Influenced Revenue</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-slate-900">
            {formatCurrency(data.influencedRevenue)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Bookings Created</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-slate-900">
            {data.bookingsCreated}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-slate-900">
            {formatPercent(conversionRate)}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Workflow comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workflow</TableHead>
                  <TableHead>Opportunities</TableHead>
                  <TableHead>Recovered</TableHead>
                  <TableHead>Influenced</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.workflowComparison.map((row) => (
                  <TableRow key={row.workflow}>
                    <TableCell>{row.workflow.replace("_", " ")}</TableCell>
                    <TableCell>{row.opportunities}</TableCell>
                    <TableCell>{formatCurrency(row.recovered)}</TableCell>
                    <TableCell>{formatCurrency(row.influenced)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Response + conversion summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-md border border-slate-200 p-3">
              <p className="text-slate-500">Calls responded</p>
              <p className="text-xl font-semibold text-slate-900">
                {data.responseTimeSummary.respondedCalls} / {data.responseTimeSummary.totalCalls}
              </p>
            </div>
            <div className="rounded-md border border-slate-200 p-3">
              <p className="text-slate-500">Booked opportunities</p>
              <p className="text-xl font-semibold text-slate-900">
                {data.conversionSummary.booked}
              </p>
            </div>
            <div className="rounded-md border border-slate-200 p-3">
              <p className="text-slate-500">Responded opportunities</p>
              <p className="text-xl font-semibold text-slate-900">
                {data.conversionSummary.responded}
              </p>
            </div>
            <div className="rounded-md border border-slate-200 p-3">
              <p className="text-slate-500">Lost opportunities</p>
              <p className="text-xl font-semibold text-slate-900">
                {data.conversionSummary.lost}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
