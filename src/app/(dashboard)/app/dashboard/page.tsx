import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivityList } from "@/components/dashboard/RecentActivityList";
import { RecoveryTrendChart } from "@/components/dashboard/RecoveryTrendChart";
import { WorkflowPerformanceChart } from "@/components/dashboard/WorkflowPerformanceChart";
import { PageHeading } from "@/components/shared/PageHeading";
import { getDashboardReport } from "@/services/reportingService";

export default function DashboardPage() {
  const report = getDashboardReport();
  return (
    <div className="space-y-6">
      <PageHeading eyebrow="Dashboard" title="Revenue recovery overview" description="Monitor recovered value, SLA health, and workflow performance across the business." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{report.dashboardKpis.map((metric) => <KpiCard key={metric.label} metric={metric} />)}</div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <RecoveryTrendChart points={report.recoveryTrend} />
        <AlertsPanel alerts={report.dashboardAlerts} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <WorkflowPerformanceChart workflows={report.workflowPerformance} />
        <RecentActivityList items={report.recentActivity} />
      </div>
      <QuickActions actions={[{ label: 'Review opportunities', href: '/app/opportunities' }, { label: 'Open estimates', href: '/app/estimates' }, { label: 'Launch campaign', href: '/app/campaigns' }]} />
    </div>
  );
}
