import { DEMO_BUSINESS_ID } from "@/lib/demo-session";
import { getPilotDataSnapshot } from "@/services/pilot-data";

export interface WorkflowPerformanceRow {
  name: string;
  opportunities: number;
  recovered: number;
  value: number;
  recoveredValue: number;
}

export function projectDashboardSummaryAfterBooking(
  summary: Awaited<ReturnType<typeof getPilotDataSnapshot>>["dashboardSummary"],
  bookingValue: number
) {
  return {
    revenueInfluenced: summary.revenueInfluenced + bookingValue,
    opportunitiesRecovered: summary.opportunitiesRecovered + 1,
    bookingsCreated: summary.bookingsCreated + 1,
    avgResponseMinutes: Math.max(5, Math.round((summary.avgResponseMinutes - 2) * 10) / 10),
    estimatesReopened: summary.estimatesReopened,
    customersReactivated: summary.customersReactivated,
  };
}

export async function getDashboardPageData(businessId = DEMO_BUSINESS_ID) {
  const snapshot = await getPilotDataSnapshot(businessId);

  return {
    summary: snapshot.dashboardSummary,
    alerts: snapshot.alerts,
    activityLogs: snapshot.activityLogs,
    opportunities: snapshot.opportunities,
  };
}

export async function getReportingPageData(businessId = DEMO_BUSINESS_ID) {
  const snapshot = await getPilotDataSnapshot(businessId);
  const current = snapshot.reportSnapshots[0];
  const previous = snapshot.reportSnapshots[1];
  const activePipelineValue = snapshot.opportunities
    .filter((opportunity) => !["won", "lost", "closed"].includes(opportunity.status))
    .reduce((sum, opportunity) => sum + opportunity.estimatedValue, 0);

  const workflowPerformance: WorkflowPerformanceRow[] = [
    {
      name: "Missed Call Recovery",
      opportunities: snapshot.opportunities.filter((opportunity) => opportunity.type === "missed_call").length,
      recovered: snapshot.opportunities.filter(
        (opportunity) =>
          opportunity.type === "missed_call" && ["booked", "won"].includes(opportunity.status)
      ).length,
      value: snapshot.opportunities
        .filter((opportunity) => opportunity.type === "missed_call")
        .reduce((sum, opportunity) => sum + opportunity.estimatedValue, 0),
      recoveredValue: snapshot.opportunities
        .filter(
          (opportunity) =>
            opportunity.type === "missed_call" && ["booked", "won"].includes(opportunity.status)
        )
        .reduce((sum, opportunity) => sum + (opportunity.actualValue || 0), 0),
    },
    {
      name: "Estimate Rescue",
      opportunities: snapshot.opportunities.filter((opportunity) => opportunity.type === "estimate_rescue").length,
      recovered: snapshot.opportunities.filter(
        (opportunity) =>
          opportunity.type === "estimate_rescue" && ["booked", "won"].includes(opportunity.status)
      ).length,
      value: snapshot.opportunities
        .filter((opportunity) => opportunity.type === "estimate_rescue")
        .reduce((sum, opportunity) => sum + opportunity.estimatedValue, 0),
      recoveredValue: snapshot.opportunities
        .filter(
          (opportunity) =>
            opportunity.type === "estimate_rescue" && ["booked", "won"].includes(opportunity.status)
        )
        .reduce((sum, opportunity) => sum + (opportunity.actualValue || 0), 0),
    },
    {
      name: "Reactivation",
      opportunities: snapshot.opportunities.filter((opportunity) => opportunity.type === "reactivation").length,
      recovered: snapshot.opportunities.filter(
        (opportunity) =>
          opportunity.type === "reactivation" && ["booked", "won"].includes(opportunity.status)
      ).length,
      value: snapshot.opportunities
        .filter((opportunity) => opportunity.type === "reactivation")
        .reduce((sum, opportunity) => sum + opportunity.estimatedValue, 0),
      recoveredValue: snapshot.opportunities
        .filter(
          (opportunity) =>
            opportunity.type === "reactivation" && ["booked", "won"].includes(opportunity.status)
        )
        .reduce((sum, opportunity) => sum + (opportunity.actualValue || 0), 0),
    },
  ];

  return {
    current,
    previous,
    snapshots: snapshot.reportSnapshots,
    opportunities: snapshot.opportunities,
    bookings: snapshot.bookings,
    activePipelineValue,
    workflowPerformance,
  };
}
