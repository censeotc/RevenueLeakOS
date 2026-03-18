/**
 * Reporting Service
 *
 * Aggregates data across all entities to produce the KPI and trend metrics
 * shown on the dashboard and reports pages.
 *
 * In demo mode all values come from the static demo dataset.
 */

import {
  demoOpportunities,
  demoBookings,
  demoCallEvents,
  demoEstimates,
  demoReportSnapshots,
  demoMessages,
} from "@/lib/demo-data";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PeriodRange {
  start: Date;
  end: Date;
  label: string;
}

export interface RevenueMetrics {
  revenueInfluenced: number;
  revenueRecovered: number;
  avgDealSize: number;
  recoveryRate: number; // percentage
}

export interface WorkflowMetrics {
  missedCallsHandled: number;
  estimatesReopened: number;
  customersReactivated: number;
  avgResponseMinutes: number;
  totalOpportunitiesCreated: number;
  totalOpportunitiesWon: number;
  conversionRate: number; // percentage
}

export interface BookingMetrics {
  totalBookings: number;
  scheduledBookings: number;
  completedBookings: number;
  totalBookingValue: number;
}

export interface TrendPoint {
  label: string;
  value: number;
}

export interface ReportSummary {
  period: PeriodRange;
  revenue: RevenueMetrics;
  workflow: WorkflowMetrics;
  bookings: BookingMetrics;
  revenueByType: Array<{ type: string; value: number; count: number }>;
  conversionTrend: TrendPoint[];
  responseTrend: TrendPoint[];
}

// ── Period helpers ────────────────────────────────────────────────────────────

export function getPeriodRanges(): PeriodRange[] {
  const now = new Date();
  const d = (days: number) =>
    new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return [
    { start: d(30), end: now, label: "Last 30 days" },
    { start: d(60), end: d(30), label: "Previous 30 days" },
    { start: d(90), end: d(60), label: "30–90 days ago" },
  ];
}

// ── Core aggregation ──────────────────────────────────────────────────────────

export function computeReportSummary(
  businessId: string,
  periodDays: 30 | 60 | 90 = 30
): ReportSummary {
  const now = new Date();
  const periodStart = new Date(
    now.getTime() - periodDays * 24 * 60 * 60 * 1000
  );

  const snapshot = demoReportSnapshots[0];

  const won = demoOpportunities.filter(
    (o) => o.status === "won" && o.resolvedAt && o.resolvedAt >= periodStart
  );
  const allOpps = demoOpportunities.filter(
    (o) => o.createdAt >= periodStart
  );

  const missedCalls = demoCallEvents.filter(
    (c) =>
      (c.status === "missed" || c.status === "after_hours") &&
      c.callTime >= periodStart
  );

  const staleEstimates = demoEstimates.filter(
    (e) =>
      (e.status === "stale" || e.status === "booked") &&
      e.sentAt >= periodStart
  );

  const reactivated = demoOpportunities.filter(
    (o) =>
      o.type === "reactivation" &&
      o.status === "won" &&
      o.resolvedAt &&
      o.resolvedAt >= periodStart
  );

  const outboundMessages = demoMessages.filter(
    (m) => m.direction === "outbound" && m.sentAt >= periodStart
  );

  const bookingsInPeriod = demoBookings.filter(
    (b) => b.scheduledAt >= periodStart
  );

  const revenue: RevenueMetrics = {
    revenueInfluenced: snapshot.revenueInfluenced,
    revenueRecovered: snapshot.revenueRecovered,
    avgDealSize:
      won.length > 0
        ? won.reduce((s, o) => s + (o.actualValue ?? 0), 0) / won.length
        : 0,
    recoveryRate: snapshot.revenueInfluenced > 0
      ? (snapshot.revenueRecovered / snapshot.revenueInfluenced) * 100
      : 0,
  };

  const workflow: WorkflowMetrics = {
    missedCallsHandled: missedCalls.length,
    estimatesReopened: staleEstimates.filter((e) => e.status === "booked")
      .length,
    customersReactivated: reactivated.length,
    avgResponseMinutes: snapshot.avgResponseMinutes,
    totalOpportunitiesCreated: allOpps.length,
    totalOpportunitiesWon: won.length,
    conversionRate:
      allOpps.length > 0
        ? Math.round((won.length / allOpps.length) * 1000) / 10
        : 0,
  };

  const bookings: BookingMetrics = {
    totalBookings: bookingsInPeriod.length,
    scheduledBookings: bookingsInPeriod.filter((b) => b.status === "scheduled")
      .length,
    completedBookings: bookingsInPeriod.filter(
      (b) => b.status === "completed"
    ).length,
    totalBookingValue: bookingsInPeriod.reduce(
      (s, b) => s + (b.estimatedValue ?? 0),
      0
    ),
  };

  const revenueByType = [
    {
      type: "Missed Call",
      value: won
        .filter((o) => o.type === "missed_call")
        .reduce((s, o) => s + (o.actualValue ?? 0), 0),
      count: won.filter((o) => o.type === "missed_call").length,
    },
    {
      type: "Estimate Rescue",
      value: won
        .filter((o) => o.type === "estimate_rescue")
        .reduce((s, o) => s + (o.actualValue ?? 0), 0),
      count: won.filter((o) => o.type === "estimate_rescue").length,
    },
    {
      type: "Reactivation",
      value: won
        .filter((o) => o.type === "reactivation")
        .reduce((s, o) => s + (o.actualValue ?? 0), 0),
      count: won.filter((o) => o.type === "reactivation").length,
    },
  ];

  // Use stored snapshots for trend lines
  const conversionTrend: TrendPoint[] = demoReportSnapshots.map((s, i) => ({
    label: i === 0 ? "Last 30d" : i === 1 ? "31–60d" : "61–90d",
    value: s.conversionRate,
  }));

  const responseTrend: TrendPoint[] = demoReportSnapshots.map((s, i) => ({
    label: i === 0 ? "Last 30d" : i === 1 ? "31–60d" : "61–90d",
    value: s.avgResponseMinutes,
  }));

  return {
    period: {
      start: periodStart,
      end: now,
      label: `Last ${periodDays} days`,
    },
    revenue,
    workflow,
    bookings,
    revenueByType,
    conversionTrend,
    responseTrend,
  };
}

