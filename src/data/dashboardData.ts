import type { KpiData, ActivityItem, AlertItem } from "@/types/revenue";

export const dashboardKpis: KpiData[] = [
  {
    label: "Revenue Recovered",
    value: "$12,840",
    change: "+18%",
    changeDirection: "up",
    subtext: "vs last month",
  },
  {
    label: "Open Opportunities",
    value: "24",
    change: "+6",
    changeDirection: "up",
    subtext: "new this week",
  },
  {
    label: "Estimates Sent",
    value: "47",
    change: "38%",
    changeDirection: "up",
    subtext: "conv. rate",
  },
  {
    label: "Contacts Reactivated",
    value: "14",
    change: "+3",
    changeDirection: "up",
    subtext: "this month",
  },
];

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

export const recentActivity: ActivityItem[] = [
  {
    id: "a1", type: "won",
    description: "Opportunity won — AC replacement job booked",
    contactName: "Robert Davis",
    createdAt: hoursAgo(1),
  },
  {
    id: "a2", type: "missed_call",
    description: "Missed call — SMS follow-up sent automatically",
    contactName: "Jennifer Martinez",
    createdAt: hoursAgo(4),
  },
  {
    id: "a3", type: "estimate_sent",
    description: "Estimate follow-up #2 delivered",
    contactName: "William Brown",
    createdAt: hoursAgo(6),
  },
  {
    id: "a4", type: "follow_up",
    description: "Reactivation SMS sent",
    contactName: "Amanda Wilson",
    createdAt: hoursAgo(12),
  },
  {
    id: "a5", type: "won",
    description: "Estimate accepted — mini-split installation",
    contactName: "Christopher Taylor",
    createdAt: daysAgo(1),
  },
  {
    id: "a6", type: "estimate_sent",
    description: "Estimate #E-1047 viewed",
    contactName: "Daniel Thomas",
    createdAt: daysAgo(1),
  },
  {
    id: "a7", type: "reactivation",
    description: "Win-back campaign enrolled — 89 contacts",
    createdAt: daysAgo(2),
  },
  {
    id: "a8", type: "missed_call",
    description: "Missed call — text-back sent within 60s",
    contactName: "Jessica Anderson",
    createdAt: daysAgo(2),
  },
];

export const alerts: AlertItem[] = [
  {
    id: "al1",
    title: "8 estimates pending for 5+ days",
    description: "Consider sending a second follow-up.",
    severity: "warning",
  },
  {
    id: "al2",
    title: "ServiceTitan sync completed",
    description: "47 new contacts imported.",
    severity: "success",
  },
  {
    id: "al3",
    title: "12-month reactivation campaign active",
    description: "124 contacts enrolled.",
    severity: "info",
  },
];

export const recoveryTrendData = [
  { date: "Nov 20", recovered: 320 },
  { date: "Nov 22", recovered: 580 },
  { date: "Nov 24", recovered: 420 },
  { date: "Nov 26", recovered: 740 },
  { date: "Nov 28", recovered: 890 },
  { date: "Nov 30", recovered: 1200 },
  { date: "Dec 2", recovered: 950 },
  { date: "Dec 4", recovered: 1350 },
  { date: "Dec 6", recovered: 1100 },
  { date: "Dec 8", recovered: 1600 },
  { date: "Dec 10", recovered: 1400 },
  { date: "Dec 12", recovered: 1840 },
  { date: "Dec 14", recovered: 2100 },
  { date: "Dec 16", recovered: 1950 },
  { date: "Dec 18", recovered: 2400 },
];

export const workflowPerformanceData = [
  { workflow: "Missed Call", sent: 48, converted: 12 },
  { workflow: "Est. Follow-up", sent: 62, converted: 17 },
  { workflow: "Reactivation", sent: 124, converted: 26 },
  { workflow: "Win-Back", sent: 89, converted: 13 },
];
