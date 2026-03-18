import type { ActivityItem, AlertItem, ConversionSummary, KpiMetric, RevenueSummary, TrendPoint, WorkflowPerformance } from "@/types/revenue";

export const dashboardKpis: KpiMetric[] = [
  { label: "Recovered revenue", value: "$182k", change: "+18% vs last month", tone: "positive" },
  { label: "Booked opportunities", value: "47", change: "11 awaiting follow-up", tone: "neutral" },
  { label: "Avg. first response", value: "22 min", change: "-8 min faster", tone: "positive" },
  { label: "Leakage risk", value: "14%", change: "3 campaigns need tuning", tone: "warning" }
];
export const dashboardAlerts: AlertItem[] = [
  { id: "alert-1", title: "After-hours missed calls spiking", detail: "Missed call volume is up 21% after 6pm across the plumbing line.", severity: "critical" },
  { id: "alert-2", title: "Estimate follow-up lagging", detail: "Nine quotes have aged past the 5-day SLA without enrollment.", severity: "warning" },
  { id: "alert-3", title: "Twilio delivery healthy", detail: "SMS success rate remains above 98% over the past 24 hours.", severity: "info" }
];
export const recentActivity: ActivityItem[] = [
  { id: "act-1", title: "Opportunity recovered", detail: "CSR booked a same-day water heater estimate from a missed call follow-up.", timestamp: "8 minutes ago" },
  { id: "act-2", title: "Campaign launched", detail: "Dormant maintenance member reactivation sequence started for 184 contacts.", timestamp: "42 minutes ago" },
  { id: "act-3", title: "New import processed", detail: "57 stale estimates synced from the estimator export.", timestamp: "2 hours ago" }
];
export const recoveryTrend: TrendPoint[] = [
  { label: "Mon", recoveredRevenueCents: 1200000 },
  { label: "Tue", recoveredRevenueCents: 1900000 },
  { label: "Wed", recoveredRevenueCents: 1550000 },
  { label: "Thu", recoveredRevenueCents: 2100000 },
  { label: "Fri", recoveredRevenueCents: 2450000 }
];
export const workflowPerformance: WorkflowPerformance[] = [
  { workflow: "Missed call recovery", winRate: 54, recoveredRevenueCents: 7400000, averageResponseHours: 0.4 },
  { workflow: "Estimate rescue", winRate: 37, recoveredRevenueCents: 5200000, averageResponseHours: 3.1 },
  { workflow: "Reactivation", winRate: 18, recoveredRevenueCents: 3300000, averageResponseHours: 11.6 }
];
export const revenueSummary: RevenueSummary[] = [
  { label: "Direct revenue", amountCents: 11800000, delta: "+12%" },
  { label: "Influenced revenue", amountCents: 6400000, delta: "+24%" },
  { label: "Bookings created", amountCents: 4700000, delta: "+9%" }
];
export const conversionSummary: ConversionSummary[] = [
  { workflow: "Missed call", leads: 91, responses: 62, bookings: 39, winRate: 43 },
  { workflow: "Estimate rescue", leads: 76, responses: 40, bookings: 28, winRate: 37 },
  { workflow: "Reactivation", leads: 184, responses: 51, bookings: 18, winRate: 10 }
];
