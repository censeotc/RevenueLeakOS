import type { DashboardData } from "@/types/revenue";
import { demoDashboardData } from "@/data/dashboardData";

export async function getDashboardData(
  _businessId: string
): Promise<DashboardData> {
  return demoDashboardData;
}

export async function getRevenueSummary(_businessId: string) {
  return {
    directRevenue: 18200,
    influencedRevenue: 13000,
    totalRecovered: 31200,
    period: "Last 6 months",
  };
}

export async function getConversionSummary(_businessId: string) {
  return [
    { workflow: "Estimate Follow-Up", sent: 120, converted: 34, rate: 28.3 },
    { workflow: "Missed Call Callback", sent: 85, converted: 52, rate: 61.2 },
    { workflow: "Reactivation", sent: 65, converted: 11, rate: 16.9 },
  ];
}
