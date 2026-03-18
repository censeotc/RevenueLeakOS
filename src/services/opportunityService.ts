import {
  demoContacts,
  demoMessages,
  demoOpportunities,
  demoUsers,
} from "@/services/seededDataService";

type OpportunityRecord = (typeof demoOpportunities)[number];
type OpportunityType = OpportunityRecord["type"];
type OpportunityStatus = OpportunityRecord["status"];

export interface OpportunityFilters {
  type?: OpportunityType;
  status?: OpportunityStatus;
}

export interface OpportunityWithContext extends OpportunityRecord {
  contactName: string;
  assigneeName: string | null;
  messageCount: number;
}

export function listOpportunities(filters?: OpportunityFilters) {
  let rows = [...demoOpportunities];

  if (filters?.type) {
    rows = rows.filter((row) => row.type === filters.type);
  }

  if (filters?.status) {
    rows = rows.filter((row) => row.status === filters.status);
  }

  return rows;
}

export function listOpportunitiesWithContext(filters?: OpportunityFilters): OpportunityWithContext[] {
  return listOpportunities(filters).map((opportunity) => {
    const contact = demoContacts.find((row) => row.id === opportunity.contactId);
    const assignee = opportunity.assignedToId
      ? demoUsers.find((user) => user.id === opportunity.assignedToId)
      : null;
    const messageCount = demoMessages.filter(
      (message) => message.opportunityId === opportunity.id
    ).length;

    return {
      ...opportunity,
      contactName: contact ? `${contact.firstName} ${contact.lastName}` : "Unknown Contact",
      assigneeName: assignee?.name ?? null,
      messageCount,
    };
  });
}

export function getOpportunityById(opportunityId: string) {
  return demoOpportunities.find((row) => row.id === opportunityId) ?? null;
}

export function getOpportunitySummary() {
  const active = demoOpportunities.filter(
    (row) => !["won", "lost", "closed"].includes(row.status)
  );

  const won = demoOpportunities.filter((row) =>
    ["won", "booked"].includes(row.status)
  );

  return {
    total: demoOpportunities.length,
    activeCount: active.length,
    wonCount: won.length,
    pipelineValue: active.reduce((sum, row) => sum + row.estimatedValue, 0),
    recoveredValue: won.reduce((sum, row) => sum + (row.actualValue ?? 0), 0),
  };
}
