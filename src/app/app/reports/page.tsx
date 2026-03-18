"use client";

import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getWorkflowReports,
  getResponseTimeTrend,
  getRevenueBreakdown,
  getCallFunnelStats,
  getEstimateFunnelStats,
  getCurrentPeriodSnapshot,
  getPreviousPeriodSnapshot,
  getUpcomingBookings,
  getPeriodDelta,
} from "@/services/reportingService";
import { demoBookings, getContactById } from "@/lib/demo-data";
import { formatCurrency, formatMinutes, timeAgo } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  BarChart3,
  Clock,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
  FileText,
  CalendarCheck,
} from "lucide-react";

export default function ReportsPage() {
  const current = getCurrentPeriodSnapshot();
  const previous = getPreviousPeriodSnapshot();
  const workflowReports = getWorkflowReports();
  const responseTrend = getResponseTimeTrend();
  const revenue = getRevenueBreakdown();
  const callFunnel = getCallFunnelStats();
  const estimateFunnel = getEstimateFunnelStats();
  const upcomingBookings = getUpcomingBookings();

  const metrics = [
    {
      label: "Revenue Influenced",
      current: formatCurrency(current.revenueInfluenced),
      previous: formatCurrency(previous.revenueInfluenced),
      delta: getPeriodDelta(current.revenueInfluenced, previous.revenueInfluenced),
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Revenue Recovered",
      current: formatCurrency(current.revenueRecovered),
      previous: formatCurrency(previous.revenueRecovered),
      delta: getPeriodDelta(current.revenueRecovered, previous.revenueRecovered),
      icon: TrendingUp,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Opportunities Created",
      current: current.opportunitiesCreated.toString(),
      previous: previous.opportunitiesCreated.toString(),
      delta: getPeriodDelta(current.opportunitiesCreated, previous.opportunitiesCreated),
      icon: Target,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Avg Response Time",
      current: formatMinutes(current.avgResponseMinutes),
      previous: formatMinutes(previous.avgResponseMinutes),
      delta: getPeriodDelta(previous.avgResponseMinutes, current.avgResponseMinutes),
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div>
      <TopBar title="Reports" />
      <div className="p-6 space-y-6">
        {/* Period Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Last 30 Days</h2>
            <p className="text-sm text-muted-foreground">Compared to previous 30 days</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <Card key={metric.label}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`rounded-lg p-2 ${metric.color}`}>
                    <metric.icon className="h-5 w-5" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${metric.delta >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {metric.delta >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    {Math.abs(metric.delta)}%
                  </div>
                </div>
                <p className="text-2xl font-bold">{metric.current}</p>
                <p className="text-xs text-muted-foreground mt-1">{metric.label}</p>
                <p className="text-xs text-muted-foreground">Previous: {metric.previous}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="h-4 w-4" />
                Revenue Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Directly Recovered</p>
                    <p className="text-xs text-muted-foreground">Won opportunities</p>
                  </div>
                  <p className="text-xl font-bold text-emerald-600">{formatCurrency(revenue.directRecovered)}</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Revenue Influenced</p>
                    <p className="text-xs text-muted-foreground">Attribution window</p>
                  </div>
                  <p className="text-xl font-bold">{formatCurrency(revenue.influenced)}</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Active Pipeline</p>
                    <p className="text-xs text-muted-foreground">Open opportunities</p>
                  </div>
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(revenue.pipeline)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call Funnel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Phone className="h-4 w-4" />
                Call Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: "Total Calls", value: callFunnel.total, color: "bg-gray-400" },
                  { label: "Missed / Lost", value: callFunnel.missed, color: "bg-red-400" },
                  { label: "Responded", value: callFunnel.responded, color: "bg-blue-400" },
                  { label: "Booked", value: callFunnel.booked, color: "bg-green-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full shrink-0 ${item.color}`} />
                    <span className="text-sm flex-1">{item.label}</span>
                    <span className="text-sm font-bold">{item.value}</span>
                    <span className="text-xs text-muted-foreground w-10 text-right">
                      {callFunnel.total > 0 ? Math.round((item.value / callFunnel.total) * 100) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Estimate Funnel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" />
                Estimate Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: "Total Estimates", value: estimateFunnel.total, color: "bg-gray-400" },
                  { label: "Stale (7+ days)", value: estimateFunnel.stale, color: "bg-amber-400" },
                  { label: "In Follow-Up", value: estimateFunnel.followUp, color: "bg-blue-400" },
                  { label: "Booked", value: estimateFunnel.booked, color: "bg-green-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full shrink-0 ${item.color}`} />
                    <span className="text-sm flex-1">{item.label}</span>
                    <span className="text-sm font-bold">{item.value}</span>
                    <span className="text-xs text-muted-foreground w-16 text-right">
                      {item.label === "Total Estimates" ? "" : `${formatCurrency(estimateFunnel.atRiskValue / Math.max(estimateFunnel.stale + estimateFunnel.followUp, 1))} avg`}
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>At-risk value</span>
                    <span className="font-semibold text-amber-600">{formatCurrency(estimateFunnel.atRiskValue)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4" />
              Workflow Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Workflow</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Opportunities</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Recovered</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Conv. Rate</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Pipeline</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Recovered $</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {workflowReports.map((wf) => (
                    <tr key={wf.name} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{wf.name}</td>
                      <td className="px-4 py-3">{wf.opportunities}</td>
                      <td className="px-4 py-3 font-medium text-emerald-600">{wf.recovered}</td>
                      <td className="px-4 py-3">{wf.conversionRate}%</td>
                      <td className="px-4 py-3">{formatCurrency(wf.pipelineValue)}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-600">{formatCurrency(wf.recoveredValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Response Time Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4" />
                Response Time Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {responseTrend.map((item, i) => {
                  const max = Math.max(...responseTrend.map((r) => r.avgMinutes));
                  return (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-sm w-36 shrink-0">{item.period}</span>
                      <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                        <div
                          className={`rounded-full h-6 flex items-center px-3 ${i === 0 ? "bg-primary" : "bg-primary/40"}`}
                          style={{ width: `${(item.avgMinutes / max) * 100}%` }}
                        >
                          <span className="text-xs font-medium text-white whitespace-nowrap">
                            {formatMinutes(item.avgMinutes)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarCheck className="h-4 w-4" />
                Upcoming Bookings ({upcomingBookings.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {upcomingBookings.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4">No upcoming bookings.</p>
              ) : (
                <div className="divide-y divide-border">
                  {upcomingBookings.slice(0, 5).map((booking) => {
                    const contact = getContactById(booking.contactId);
                    return (
                      <div key={booking.id} className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{booking.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {contact ? `${contact.firstName} ${contact.lastName}` : "Unknown"} · {booking.serviceType}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium">
                            {new Date(booking.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                          {booking.estimatedValue && (
                            <p className="text-xs text-emerald-600">{formatCurrency(booking.estimatedValue)}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
