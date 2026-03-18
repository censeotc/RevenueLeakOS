import type { Metadata } from "next";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { RecentActivityList } from "@/components/dashboard/RecentActivityList";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { RecoveryTrendChart } from "@/components/dashboard/RecoveryTrendChart";
import { WorkflowPerformanceChart } from "@/components/dashboard/WorkflowPerformanceChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { dashboardKpis, recentActivity, alerts } from "@/data/dashboardData";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Revenue recovery overview for this month</p>
        </div>
        <QuickActions />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardKpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RecoveryTrendChart />
        <WorkflowPerformanceChart />
      </div>

      {/* Activity + Alerts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivityList items={recentActivity} />
        </div>
        <AlertsPanel alerts={alerts} />
      </div>
    </div>
  );
}
