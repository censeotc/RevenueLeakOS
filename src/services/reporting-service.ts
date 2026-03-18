import type { OpportunityType } from "@/types/domain";
import { determineSegment, getStore } from "@/lib/demo-data";

const newest = <T extends { createdAt?: string; startedAt?: string; snapshotDate?: string }>(rows: T[]) =>
  [...rows].sort((a, b) =>
    (b.createdAt ?? b.startedAt ?? b.snapshotDate ?? "").localeCompare(a.createdAt ?? a.startedAt ?? a.snapshotDate ?? ""),
  );

function summarizeWorkflow(type: OpportunityType) {
  const store = getStore();
  const rows = store.opportunities.filter((row) => row.type === type);
  const converted = rows.filter((row) => ["booked", "won"].includes(row.status)).length;

  return {
    type,
    recovered: rows.filter((row) => ["booked", "won", "responded"].includes(row.status)).length,
    directRevenue: rows.reduce((sum, row) => sum + row.directRevenueCents, 0),
    influencedRevenue: rows.reduce((sum, row) => sum + row.influencedRevenueCents, 0),
    converted,
    total: rows.length,
    rate: rows.length ? Math.round((converted / rows.length) * 100) : 0,
  };
}

function buildLiveSummary() {
  const store = getStore();
  const workflowSummaries = (["missed_call", "estimate_rescue", "reactivation"] as OpportunityType[]).map(summarizeWorkflow);

  const influencedRevenue = workflowSummaries.reduce((sum, row) => sum + row.influencedRevenue, 0);
  const directRevenue = workflowSummaries.reduce((sum, row) => sum + row.directRevenue, 0);
  const recoveredOpportunities = workflowSummaries.reduce((sum, row) => sum + row.recovered, 0);
  const bookingsCreated = store.bookings.length;
  const estimatesReopened = store.estimates.filter((estimate) => ["enrolled", "responded", "booked"].includes(estimate.status)).length;
  const customersReactivated = store.opportunities.filter((opportunity) => opportunity.type === "reactivation" && ["responded", "booked", "won"].includes(opportunity.status)).length;
  const respondedCalls = store.callEvents.filter((call) => call.respondedAt && call.startedAt);
  const avgResponseTimeMinutes = respondedCalls.length
    ? Math.round(
        respondedCalls.reduce((sum, call) => sum + (new Date(call.respondedAt as string).getTime() - new Date(call.startedAt).getTime()) / 60_000, 0) /
          respondedCalls.length,
      )
    : 0;

  return {
    directRevenueCents: directRevenue,
    influencedRevenueCents: influencedRevenue,
    recoveredOpportunities,
    bookingsCreated,
    avgResponseTimeMinutes,
    estimatesReopened,
    customersReactivated,
  };
}

export const reportingService = {
  getDashboardData() {
    const store = getStore();
    const summary = buildLiveSummary();

    return {
      business: store.business,
      summary: {
        revenueInfluenced: summary.influencedRevenueCents,
        opportunitiesRecovered: summary.recoveredOpportunities,
        bookingsCreated: summary.bookingsCreated,
        avgResponseTimeMinutes: summary.avgResponseTimeMinutes,
        estimatesReopened: summary.estimatesReopened,
        customersReactivated: summary.customersReactivated,
      },
      recentActivity: newest(store.activityLogs).slice(0, 8),
      alerts: newest(store.activityLogs.filter((row) => row.type === "alert")).slice(0, 4),
      quickActionCounts: {
        missedCallsOpen: store.opportunities.filter((row) => row.type === "missed_call" && ["open", "attempted", "responded"].includes(row.status)).length,
        staleEstimates: store.estimates.filter((row) => ["stale", "open"].includes(row.status) && row.staleSince).length,
        dormantContacts: store.contacts.filter((row) => determineSegment(row) !== null).length,
      },
    };
  },

  getReportsView() {
    const store = getStore();
    const summary = buildLiveSummary();
    const workflowComparison = (["missed_call", "estimate_rescue", "reactivation"] as OpportunityType[]).map(summarizeWorkflow);
    const conversionSummary = workflowComparison.map((row) => ({
      type: row.type,
      converted: row.converted,
      total: row.total,
      rate: row.rate,
    }));

    return {
      summary,
      workflowComparison,
      conversionSummary,
      reportSnapshots: newest(store.reportSnapshots),
    };
  },

  getWalkthroughData() {
    const store = getStore();
    const summary = buildLiveSummary();
    const missedCalls = store.callEvents.filter((call) => ["missed", "after_hours", "responded", "booked"].includes(call.disposition));
    const staleEstimates = store.estimates.filter((estimate) => ["stale", "enrolled", "responded", "booked"].includes(estimate.status));
    const reactivationCandidates = store.contacts.filter((contact) => determineSegment(contact) !== null);

    return {
      business: store.business,
      summary,
      milestones: [
        {
          id: "milestone-calls",
          title: "Capture missed calls",
          description: "Run the mock calls flow, send the Twilio auto-reply, and turn a recovered call into a booking.",
          href: "/app/calls",
          statLabel: "Tracked call events",
          statValue: missedCalls.length,
        },
        {
          id: "milestone-estimates",
          title: "Rescue aging estimates",
          description: "Enroll stale quotes into follow-up and mark responded / booked outcomes from the estimates queue.",
          href: "/app/estimates",
          statLabel: "Quotes in rescue scope",
          statValue: staleEstimates.length,
        },
        {
          id: "milestone-reactivation",
          title: "Launch dormant demand",
          description: "Review seeded segments, launch a reactivation campaign, and watch reporting update from the same opportunity model.",
          href: "/app/reactivation",
          statLabel: "Dormant contacts",
          statValue: reactivationCandidates.length,
        },
      ],
    };
  },
};
