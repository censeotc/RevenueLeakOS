export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Revenue recovery overview for your business</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* KpiCard components */}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* RecoveryTrendChart and WorkflowPerformanceChart */}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* RecentActivityList and AlertsPanel */}
      </div>

      {/* QuickActions */}
    </div>
  );
}
