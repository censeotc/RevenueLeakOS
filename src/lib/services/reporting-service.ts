import { getDemoStore } from "@/lib/data/demo-store";
import { getLatestReportSnapshot } from "@/lib/data/selectors";
import type { DashboardMetrics } from "@/lib/domain/types";

export function getDashboardMetrics(): DashboardMetrics {
  const store = getDemoStore();
  const recoveredOpportunities = store.opportunities.filter((opportunity) =>
    ["responded", "qualified", "booked"].includes(opportunity.status),
  );
  const influencedBookings = store.bookings.filter(
    (booking) => booking.attributionMethod === "influenced",
  );
  const estimatesReopened = store.estimates.filter((estimate) =>
    ["responded", "booked"].includes(estimate.status),
  ).length;
  const customersReactivated = store.bookings.filter(
    (booking) => booking.sourceType === "reactivation",
  ).length;
  const responseMinutes = store.callEvents
    .filter((call) => call.opportunityId)
    .map((call) => (call.isAfterHours ? 14 : call.wasAnswered ? 2 : 9));
  const avgResponseMinutes = responseMinutes.length
    ? Math.round(responseMinutes.reduce((sum, minutes) => sum + minutes, 0) / responseMinutes.length)
    : 0;

  return {
    revenueInfluenced: influencedBookings.reduce((sum, booking) => sum + booking.revenue, 0),
    opportunitiesRecovered: recoveredOpportunities.length,
    bookingsCreated: store.bookings.length,
    avgResponseMinutes,
    estimatesReopened,
    customersReactivated,
  };
}

export function getWorkflowPerformance() {
  const snapshot = getLatestReportSnapshot();
  return snapshot?.workflowBreakdown ?? [];
}

export function getRecoveryTrend() {
  const snapshot = getLatestReportSnapshot();
  return snapshot?.trend ?? [];
}

export function getRevenueSummary() {
  const store = getDemoStore();
  const directRevenue = store.bookings
    .filter((booking) => booking.attributionMethod === "direct")
    .reduce((sum, booking) => sum + booking.revenue, 0);
  const influencedRevenue = store.bookings
    .filter((booking) => booking.attributionMethod === "influenced")
    .reduce((sum, booking) => sum + booking.revenue, 0);

  return {
    directRevenue,
    influencedRevenue,
    totalRevenue: directRevenue + influencedRevenue,
  };
}

export function getWorkflowComparison() {
  const store = getDemoStore();
  return ["missed_call", "estimate_rescue", "reactivation"].map((type) => {
    const opportunities = store.opportunities.filter((opportunity) => opportunity.type === type);
    const bookings = store.bookings.filter((booking) =>
      opportunities.some((opportunity) => opportunity.id === booking.opportunityId),
    );

    return {
      type,
      opportunityCount: opportunities.length,
      bookingCount: bookings.length,
      conversionRate: opportunities.length
        ? Math.round((bookings.length / opportunities.length) * 100)
        : 0,
      revenue: bookings.reduce((sum, booking) => sum + booking.revenue, 0),
    };
  });
}

export function getResponseTimeSummary() {
  const calls = getDemoStore().callEvents.filter((call) => call.opportunityId);
  return calls.map((call) => ({
    label: call.classification,
    minutes: call.isAfterHours ? 14 : call.wasAnswered ? 2 : 9,
  }));
}

export function getConversionSummary() {
  const store = getDemoStore();
  const booked = store.opportunities.filter((opportunity) => opportunity.status === "booked").length;
  const responded = store.opportunities.filter((opportunity) => opportunity.status === "responded").length;
  const qualified = store.opportunities.filter((opportunity) => opportunity.status === "qualified").length;

  return [
    { label: "Responded", value: responded },
    { label: "Qualified", value: qualified },
    { label: "Booked", value: booked },
  ];
}