// ── Segment analysis ──────────────────────────────────────────────────────────

export interface ReactivationSegment {
  id: string;
  name: string;
  description: string;
  count: number;
  estimatedValue: number;
  criteria: string;
}

export function computeReactivationSegments(
  businessId: string
): ReactivationSegment[] {
  return [
    {
      id: "seg_12mo",
      name: "12+ Month Dormant",
      description: "Customers with no service in over a year",
      count: 8,
      estimatedValue: 18400,
      criteria: "lastServiceDate < 12 months ago",
    },
    {
      id: "seg_high_value",
      name: "High-Value Lapsed",
      description: "Lifetime value > $5,000, no recent service",
      count: 5,
      estimatedValue: 42500,
      criteria: "lifetimeValue > 5000 AND lastServiceDate < 6 months ago",
    },
    {
      id: "seg_estimate_ghost",
      name: "Estimate Ghosts",
      description: "Received estimate 7+ days ago, no response",
      count: 4,
      estimatedValue: 28200,
      criteria: "estimate.status in (stale, follow_up)",
    },
    {
      id: "seg_commercial",
      name: "Commercial Accounts",
      description: "Commercial customers overdue for service",
      count: 3,
      estimatedValue: 55000,
      criteria: "tags contains commercial AND lastServiceDate < 90 days ago",
    },
  ];
}

// ── Comparison metrics ────────────────────────────────────────────────────────

export function computePeriodComparison(businessId: string) {
  const current = demoReportSnapshots[0];
  const previous = demoReportSnapshots[1];

  const pct = (a: number, b: number) => {
    if (b === 0) return a > 0 ? 100 : 0;
    return Math.round(((a - b) / b) * 1000) / 10;
  };

  return {
    revenueInfluenced: {
      current: current.revenueInfluenced,
      previous: previous.revenueInfluenced,
      change: pct(current.revenueInfluenced, previous.revenueInfluenced),
    },
    conversionRate: {
      current: current.conversionRate,
      previous: previous.conversionRate,
      change: pct(current.conversionRate, previous.conversionRate),
    },
    avgResponseMinutes: {
      current: current.avgResponseMinutes,
      previous: previous.avgResponseMinutes,
      change: pct(current.avgResponseMinutes, previous.avgResponseMinutes),
    },
    bookingsCreated: {
      current: current.bookingsCreated,
      previous: previous.bookingsCreated,
      change: pct(current.bookingsCreated, previous.bookingsCreated),
    },
  };
}
