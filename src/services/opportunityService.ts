import { opportunities } from "@/data/demoData";

export function getOpportunitySnapshot() {
  const selectedOpportunity = opportunities[0];
  return { opportunities, selectedOpportunity, notes: selectedOpportunity.notes, filterSummary: { pipeline: "All workflows", owner: "All owners", timeframe: "Last 14 days" } };
}
