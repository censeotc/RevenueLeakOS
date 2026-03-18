import type { DashboardData } from "@/types/revenue";

export const demoDashboardData: DashboardData = {
  kpis: {
    totalRecoverable: 84350,
    recovered: 31200,
    recoveryRate: 37,
    openOpportunities: 23,
    avgResponseTime: 4.2,
  },
  recoveryTrend: [
    { date: "2024-08", recovered: 4200, missed: 8100 },
    { date: "2024-09", recovered: 5800, missed: 7400 },
    { date: "2024-10", recovered: 3900, missed: 6200 },
    { date: "2024-11", recovered: 6100, missed: 5800 },
    { date: "2024-12", recovered: 7500, missed: 4900 },
    { date: "2025-01", recovered: 3700, missed: 3200 },
  ],
  workflowPerformance: [
    { workflow: "Estimate Follow-Up", sent: 120, converted: 34, revenue: 18200 },
    { workflow: "Missed Call Callback", sent: 85, converted: 52, revenue: 8400 },
    { workflow: "Reactivation", sent: 65, converted: 11, revenue: 4600 },
  ],
  recentActivity: [
    { id: "a1", type: "opportunity", description: "New opportunity: unsold estimate for Alice Chen ($4,200)", timestamp: "2025-01-12T15:30:00Z" },
    { id: "a2", type: "call", description: "Missed call from Bob Martinez", timestamp: "2025-01-12T14:30:00Z" },
    { id: "a3", type: "campaign", description: "Campaign 'Unsold Estimate Follow-Up' sent step 2 to 8 contacts", timestamp: "2025-01-12T09:00:00Z" },
    { id: "a4", type: "estimate", description: "Estimate EST-1002 approved by Dave Kim ($6,500)", timestamp: "2025-01-11T16:45:00Z" },
  ],
  alerts: [
    { id: "al1", severity: "critical", message: "3 estimates expiring in the next 48 hours", createdAt: "2025-01-12T08:00:00Z" },
    { id: "al2", severity: "warning", message: "Twilio balance below $10", createdAt: "2025-01-11T12:00:00Z" },
    { id: "al3", severity: "info", message: "Weekly report ready for review", createdAt: "2025-01-12T07:00:00Z" },
  ],
};
