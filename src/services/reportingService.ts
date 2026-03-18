import {
  demoReportSnapshots,
  demoOpportunities,
  demoBookings,
  demoCallEvents,
  demoEstimates,
} from "@/lib/demo-data";

export interface WorkflowReport {
  name: string;
  type: string;
  opportunities: number;
  recovered: number;
  conversionRate: number;
  pipelineValue: number;
  recoveredValue: number;
}

export interface ResponseTimeTrend {
  period: string;
  avgMinutes: number;
}

export interface RevenueBreakdown {
  directRecovered: number;
  influenced: number;
  pipeline: number;
}

export function getCurrentPeriodSnapshot() {
  return demoReportSnapshots[0];
}

export function getPreviousPeriodSnapshot() {
  return demoReportSnapshots[1];
}

export function getAllSnapshots() {
  return demoReportSnapshots;
}

export function getWorkflowReports(): WorkflowReport[] {
  const types = ["missed_call", "estimate_rescue", "reactivation"] as const;
  const labels: Record<string, string> = {
    missed_call: "Missed Call Recovery",
    estimate_rescue: "Estimate Rescue",
    reactivation: "Reactivation",
  };

  return types.map((type) => {
    const opps = demoOpportunities.filter((o) => o.type === type);
    const recovered = opps.filter((o) => ["booked", "won"].includes(o.status));
    const pipelineValue = opps.reduce((s, o) => s + o.estimatedValue, 0);
    const recoveredValue = opps
      .filter((o) => o.actualValue != null)
      .reduce((s, o) => s + (o.actualValue ?? 0), 0);

    return {
      name: labels[type],
      type,
      opportunities: opps.length,
      recovered: recovered.length,
      conversionRate: opps.length > 0 ? Math.round((recovered.length / opps.length) * 100) : 0,
      pipelineValue,
      recoveredValue,
    };
  });
}

export function getResponseTimeTrend(): ResponseTimeTrend[] {
  return demoReportSnapshots.map((snap, i) => ({
    period: i === 0 ? "Current (30d)" : i === 1 ? "Prior (30d)" : "2 Periods Ago",
    avgMinutes: snap.avgResponseMinutes,
  }));
}

export function getRevenueBreakdown(): RevenueBreakdown {
  const current = demoReportSnapshots[0];
  const pipeline = demoOpportunities
    .filter((o) => !["won", "lost", "closed"].includes(o.status))
    .reduce((s, o) => s + o.estimatedValue, 0);

  return {
    directRecovered: current.revenueRecovered,
    influenced: current.revenueInfluenced,
    pipeline,
  };
}

export function getCallFunnelStats() {
  const total = demoCallEvents.length;
  const missed = demoCallEvents.filter((c) => c.status === "missed" || c.status === "after_hours" || c.status === "abandoned").length;
  const responded = demoCallEvents.filter((c) => c.status === "responded").length;
  const booked = demoCallEvents.filter((c) => c.status === "booked").length;

  return { total, missed, responded, booked };
}

export function getEstimateFunnelStats() {
  const total = demoEstimates.length;
  const stale = demoEstimates.filter((e) => e.status === "stale").length;
  const followUp = demoEstimates.filter((e) => e.status === "follow_up").length;
  const booked = demoEstimates.filter((e) => e.status === "booked").length;
  const atRiskValue = demoEstimates
    .filter((e) => e.status === "stale" || e.status === "follow_up")
    .reduce((s, e) => s + e.amount, 0);

  return { total, stale, followUp, booked, atRiskValue };
}

export function getUpcomingBookings() {
  const now = new Date();
  return demoBookings
    .filter((b) => new Date(b.scheduledAt) > now && b.status === "scheduled")
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
}

export function getPeriodDelta(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}
