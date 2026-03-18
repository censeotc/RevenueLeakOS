"use client";

import { DollarSign, Target, Calendar, Clock, FileText, RefreshCw, TrendingUp, TrendingDown, ArrowRight, AlertTriangle, Info, CheckCircle, Phone, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatTimeAgo, cn } from "@/lib/utils";
import Link from "next/link";
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

interface KPIs {
  revenueInfluenced: number;
  opportunitiesRecovered: number;
  bookingsCreated: number;
  avgResponseTimeMin: number;
  estimatesReopened: number;
  customersReactivated: number;
  revenueInfluencedDelta: number;
  opportunitiesDelta: number;
  bookingsDelta: number;
}

interface DashboardClientProps {
  kpis: KPIs;
  workflowPerformance: { name: string; sent: number; replied: number; booked: number; revenue: number }[];
  recoveryTrend: { date: string; missedCall: number; estimateRescue: number; reactivation: number }[];
  recentActivity: { id: string; action: string; description: string; createdAt: Date; contactName?: string; opportunityTitle?: string }[];
  alerts: { id: string; type: "warning" | "info" | "success" | "error"; title: string; description: string; actionLabel?: string; actionHref?: string }[];
  businessId: string;
}

function KPICard({
  label,
  value,
  delta,
  icon: Icon,
  iconColor,
  format: fmt = "number",
}: {
  label: string;
  value: number;
  delta?: number;
  icon: React.ElementType;
  iconColor: string;
  format?: "currency" | "number" | "time";
}) {
  const formatted =
    fmt === "currency"
      ? formatCurrency(value)
      : fmt === "time"
      ? `${value} min`
      : value.toLocaleString();

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", iconColor)}>
            <Icon className="h-5 w-5" />
          </div>
          {delta !== undefined && (
            <div className={cn("flex items-center gap-1 text-xs font-medium", delta >= 0 ? "text-green-600" : "text-red-600")}>
              {delta >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {Math.abs(delta).toFixed(1)}%
            </div>
          )}
        </div>
        <div className="space-y-0.5">
          <p className="text-2xl font-bold text-slate-900">{formatted}</p>
          <p className="text-sm text-slate-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

const ALERT_STYLES = {
  warning: { bg: "bg-amber-50", border: "border-amber-200", icon: AlertTriangle, iconColor: "text-amber-500" },
  info: { bg: "bg-blue-50", border: "border-blue-200", icon: Info, iconColor: "text-blue-500" },
  success: { bg: "bg-green-50", border: "border-green-200", icon: CheckCircle, iconColor: "text-green-500" },
  error: { bg: "bg-red-50", border: "border-red-200", icon: AlertTriangle, iconColor: "text-red-500" },
};

const ACTION_COLORS: Record<string, string> = {
  opportunity_booked: "bg-green-500",
  estimate_rescue_booked: "bg-blue-500",
  reactivation_booked: "bg-purple-500",
  sms_reply: "bg-indigo-500",
  opportunity_created: "bg-orange-500",
  sms_sent: "bg-slate-400",
  estimate_marked_stale: "bg-yellow-500",
};

export function DashboardClient({
  kpis,
  workflowPerformance,
  recoveryTrend,
  recentActivity,
  alerts,
}: DashboardClientProps) {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Recovered Revenue Overview</h1>
          <p className="text-slate-500 text-sm mt-1">North Shore Heating & Plumbing — Last 30 days</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/app/opportunities"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Target className="h-4 w-4" />
            View Opportunities
          </Link>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => {
            const style = ALERT_STYLES[alert.type];
            const AlertIcon = style.icon;
            return (
              <div key={alert.id} className={cn("flex items-start gap-3 p-3 rounded-xl border", style.bg, style.border)}>
                <AlertIcon className={cn("h-4 w-4 mt-0.5 shrink-0", style.iconColor)} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{alert.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{alert.description}</p>
                </div>
                {alert.actionHref && (
                  <Link
                    href={alert.actionHref}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 shrink-0 flex items-center gap-1"
                  >
                    {alert.actionLabel}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard label="Revenue Influenced" value={kpis.revenueInfluenced} delta={kpis.revenueInfluencedDelta} icon={DollarSign} iconColor="bg-green-100 text-green-600" format="currency" />
        <KPICard label="Opportunities Recovered" value={kpis.opportunitiesRecovered} delta={kpis.opportunitiesDelta} icon={Target} iconColor="bg-blue-100 text-blue-600" />
        <KPICard label="Bookings Created" value={kpis.bookingsCreated} delta={kpis.bookingsDelta} icon={Calendar} iconColor="bg-purple-100 text-purple-600" />
        <KPICard label="Avg Response Time" value={kpis.avgResponseTimeMin} icon={Clock} iconColor="bg-orange-100 text-orange-600" format="time" />
        <KPICard label="Estimates Reopened" value={kpis.estimatesReopened} icon={FileText} iconColor="bg-indigo-100 text-indigo-600" />
        <KPICard label="Customers Reactivated" value={kpis.customersReactivated} icon={RefreshCw} iconColor="bg-pink-100 text-pink-600" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Recovery Trend */}
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Recovery Trend — Last 30 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={recoveryTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Area type="monotone" dataKey="missedCall" stackId="1" stroke="#3b82f6" fill="#bfdbfe" name="Missed Call" />
                <Area type="monotone" dataKey="estimateRescue" stackId="1" stroke="#8b5cf6" fill="#ddd6fe" name="Estimate Rescue" />
                <Area type="monotone" dataKey="reactivation" stackId="1" stroke="#10b981" fill="#a7f3d0" name="Reactivation" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Workflow Performance */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Workflow Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={workflowPerformance} layout="vertical" margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={90} />
                <Tooltip
                  contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }}
                />
                <Bar dataKey="sent" fill="#dbeafe" name="Sent" radius={[0, 3, 3, 0]} />
                <Bar dataKey="replied" fill="#93c5fd" name="Replied" radius={[0, 3, 3, 0]} />
                <Bar dataKey="booked" fill="#3b82f6" name="Booked" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Link href="/app/opportunities" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="px-0 py-0">
            <ul className="divide-y divide-slate-100">
              {recentActivity.map((item) => (
                <li key={item.id} className="flex items-start gap-3 px-6 py-3">
                  <div className={cn("h-2 w-2 rounded-full mt-2 shrink-0", ACTION_COLORS[item.action] ?? "bg-slate-400")} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800 leading-snug">{item.description}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatTimeAgo(item.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "Simulate Missed Call", href: "/app/calls", icon: Phone, color: "text-blue-600 bg-blue-50" },
              { label: "View Stale Estimates", href: "/app/estimates", icon: FileText, color: "text-purple-600 bg-purple-50" },
              { label: "Launch Reactivation", href: "/app/reactivation", icon: RefreshCw, color: "text-green-600 bg-green-50" },
              { label: "New Campaign", href: "/app/campaigns", icon: Zap, color: "text-orange-600 bg-orange-50" },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition group"
                >
                  <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", action.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                    {action.label}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 ml-auto" />
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
