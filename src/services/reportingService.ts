import {
  demoBookings,
  demoOpportunities,
  demoReportSnapshots,
} from "@/services/seededDataService";

export function getReportSnapshots() {
  return demoReportSnapshots;
}

export function getCurrentVsPreviousSnapshot() {
  const current = demoReportSnapshots[0];
  const previous = demoReportSnapshots[1] ?? demoReportSnapshots[0];
  return { current, previous };
}

export function getWorkflowComparison() {
  const groups = [
    { key: "missed_call", name: "Missed Call Recovery" },
    { key: "estimate_rescue", name: "Estimate Rescue" },
    { key: "reactivation", name: "Reactivation" },
  ] as const;

  return groups.map((group) => {
    const rows = demoOpportunities.filter((opportunity) => opportunity.type === group.key);
    const recovered = rows.filter((opportunity) =>
      ["booked", "won"].includes(opportunity.status)
    );

    return {
      name: group.name,
      opportunities: rows.length,
      recovered: recovered.length,
      value: rows.reduce((sum, opportunity) => sum + opportunity.estimatedValue, 0),
      recoveredValue: recovered.reduce(
        (sum, opportunity) => sum + (opportunity.actualValue ?? 0),
        0
      ),
    };
  });
}

export function getRevenueSummary() {
  const { current } = getCurrentVsPreviousSnapshot();
  const activePipeline = demoOpportunities
    .filter((opportunity) => !["won", "lost", "closed"].includes(opportunity.status))
    .reduce((sum, opportunity) => sum + opportunity.estimatedValue, 0);

  return {
    directRecovered: current.revenueRecovered,
    influenced: current.revenueInfluenced,
    activePipeline,
    bookingsCreated: demoBookings.length,
  };
}
