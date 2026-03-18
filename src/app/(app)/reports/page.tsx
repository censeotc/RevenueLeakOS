"use client";

import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoReportSnapshots, demoOpportunities } from "@/lib/demo-data";
import { computeReportSummary, computePeriodComparison } from "@/services/reportingService";
import { formatCurrency, formatMinutes } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  BarChart3,
  Clock,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function ReportsPage() {
  const current = demoReportSnapshots[0];
  const previous = demoReportSnapshots[1];
  const report = computeReportSummary("biz_northshore", 30);
  const comparison = computePeriodComparison("biz_northshore");

  const delta = (curr: number, prev: number) => {
    if (prev === 0) return 0;
    return Math.round(((curr - prev) / prev) * 100);
  };

  const metrics = [
    {
      label: "Revenue Influenced",
      current: formatCurrency(current.revenueInfluenced),
      previous: formatCurrency(previous.revenueInfluenced),
      delta: delta(current.revenueInfluenced, previous.revenueInfluenced),
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Revenue Recovered (Direct)",
      current: formatCurrency(current.revenueRecovered),
      previous: formatCurrency(previous.revenueRecovered),
      delta: delta(current.revenueRecovered, previous.revenueRecovered),
      icon: TrendingUp,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Opportunities Created",
      current: current.opportunitiesCreated.toString(),
      previous: previous.opportunitiesCreated.toString(),
      delta: delta(current.opportunitiesCreated, previous.opportunitiesCreated),
      icon: Target,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Avg Response Time",
      current: formatMinutes(current.avgResponseMinutes),
      previous: formatMinutes(previous.avgResponseMinutes),
      delta: delta(previous.avgResponseMinutes, current.avgResponseMinutes),
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const missedCallOpps = demoOpportunities.filter((o) => o.type === "missed_call");
  const estimateOpps = demoOpportunities.filter((o) => o.type === "estimate_rescue");
  const reactivationOpps = demoOpportunities.filter((o) => o.type === "reactivation");

  const workflowComparison = [
    {
      name: "Missed Call Recovery",
      opportunities: missedCallOpps.length,
      recovered: missedCallOpps.filter((o) => ["booked", "won"].includes(o.status)).length,
      value: missedCallOpps.reduce((sum, o) => sum + o.estimatedValue, 0),
      recoveredValue: missedCallOpps.filter((o) => o.actualValue).reduce((sum, o) => sum + (o.actualValue || 0), 0),
    },
    {
      name: "Estimate Rescue",
      opportunities: estimateOpps.length,
      recovered: estimateOpps.filter((o) => ["booked", "won"].includes(o.status)).length,
      value: estimateOpps.reduce((sum, o) => sum + o.estimatedValue, 0),
      recoveredValue: estimateOpps.filter((o) => o.actualValue).reduce((sum, o) => sum + (o.actualValue || 0), 0),
    },
    {
      name: "Reactivation",
      opportunities: reactivationOpps.length,
      recovered: reactivationOpps.filter((o) => ["booked", "won"].includes(o.status)).length,
      value: reactivationOpps.reduce((sum, o) => sum + o.estimatedValue, 0),
      recoveredValue: reactivationOpps.filter((o) => o.actualValue).reduce((sum, o) => sum + (o.actualValue || 0), 0),
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
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    metric.delta >= 0 ? "text-emerald-600" : "text-red-600"
                  }`}>
                    {metric.delta >= 0 ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Revenue Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Direct Revenue Recovered</p>
                    <p className="text-xs text-muted-foreground">From won opportunities</p>
                  </div>
                  <p className="text-xl font-bold text-emerald-600">{formatCurrency(current.revenueRecovered)}</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Revenue Influenced</p>
                    <p className="text-xs text-muted-foreground">Bookings within attribution window</p>
                  </div>
                  <p className="text-xl font-bold">{formatCurrency(current.revenueInfluenced)}</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Pipeline Value</p>
                    <p className="text-xs text-muted-foreground">Active opportunities total</p>
                  </div>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency(
                      demoOpportunities
                        .filter((o) => !["won", "lost", "closed"].includes(o.status))
                        .reduce((sum, o) => sum + o.estimatedValue, 0)
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conversion Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Conversion Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Overall Conversion Rate</span>
                  <span className="text-lg font-bold">{current.conversionRate}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-primary rounded-full h-3 transition-all"
                    style={{ width: `${current.conversionRate}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{current.missedCallsHandled}</p>
                    <p className="text-xs text-muted-foreground">Calls Handled</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{current.estimatesReopened}</p>
                    <p className="text-xs text-muted-foreground">Estimates Reopened</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{current.customersReactivated}</p>
                    <p className="text-xs text-muted-foreground">Reactivated</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Comparison</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Workflow</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Opportunities</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Recovered</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Conv. Rate</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Pipeline</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Recovered Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {workflowComparison.map((wf) => (
                  <tr key={wf.name} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{wf.name}</td>
                    <td className="px-4 py-3">{wf.opportunities}</td>
                    <td className="px-4 py-3 font-medium text-emerald-600">{wf.recovered}</td>
                    <td className="px-4 py-3">
                      {wf.opportunities > 0 ? Math.round((wf.recovered / wf.opportunities) * 100) : 0}%
                    </td>
                    <td className="px-4 py-3">{formatCurrency(wf.value)}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">{formatCurrency(wf.recoveredValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Response Time Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Response Time Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {demoReportSnapshots.map((snap, i) => {
                const periodLabel = i === 0 ? "Current Period" : i === 1 ? "Previous Period" : "2 Periods Ago";
                const maxMinutes = Math.max(...demoReportSnapshots.map((s) => s.avgResponseMinutes));
                return (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-sm w-32 shrink-0">{periodLabel}</span>
                    <div className="flex-1 bg-muted rounded-full h-6 relative">
                      <div
                        className={`rounded-full h-6 flex items-center px-3 ${
                          i === 0 ? "bg-primary" : "bg-primary/40"
                        }`}
                        style={{ width: `${(snap.avgResponseMinutes / maxMinutes) * 100}%` }}
                      >
                        <span className="text-xs font-medium text-white">
                          {formatMinutes(snap.avgResponseMinutes)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
