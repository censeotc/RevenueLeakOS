import {
  demoOpportunities,
  demoContacts,
  demoUsers,
  demoMessages,
  getContactById,
  getUserById,
} from "@/lib/demo-data";

export interface OpportunityFilters {
  type?: string;
  status?: string;
  assignedToId?: string;
  contactId?: string;
}

export function getOpportunities(filters: OpportunityFilters = {}) {
  let opps = [...demoOpportunities];

  if (filters.type) {
    opps = opps.filter((o) => o.type === filters.type);
  }
  if (filters.status) {
    opps = opps.filter((o) => o.status === filters.status);
  }
  if (filters.assignedToId) {
    opps = opps.filter((o) => o.assignedToId === filters.assignedToId);
  }
  if (filters.contactId) {
    opps = opps.filter((o) => o.contactId === filters.contactId);
  }

  return opps.map((o) => ({
    ...o,
    contact: getContactById(o.contactId),
    assignedTo: o.assignedToId ? getUserById(o.assignedToId) : null,
    messages: demoMessages.filter((m) => m.opportunityId === o.id),
  }));
}

export function getOpportunityById(id: string) {
  const opp = demoOpportunities.find((o) => o.id === id);
  if (!opp) return null;
  return {
    ...opp,
    contact: getContactById(opp.contactId),
    assignedTo: opp.assignedToId ? getUserById(opp.assignedToId) : null,
    messages: demoMessages.filter((m) => m.opportunityId === opp.id),
  };
}

export function getPipelineStats() {
  const total = demoOpportunities.length;
  const active = demoOpportunities.filter((o) => !["won", "lost", "closed"].includes(o.status)).length;
  const won = demoOpportunities.filter((o) => o.status === "won" || o.status === "booked").length;
  const lost = demoOpportunities.filter((o) => o.status === "lost").length;

  const totalPipelineValue = demoOpportunities
    .filter((o) => !["won", "lost", "closed"].includes(o.status))
    .reduce((sum, o) => sum + o.estimatedValue, 0);

  const recoveredValue = demoOpportunities
    .filter((o) => o.actualValue != null)
    .reduce((sum, o) => sum + (o.actualValue ?? 0), 0);

  const conversionRate = total > 0 ? Math.round((won / total) * 100) : 0;

  const byType = {
    missed_call: demoOpportunities.filter((o) => o.type === "missed_call").length,
    estimate_rescue: demoOpportunities.filter((o) => o.type === "estimate_rescue").length,
    reactivation: demoOpportunities.filter((o) => o.type === "reactivation").length,
  };

  return {
    total,
    active,
    won,
    lost,
    totalPipelineValue,
    recoveredValue,
    conversionRate,
    byType,
  };
}

export function getAssignmentDistribution() {
  return demoUsers.map((user) => {
    const assigned = demoOpportunities.filter((o) => o.assignedToId === user.id);
    const active = assigned.filter((o) => !["won", "lost", "closed"].includes(o.status));
    return {
      user,
      total: assigned.length,
      active: active.length,
      value: active.reduce((sum, o) => sum + o.estimatedValue, 0),
    };
  });
}

// Simulated state mutation (demo only, in-memory)
const statusOverrides: Record<string, string> = {};

export function updateOpportunityStatus(id: string, status: string) {
  statusOverrides[id] = status;
}

export function getEffectiveStatus(id: string, fallback: string) {
  return statusOverrides[id] ?? fallback;
}
