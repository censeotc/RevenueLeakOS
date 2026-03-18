import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getReportsView } from "@/lib/demo-data";
import { formatCurrency, formatDate, minutesLabel } from "@/lib/utils";

export default async function ReportsPage() {
  const data = getReportsView();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-zinc-500">Reports</p>
        <h1 className="text-3xl font-semibold tracking-tight">Recovered revenue and workflow performance</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><CardHeader><CardDescription>Recovered revenue summary</CardDescription><CardTitle>{formatCurrency(data.summary.directRevenueCents)}</CardTitle></CardHeader><CardContent><p className="text-sm text-zinc-500">Direct revenue recovered</p></CardContent></Card>
        <Card><CardHeader><CardDescription>Influenced revenue</CardDescription><CardTitle>{formatCurrency(data.summary.influencedRevenueCents)}</CardTitle></CardHeader><CardContent><p className="text-sm text-zinc-500">Attributed within the reporting window</p></CardContent></Card>
        <Card><CardHeader><CardDescription>Response time summary</CardDescription><CardTitle>{minutesLabel(data.summary.avgResponseTimeMinutes)}</CardTitle></CardHeader><CardContent><p className="text-sm text-zinc-500">Average time to first response</p></CardContent></Card>
        <Card><CardHeader><CardDescription>Conversion summary</CardDescription><CardTitle>{data.summary.bookingsCreated}</CardTitle></CardHeader><CardContent><p className="text-sm text-zinc-500">Bookings created in the latest snapshot</p></CardContent></Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Workflow comparison</CardTitle><CardDescription>Direct vs influenced revenue by opportunity type.</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {data.workflowComparison.map((item) => (
              <div key={item.type} className="rounded-xl border border-zinc-200 p-4">
                <div className="mb-2 flex items-center justify-between gap-3"><Badge variant="secondary">{item.type}</Badge><span className="text-sm font-medium">{item.recovered} recovered</span></div>
                <div className="grid gap-2 text-sm text-zinc-500 sm:grid-cols-2">
                  <p>Direct: <span className="font-medium text-zinc-900">{formatCurrency(item.directRevenue)}</span></p>
                  <p>Influenced: <span className="font-medium text-zinc-900">{formatCurrency(item.influencedRevenue)}</span></p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Conversion summary</CardTitle><CardDescription>Opportunity-to-booking conversion by workflow.</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {data.conversionSummary.map((item) => (
              <div key={item.type} className="rounded-xl border border-zinc-200 p-4">
                <div className="mb-2 flex items-center justify-between gap-3"><Badge variant="info">{item.type}</Badge><span className="text-sm font-medium">{item.rate}%</span></div>
                <p className="text-sm text-zinc-500">{item.converted} of {item.total} opportunities converted to booked / won.</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Report snapshots</CardTitle><CardDescription>Recent summary rows available for trending or BI export.</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          {data.reportSnapshots.map((snapshot) => (
            <div key={snapshot.id} className="grid gap-3 rounded-xl border border-zinc-200 p-4 md:grid-cols-[0.9fr_0.9fr_0.8fr_0.7fr] md:items-center">
              <p className="font-medium">{formatDate(snapshot.snapshotDate)}</p>
              <p className="text-sm text-zinc-500">Influenced {formatCurrency(snapshot.influencedRevenueCents)}</p>
              <p className="text-sm text-zinc-500">Recovered {snapshot.recoveredOpportunities}</p>
              <p className="text-sm text-zinc-500">Bookings {snapshot.bookingsCreated}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
