import { auth } from "@/lib/auth";
import { DashboardClient } from "./DashboardClient";
import { DEMO_KPIS, DEMO_WORKFLOW_PERFORMANCE, DEMO_RECENT_ACTIVITY, DEMO_ALERTS, generateRecoveryTrend } from "@/lib/demo/demoData";

export default async function DashboardPage() {
  const session = await auth();
  const businessId = (session?.user as any)?.businessId;

  // Use demo data (works without DB connection too)
  const kpis = DEMO_KPIS;
  const workflowPerformance = DEMO_WORKFLOW_PERFORMANCE;
  const recoveryTrend = generateRecoveryTrend(30);
  const recentActivity = DEMO_RECENT_ACTIVITY;
  const alerts = DEMO_ALERTS;

  return (
    <DashboardClient
      kpis={kpis}
      workflowPerformance={workflowPerformance}
      recoveryTrend={recoveryTrend}
      recentActivity={recentActivity}
      alerts={alerts}
      businessId={businessId}
    />
  );
}
