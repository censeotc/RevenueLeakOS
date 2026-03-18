import type { ReportSnapshot } from "@/types";
import {
  demoReportSnapshots,
  demoOpportunities,
  demoCallEvents,
  demoEstimates,
  demoBookings,
  demoCampaigns,
} from "@/data/seed";

export const reportingService = {
  getSnapshots(): ReportSnapshot[] {
    return [...demoReportSnapshots];
  },

  getCurrentPeriod(): ReportSnapshot {
    return demoReportSnapshots[0];
  },

  getPreviousPeriod(): ReportSnapshot | undefined {
    return demoReportSnapshots[1];
  },

  getPercentChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  },

  getTrends() {
    const current = demoReportSnapshots[0];
    const previous = demoReportSnapshots[1];
    return {
      revenueInfluenced: this.getPercentChange(current.revenueInfluenced, previous.revenueInfluenced),
      revenueRecovered: this.getPercentChange(current.revenueRecovered, previous.revenueRecovered),
      opportunitiesCreated: this.getPercentChange(current.opportunitiesCreated, previous.opportunitiesCreated),
      bookingsCreated: this.getPercentChange(current.bookingsCreated, previous.bookingsCreated),
      avgResponseMinutes: this.getPercentChange(current.avgResponseMinutes, previous.avgResponseMinutes),
      conversionRate: this.getPercentChange(current.conversionRate, previous.conversionRate),
    };
  },

  getOpportunityBreakdown() {
    const byType = {
      missed_call: demoOpportunities.filter((o) => o.type === "missed_call"),
      estimate_rescue: demoOpportunities.filter((o) => o.type === "estimate_rescue"),
      reactivation: demoOpportunities.filter((o) => o.type === "reactivation"),
    };

    return Object.entries(byType).map(([type, opps]) => ({
      type,
      total: opps.length,
      won: opps.filter((o) => o.status === "won" || o.status === "booked").length,
      lost: opps.filter((o) => o.status === "lost").length,
      open: opps.filter((o) => !["won", "booked", "lost"].includes(o.status)).length,
      pipelineValue: opps.reduce((s, o) => s + o.estimatedValue, 0),
      recoveredValue: opps
        .filter((o) => o.status === "won" || o.status === "booked")
        .reduce((s, o) => s + (o.actualValue ?? o.estimatedValue), 0),
    }));
  },

  getCallMetrics() {
    const calls = demoCallEvents;
    const total = calls.length;
    const missed = calls.filter((c) => c.status === "missed" || c.status === "after_hours").length;
    const inbound = calls.filter((c) => c.direction === "inbound").length;
    const outbound = calls.filter((c) => c.direction === "outbound").length;
    const avgDuration = calls.filter((c) => c.duration > 0).reduce((s, c) => s + c.duration, 0) / (calls.filter((c) => c.duration > 0).length || 1);

    return { total, missed, inbound, outbound, avgDuration: Math.round(avgDuration), missedRate: total > 0 ? Math.round((missed / total) * 100) : 0 };
  },

  getEstimateMetrics() {
    const estimates = demoEstimates;
    const total = estimates.length;
    const stale = estimates.filter((e) => e.status === "stale").length;
    const booked = estimates.filter((e) => e.status === "booked").length;
    const totalValue = estimates.reduce((s, e) => s + e.amount, 0);
    const staleValue = estimates.filter((e) => e.status === "stale").reduce((s, e) => s + e.amount, 0);

    return { total, stale, booked, expired: estimates.filter((e) => e.status === "expired").length, totalValue, staleValue, conversionRate: total > 0 ? Math.round((booked / total) * 100) : 0 };
  },

  getCampaignMetrics() {
    const active = demoCampaigns.filter((c) => c.status === "active");
    const totalSent = active.reduce((s, c) => s + c.sentCount, 0);
    const totalResponses = active.reduce((s, c) => s + c.responseCount, 0);
    const totalBooked = active.reduce((s, c) => s + c.bookedCount, 0);

    return {
      activeCampaigns: active.length,
      totalSent,
      totalResponses,
      totalBooked,
      responseRate: totalSent > 0 ? Math.round((totalResponses / totalSent) * 100) : 0,
      bookingRate: totalResponses > 0 ? Math.round((totalBooked / totalResponses) * 100) : 0,
    };
  },

  getBookingMetrics() {
    const scheduled = demoBookings.filter((b) => b.status === "scheduled");
    const completed = demoBookings.filter((b) => b.status === "completed");
    const totalScheduledValue = scheduled.reduce((s, b) => s + b.estimatedValue, 0);
    const totalCompletedValue = completed.reduce((s, b) => s + b.estimatedValue, 0);

    return { scheduled: scheduled.length, completed: completed.length, totalScheduledValue, totalCompletedValue };
  },
};
