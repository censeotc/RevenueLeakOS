import { TrendingUp, TrendingDown, DollarSign, Target, Phone, FileText, Calendar, Megaphone } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { reportingService } from "@/services/reportingService";
import { format } from "date-fns";

function TrendIndicator({ value, invert = false }: { value: number; invert?: boolean }) {
  const isGood = invert ? value < 0 : value >= 0;
  return (
    <span className={`flex items-center gap-0.5 text-xs font-medium ${isGood ? "text-success-600" : "text-danger-600"}`}>
      {value >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {value >= 0 ? "+" : ""}{value}%
    </span>
  );
}

export function ReportsPage() {
  const current = reportingService.getCurrentPeriod();
  const previous = reportingService.getPreviousPeriod();
  const trends = reportingService.getTrends();
  const oppBreakdown = reportingService.getOpportunityBreakdown();
  const callMetrics = reportingService.getCallMetrics();
  const estMetrics = reportingService.getEstimateMetrics();
  const campMetrics = reportingService.getCampaignMetrics();
  const bookMetrics = reportingService.getBookingMetrics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {format(current.periodStart, "MMM d")} - {format(current.periodEnd, "MMM d, yyyy")}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500 uppercase font-medium">Revenue Influenced</p>
            <DollarSign size={16} className="text-success-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${current.revenueInfluenced.toLocaleString()}</p>
          <TrendIndicator value={trends.revenueInfluenced} />
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500 uppercase font-medium">Revenue Recovered</p>
            <DollarSign size={16} className="text-success-500" />
          </div>
          <p className="text-2xl font-bold text-success-600">${current.revenueRecovered.toLocaleString()}</p>
          <TrendIndicator value={trends.revenueRecovered} />
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500 uppercase font-medium">Opportunities Created</p>
            <Target size={16} className="text-primary-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{current.opportunitiesCreated}</p>
          <TrendIndicator value={trends.opportunitiesCreated} />
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500 uppercase font-medium">Bookings Created</p>
            <Calendar size={16} className="text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{current.bookingsCreated}</p>
          <TrendIndicator value={trends.bookingsCreated} />
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500 uppercase font-medium">Avg Response Time</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{current.avgResponseMinutes} min</p>
          <TrendIndicator value={trends.avgResponseMinutes} invert />
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500 uppercase font-medium">Conversion Rate</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{current.conversionRate}%</p>
          <TrendIndicator value={trends.conversionRate} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-base font-semibold text-gray-900 mb-4">Opportunity Breakdown</h2>
          <div className="space-y-4">
            {oppBreakdown.map((row) => (
              <div key={row.type}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-700 capitalize">{row.type.replace("_", " ")}</span>
                  <span className="text-sm text-gray-500">{row.total} total</span>
                </div>
                <div className="flex gap-1 h-6 rounded-lg overflow-hidden bg-gray-100">
                  {row.won > 0 && (
                    <div
                      className="bg-success-500 rounded-l-lg flex items-center justify-center text-[10px] text-white font-medium"
                      style={{ width: `${(row.won / row.total) * 100}%` }}
                    >
                      {row.won}W
                    </div>
                  )}
                  {row.open > 0 && (
                    <div
                      className="bg-primary-400 flex items-center justify-center text-[10px] text-white font-medium"
                      style={{ width: `${(row.open / row.total) * 100}%` }}
                    >
                      {row.open}O
                    </div>
                  )}
                  {row.lost > 0 && (
                    <div
                      className="bg-gray-300 rounded-r-lg flex items-center justify-center text-[10px] text-gray-600 font-medium"
                      style={{ width: `${(row.lost / row.total) * 100}%` }}
                    >
                      {row.lost}L
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span>Pipeline: ${row.pipelineValue.toLocaleString()}</span>
                  <span>Recovered: ${row.recoveredValue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <h2 className="text-base font-semibold text-gray-900 mb-3">Call Metrics</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-lg font-bold text-gray-900">{callMetrics.total}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Missed Rate</p>
                <p className="text-lg font-bold text-danger-600">{callMetrics.missedRate}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Avg Duration</p>
                <p className="text-lg font-bold text-gray-900">{Math.floor(callMetrics.avgDuration / 60)}m {callMetrics.avgDuration % 60}s</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-gray-900 mb-3">Estimate Metrics</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">Total Value</p>
                <p className="text-lg font-bold text-gray-900">${estMetrics.totalValue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Stale Value</p>
                <p className="text-lg font-bold text-warning-600">${estMetrics.staleValue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Conversion</p>
                <p className="text-lg font-bold text-success-600">{estMetrics.conversionRate}%</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-gray-900 mb-3">Campaign Metrics</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">Active</p>
                <p className="text-lg font-bold text-gray-900">{campMetrics.activeCampaigns}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Response Rate</p>
                <p className="text-lg font-bold text-primary-600">{campMetrics.responseRate}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Booking Rate</p>
                <p className="text-lg font-bold text-success-600">{campMetrics.bookingRate}%</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {previous && (
        <Card>
          <h2 className="text-base font-semibold text-gray-900 mb-3">Period Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">Metric</th>
                  <th className="text-right py-2 text-xs font-medium text-gray-500 uppercase">Current</th>
                  <th className="text-right py-2 text-xs font-medium text-gray-500 uppercase">Previous</th>
                  <th className="text-right py-2 text-xs font-medium text-gray-500 uppercase">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { label: "Revenue Influenced", c: current.revenueInfluenced, p: previous.revenueInfluenced, fmt: (v: number) => `$${v.toLocaleString()}` },
                  { label: "Revenue Recovered", c: current.revenueRecovered, p: previous.revenueRecovered, fmt: (v: number) => `$${v.toLocaleString()}` },
                  { label: "Opportunities", c: current.opportunitiesCreated, p: previous.opportunitiesCreated, fmt: String },
                  { label: "Bookings", c: current.bookingsCreated, p: previous.bookingsCreated, fmt: String },
                  { label: "Conversion Rate", c: current.conversionRate, p: previous.conversionRate, fmt: (v: number) => `${v}%` },
                ].map((row) => {
                  const change = reportingService.getPercentChange(row.c, row.p);
                  return (
                    <tr key={row.label}>
                      <td className="py-2 text-gray-700">{row.label}</td>
                      <td className="py-2 text-right font-medium text-gray-900">{row.fmt(row.c)}</td>
                      <td className="py-2 text-right text-gray-500">{row.fmt(row.p)}</td>
                      <td className="py-2 text-right">
                        <TrendIndicator value={change} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
