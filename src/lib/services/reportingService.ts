import type { RecoveryTrendData, WorkflowPerformanceData } from "@/types";
import {
  DEMO_DASHBOARD_KPIS,
  DEMO_WORKFLOW_PERFORMANCE,
  DEMO_RECOVERY_TREND,
} from "@/lib/demo-data";

export interface DashboardKPIs {
  revenueInfluenced: number;
  opportunitiesRecovered: number;
  bookingsCreated: number;
  avgResponseTime: number;
  estimatesReopened: number;
  customersReactivated: number;
}

export interface RevenueBreakdown {
  direct: number;
  influenced: number;
  total: number;
  directPercentage: number;
  influencedPercentage: number;
  byWorkflow: {
    workflow: string;
    direct: number;
    influenced: number;
  }[];
}

export interface ResponseTimeStats {
  avgMinutes: number;
  medianMinutes: number;
  p95Minutes: number;
  byHour: { hour: number; avgMinutes: number; count: number }[];
  byDay: { day: string; avgMinutes: number; count: number }[];
  trend: "improving" | "stable" | "declining";
}

export async function getDashboardKPIs(
  businessId: string
): Promise<DashboardKPIs> {
  void businessId;
  return { ...DEMO_DASHBOARD_KPIS };
}

export async function getRecoveryTrend(
  businessId: string,
  days: number = 14
): Promise<RecoveryTrendData[]> {
  void businessId;
  return DEMO_RECOVERY_TREND.slice(-days);
}

export async function getWorkflowPerformance(
  businessId: string
): Promise<WorkflowPerformanceData[]> {
  void businessId;
  return [...DEMO_WORKFLOW_PERFORMANCE];
}

export async function getRevenueBreakdown(
  businessId: string
): Promise<RevenueBreakdown> {
  void businessId;

  const direct = 84750;
  const influenced = 43100;
  const total = direct + influenced;

  return {
    direct,
    influenced,
    total,
    directPercentage: Math.round((direct / total) * 100),
    influencedPercentage: Math.round((influenced / total) * 100),
    byWorkflow: [
      {
        workflow: "Missed Call Recovery",
        direct: 38200,
        influenced: 4100,
      },
      {
        workflow: "Estimate Rescue",
        direct: 42300,
        influenced: 11900,
      },
      {
        workflow: "Customer Reactivation",
        direct: 4250,
        influenced: 27100,
      },
    ],
  };
}

export async function getResponseTimeStats(
  businessId: string
): Promise<ResponseTimeStats> {
  void businessId;

  return {
    avgMinutes: 4.2,
    medianMinutes: 3.1,
    p95Minutes: 12.8,
    byHour: [
      { hour: 8, avgMinutes: 2.1, count: 12 },
      { hour: 9, avgMinutes: 1.8, count: 18 },
      { hour: 10, avgMinutes: 2.5, count: 22 },
      { hour: 11, avgMinutes: 3.2, count: 15 },
      { hour: 12, avgMinutes: 6.8, count: 8 },
      { hour: 13, avgMinutes: 5.1, count: 10 },
      { hour: 14, avgMinutes: 3.4, count: 19 },
      { hour: 15, avgMinutes: 2.9, count: 16 },
      { hour: 16, avgMinutes: 4.7, count: 14 },
      { hour: 17, avgMinutes: 8.2, count: 7 },
    ],
    byDay: [
      { day: "Monday", avgMinutes: 3.8, count: 24 },
      { day: "Tuesday", avgMinutes: 3.5, count: 28 },
      { day: "Wednesday", avgMinutes: 4.1, count: 22 },
      { day: "Thursday", avgMinutes: 4.6, count: 26 },
      { day: "Friday", avgMinutes: 5.2, count: 20 },
      { day: "Saturday", avgMinutes: 7.1, count: 8 },
      { day: "Sunday", avgMinutes: 9.4, count: 3 },
    ],
    trend: "improving",
  };
}
