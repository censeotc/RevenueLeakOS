import { conversionSummary, dashboardAlerts, dashboardKpis, recentActivity, recoveryTrend, revenueSummary, workflowPerformance } from "@/data/dashboardData";

export function getDashboardReport() {
  return { dashboardKpis, dashboardAlerts, recentActivity, recoveryTrend, workflowPerformance };
}
export function getRevenueReport() {
  return { revenueSummary, conversionSummary, workflowPerformance };
}
