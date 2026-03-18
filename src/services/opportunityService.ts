import type { OpportunityRow, OpportunityStatus } from "@/types/revenue";
import { demoOpportunities } from "@/data/demoData";

export async function listOpportunities(
  _businessId: string,
  filters?: { status?: OpportunityStatus; type?: string }
): Promise<OpportunityRow[]> {
  let results = [...demoOpportunities];
  if (filters?.status) {
    results = results.filter((o) => o.status === filters.status);
  }
  if (filters?.type) {
    results = results.filter((o) => o.type === filters.type);
  }
  return results;
}

export async function getOpportunityById(
  id: string
): Promise<OpportunityRow | null> {
  return demoOpportunities.find((o) => o.id === id) ?? null;
}

export async function updateOpportunityStatus(
  id: string,
  status: OpportunityStatus
): Promise<OpportunityRow | null> {
  const opp = demoOpportunities.find((o) => o.id === id);
  if (!opp) return null;
  return { ...opp, status };
}
