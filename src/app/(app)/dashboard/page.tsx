"use client";

import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  dashboardSummary,
  demoAlerts,
  demoActivityLogs,
  demoOpportunities,
  getContactById,
  getUserById,
} from "@/services/seededDataService";
import { formatCurrency, formatMinutes, timeAgo, getOpportunityTypeLabel } from "@/lib/utils";
import {
  DollarSign,
  Target,
  CalendarCheck,
  Clock,
  FileText,
  UserPlus,
  Phone,
  ArrowRight,
  AlertCircle,
  TrendingUp,
  Bell,
} from "lucide-react";
import Link from "next/link";

const kpiCards = [
  { label: "Revenue Influenced", value: formatCurrency(dashboardSummary.revenueInfluenced), icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+22%" },
  { label: "Opportunities Recovered", value: dashboardSummary.opportunitiesRecovered.toString(), icon: Target, color: "text-blue-600", bg: "bg-blue-50", trend: "+33%" },
  { label: "Bookings Created", value: dashboardSummary.bookingsCreated.toString(), icon: CalendarCheck, color: "text-purple-600", bg: "bg-purple-50", trend: "+14%" },
  { label: "Avg Response Time", value: formatMinutes(dashboardSummary.avgResponseMinutes), icon: Clock, color: "text-amber-600", bg: "bg-amber-50", trend: "-25%" },
  { label: "Estimates Reopened", value: dashboardSummary.estimatesReopened.toString(), icon: FileText, color: "text-orange-600", bg: "bg-orange-50", trend: "+50%" },
  { label: "Customers Reactivated", value: dashboardSummary.customersReactivated.toString(), icon: UserPlus, color: "text-cyan-600", bg: "bg-cyan-50", trend: "+50%" },
];

function getActivityDescription(log: typeof demoActivityLogs[0]) {
  const meta = log.metadata as Record<string, unknown>;
  switch (log.action) {
    case "opportunity.created":
      return `New ${getOpportunityTypeLabel(meta.type as string)} opportunity for ${meta.contact}`;
    case "sms.sent":
      return `SMS sent using "${meta.template}" template`;
    case "sms.received":
      return `SMS reply received from ${meta.from}`;
    case "call.outbound":
      return `Outbound call (${Math.floor((meta.duration as number) / 60)} min)`;
    case "booking.created":
      return `Booking created: ${meta.service} for ${meta.contact}`;
    case "opportunity.won":
      return `Opportunity won: ${formatCurrency(meta.value as number)} (${getOpportunityTypeLabel(meta.type as string)})`;
    case "estimate.stale":
      return `Estimate flagged as stale: ${formatCurrency(meta.amount as number)} (${meta.days} days)`;
    case "estimate.sent":
      return `Estimate sent: ${formatCurrency(meta.amount as number)} for ${meta.contact}`;
    case "campaign.launched":
      return `Campaign launched: "${meta.name}" (${meta.targets} targets)`;
    default:
      return log.action;
  }
}

function getActivityIcon(action: string) {
  if (action.startsWith("opportunity")) return <Target className="h-4 w-4" />;
  if (action.startsWith("sms")) return <Phone className="h-4 w-4" />;
  if (action.startsWith("call")) return <Phone className="h-4 w-4" />;
  if (action.startsWith("booking")) return <CalendarCheck className="h-4 w-4" />;
  if (action.startsWith("estimate")) return <FileText className="h-4 w-4" />;
  if (action.startsWith("campaign")) return <TrendingUp className="h-4 w-4" />;
  return <AlertCircle className="h-4 w-4" />;
}

export default function DashboardPage() {
  const activeOpportunities = demoOpportunities.filter(
    (o) => !["won", "lost", "closed"].includes(o.status)
  );
  const unreadAlerts = demoAlerts.filter((a) => !a.read);

  return (
    <div>
      <TopBar title="Dashboard" />
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpiCards.map((kpi) => (
            <Card key={kpi.label}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className={`rounded-lg p-2 ${kpi.bg}`}>
                    <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                  <span className={`text-xs font-medium ${kpi.trend.startsWith("+") ? "text-emerald-600" : "text-blue-600"}`}>
                    {kpi.trend}
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <Link href="/app/opportunities" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {demoActivityLogs.slice(0, 8).length > 0 ? (
                    demoActivityLogs.slice(0, 8).map((log) => (
                      <div key={log.id} className="flex items-start gap-3 px-4 py-3">
                        <div className="mt-0.5 rounded-lg bg-muted p-1.5 text-muted-foreground">
                          {getActivityIcon(log.action)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">
                            {getActivityDescription(log)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {timeAgo(log.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4">
                      <EmptyState
                        title="No recent activity"
                        description="Activity logs will appear here as workflows run."
                        className="border-0 bg-transparent p-0"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts + Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Alerts
                  {unreadAlerts.length > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                      {unreadAlerts.length}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {demoAlerts.length > 0 ? (
                    demoAlerts.map((alert) => (
                      <Link
                        key={alert.id}
                        href={alert.linkTo || "#"}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-accent/50 transition-colors"
                      >
                        <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${alert.read ? "bg-gray-300" : "bg-destructive"}`} />
                        <div>
                          <p className={`text-sm ${alert.read ? "text-muted-foreground" : "text-foreground font-medium"}`}>
                            {alert.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{alert.description}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(alert.timestamp)}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4">
                      <EmptyState
                        title="No alerts"
                        description="You are caught up. New alerts will appear here."
                        className="border-0 bg-transparent p-0"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/app/calls">
                  <Button variant="outline" className="w-full justify-between" size="sm">
                    <span className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Review Missed Calls
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/app/estimates">
                  <Button variant="outline" className="w-full justify-between" size="sm">
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Check Stale Estimates
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/app/reactivation">
                  <Button variant="outline" className="w-full justify-between" size="sm">
                    <span className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Launch Reactivation
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/app/campaigns">
                  <Button variant="outline" className="w-full justify-between" size="sm">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      View Campaigns
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Active Opportunities Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Active Opportunities ({activeOpportunities.length})</CardTitle>
            <Link href="/app/opportunities" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Opportunity</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Type</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Contact</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Value</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Assigned</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {activeOpportunities.slice(0, 6).map((opp) => {
                    const contact = getContactById(opp.contactId);
                    const assignee = opp.assignedToId ? getUserById(opp.assignedToId) : null;
                    return (
                      <tr key={opp.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium">{opp.title}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={opp.type} />
                        </td>
                        <td className="px-4 py-3">
                          {contact ? `${contact.firstName} ${contact.lastName}` : "-"}
                        </td>
                        <td className="px-4 py-3 font-medium">{formatCurrency(opp.estimatedValue)}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={opp.status} />
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {assignee?.name || "Unassigned"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{timeAgo(opp.createdAt)}</td>
                      </tr>
                    );
                  })}
                  {activeOpportunities.length === 0 && (
                    <tr>
                      <td className="px-4 py-8" colSpan={7}>
                        <EmptyState
                          title="No active opportunities"
                          description="New opportunities will appear as workflows are triggered."
                          className="border-0 bg-transparent p-0"
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
