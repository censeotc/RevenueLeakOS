"use client";

import { useMemo } from "react";
import {
  DollarSign,
  Target,
  Calendar,
  Clock,
  FileText,
  UserCheck,
  Phone,
  MessageSquare,
  BookOpen,
  ArrowUpDown,
  AlertCircle,
  CheckCircle2,
  Info,
  Bell,
  Send,
  Search,
  Megaphone,
  Upload,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatDistanceToNow } from "date-fns";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import {
  DEMO_DASHBOARD_KPIS,
  DEMO_ACTIVITY,
  DEMO_ALERTS,
  DEMO_WORKFLOW_PERFORMANCE,
  DEMO_RECOVERY_TREND,
} from "@/lib/demo-data";

const ACTIVITY_ICONS: Record<string, typeof Phone> = {
  sms_sent: Send,
  sms_received: MessageSquare,
  opportunity_created: Target,
  booking_confirmed: Calendar,
  status_change: ArrowUpDown,
  estimate_stale: FileText,
  opportunity_lost: AlertCircle,
  note_added: BookOpen,
  campaign_started: Megaphone,
  contact_created: UserCheck,
};

const ALERT_BORDER_COLORS: Record<string, string> = {
  warning: "border-l-yellow-500",
  error: "border-l-red-500",
  success: "border-l-green-500",
  info: "border-l-blue-500",
};

const ALERT_ICONS: Record<string, typeof AlertCircle> = {
  warning: Bell,
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const KPI_CARDS = [
  {
    key: "revenueInfluenced" as const,
    title: "Revenue Influenced",
    icon: DollarSign,
    color: "bg-emerald-100 text-emerald-600",
    format: (v: number) => formatCurrency(v),
    change: 12.5,
  },
  {
    key: "opportunitiesRecovered" as const,
    title: "Opportunities Recovered",
    icon: Target,
    color: "bg-blue-100 text-blue-600",
    format: (v: number) => v.toString(),
    change: 8.2,
  },
  {
    key: "bookingsCreated" as const,
    title: "Bookings Created",
    icon: Calendar,
    color: "bg-violet-100 text-violet-600",
    format: (v: number) => v.toString(),
    change: 15.3,
  },
  {
    key: "avgResponseTime" as const,
    title: "Avg Response Time",
    icon: Clock,
    color: "bg-amber-100 text-amber-600",
    format: (v: number) => `${v.toFixed(1)} min`,
    change: -18.4,
  },
  {
    key: "estimatesReopened" as const,
    title: "Estimates Reopened",
    icon: FileText,
    color: "bg-cyan-100 text-cyan-600",
    format: (v: number) => v.toString(),
    change: 5.7,
  },
  {
    key: "customersReactivated" as const,
    title: "Customers Reactivated",
    icon: UserCheck,
    color: "bg-rose-100 text-rose-600",
    format: (v: number) => v.toString(),
    change: 22.1,
  },
];

export default function DashboardPage() {
  const recentActivity = useMemo(
    () =>
      [...DEMO_ACTIVITY]
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 8),
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Recovered Revenue Overview" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {KPI_CARDS.map((kpi) => {
          const Icon = kpi.icon;
          const value = DEMO_DASHBOARD_KPIS[kpi.key];
          const isPositiveChange = kpi.change > 0;
          const isResponseTime = kpi.key === "avgResponseTime";
          const changeIsGood = isResponseTime ? !isPositiveChange : isPositiveChange;

          return (
            <Card key={kpi.key}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${kpi.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted-foreground truncate">
                      {kpi.title}
                    </p>
                    <p className="text-xl font-bold tracking-tight">
                      {kpi.format(value)}
                    </p>
                    <Badge
                      variant={changeIsGood ? "success" : "destructive"}
                      className="mt-0.5 text-[10px] px-1.5 py-0"
                    >
                      {isPositiveChange ? "+" : ""}
                      {kpi.change}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts + Sidebar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recovery Trend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Recovery Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={DEMO_RECOVERY_TREND}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v: string) => v.slice(5)}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="missedCall"
                      name="Missed Call"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="estimateRescue"
                      name="Estimate Rescue"
                      stackId="1"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="reactivation"
                      name="Reactivation"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Workflow Performance */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Workflow Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DEMO_WORKFLOW_PERFORMANCE}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="workflow" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="opportunities"
                      name="Opportunities"
                      fill="#94a3b8"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="recovered"
                      name="Recovered"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Activity, Alerts, Quick Actions */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => {
                  const Icon =
                    ACTIVITY_ICONS[activity.type] || Info;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 text-sm"
                    >
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-snug">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {DEMO_ALERTS.map((alert) => {
                  const Icon = ALERT_ICONS[alert.type] || Info;
                  return (
                    <div
                      key={alert.id}
                      className={`rounded-md border-l-4 bg-muted/50 p-3 ${ALERT_BORDER_COLORS[alert.type]}`}
                    >
                      <div className="flex items-start gap-2">
                        <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium leading-snug">
                            {alert.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {alert.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-auto flex-col gap-1 py-3">
                  <Phone className="h-4 w-4" />
                  <span className="text-xs">Log Missed Call</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-1 py-3">
                  <Search className="h-4 w-4" />
                  <span className="text-xs">Review Stale Estimates</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-1 py-3">
                  <Megaphone className="h-4 w-4" />
                  <span className="text-xs">Launch Campaign</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-1 py-3">
                  <Upload className="h-4 w-4" />
                  <span className="text-xs">Import Contacts</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
