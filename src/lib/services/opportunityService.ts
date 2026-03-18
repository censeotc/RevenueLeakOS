import type { OpportunityType, OpportunityStatus } from "@prisma/client";
import {
  DEMO_OPPORTUNITIES,
  DEMO_CONTACTS,
  DEMO_USERS,
  DEMO_DASHBOARD_KPIS,
  type DemoOpportunity,
  type DemoContact,
} from "@/lib/demo-data";

export interface OpportunityFilters {
  type?: OpportunityType;
  status?: OpportunityStatus;
  assignedToId?: string;
  search?: string;
  minValue?: number;
  maxValue?: number;
  sortBy?: "createdAt" | "estimatedValue" | "priority";
  sortOrder?: "asc" | "desc";
}

export interface OpportunityWithRelations extends DemoOpportunity {
  contact?: DemoContact;
  assignedTo?: { id: string; name: string; role: string } | null;
  notes?: OpportunityNote[];
}

export interface OpportunityNote {
  id: string;
  opportunityId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

export interface OpportunityStats {
  total: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  totalEstimatedValue: number;
  totalActualValue: number;
  conversionRate: number;
}

const mockNotes: OpportunityNote[] = [
  {
    id: "note_1",
    opportunityId: "opp_1",
    userId: "usr_3",
    userName: "Jake Morrison",
    content: "Left voicemail, will try again tomorrow morning.",
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
  },
  {
    id: "note_2",
    opportunityId: "opp_2",
    userId: "usr_2",
    userName: "Sarah Chen",
    content: "Sent follow-up SMS. Customer seems interested in a full AC system.",
    createdAt: new Date(Date.now() - 60 * 60 * 60 * 1000),
  },
  {
    id: "note_3",
    opportunityId: "opp_3",
    userId: "usr_3",
    userName: "Jake Morrison",
    content: "Customer replied to SMS - confirmed water heater is leaking. Scheduling visit.",
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
  },
  {
    id: "note_4",
    opportunityId: "opp_7",
    userId: "usr_2",
    userName: "Sarah Chen",
    content: "Customer wants updated pricing for bathroom remodel. Sending revised estimate.",
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
  },
  {
    id: "note_5",
    opportunityId: "opp_10",
    userId: "usr_1",
    userName: "Mike Reynolds",
    content: "Spoke with Patricia - moved to new home, needs full HVAC. Scheduling site visit.",
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
  },
];

export async function getOpportunities(
  businessId: string,
  filters?: OpportunityFilters
): Promise<OpportunityWithRelations[]> {
  let results = DEMO_OPPORTUNITIES.filter(
    (o) => o.businessId === businessId
  );

  if (filters?.type) {
    results = results.filter((o) => o.type === filters.type);
  }

  if (filters?.status) {
    results = results.filter((o) => o.status === filters.status);
  }

  if (filters?.assignedToId) {
    results = results.filter((o) => o.assignedToId === filters.assignedToId);
  }

  if (filters?.search) {
    const term = filters.search.toLowerCase();
    results = results.filter(
      (o) =>
        o.title.toLowerCase().includes(term) ||
        o.description?.toLowerCase().includes(term)
    );
  }

  if (filters?.minValue !== undefined) {
    results = results.filter(
      (o) => (o.estimatedValue ?? 0) >= filters.minValue!
    );
  }

  if (filters?.maxValue !== undefined) {
    results = results.filter(
      (o) => (o.estimatedValue ?? 0) <= filters.maxValue!
    );
  }

  const sortBy = filters?.sortBy ?? "createdAt";
  const sortOrder = filters?.sortOrder ?? "desc";
  results.sort((a, b) => {
    let cmp = 0;
    if (sortBy === "createdAt") {
      cmp = a.createdAt.getTime() - b.createdAt.getTime();
    } else if (sortBy === "estimatedValue") {
      cmp = (a.estimatedValue ?? 0) - (b.estimatedValue ?? 0);
    } else if (sortBy === "priority") {
      cmp = a.priority - b.priority;
    }
    return sortOrder === "desc" ? -cmp : cmp;
  });

  return results.map((o) => ({
    ...o,
    contact: DEMO_CONTACTS.find((c) => c.id === o.contactId),
    assignedTo: o.assignedToId
      ? (() => {
          const u = DEMO_USERS.find((u) => u.id === o.assignedToId);
          return u ? { id: u.id, name: u.name, role: u.role } : null;
        })()
      : null,
  }));
}

export async function getOpportunityById(
  id: string
): Promise<OpportunityWithRelations | null> {
  const opp = DEMO_OPPORTUNITIES.find((o) => o.id === id);
  if (!opp) return null;

  const contact = DEMO_CONTACTS.find((c) => c.id === opp.contactId);
  const assignedTo = opp.assignedToId
    ? (() => {
        const u = DEMO_USERS.find((u) => u.id === opp.assignedToId);
        return u ? { id: u.id, name: u.name, role: u.role } : null;
      })()
    : null;

  const notes = mockNotes.filter((n) => n.opportunityId === id);

  return {
    ...opp,
    contact,
    assignedTo,
    notes,
  };
}

export async function createOpportunity(data: {
  businessId: string;
  contactId: string;
  type: OpportunityType;
  title: string;
  description?: string;
  estimatedValue?: number;
  serviceType?: string;
  assignedToId?: string;
}): Promise<DemoOpportunity> {
  const newOpp: DemoOpportunity = {
    id: `opp_${Date.now()}`,
    businessId: data.businessId,
    contactId: data.contactId,
    assignedToId: data.assignedToId ?? null,
    type: data.type,
    status: "new" as OpportunityStatus,
    title: data.title,
    description: data.description ?? null,
    estimatedValue: data.estimatedValue ?? null,
    actualValue: null,
    serviceType: data.serviceType ?? null,
    priority: 1,
    source: "manual",
    attribution: "direct",
    resolvedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  console.log("[OpportunityService] Created opportunity:", newOpp.id);
  return newOpp;
}

export async function updateOpportunityStatus(
  id: string,
  status: OpportunityStatus
): Promise<DemoOpportunity | null> {
  const opp = DEMO_OPPORTUNITIES.find((o) => o.id === id);
  if (!opp) return null;

  const updated = {
    ...opp,
    status,
    updatedAt: new Date(),
    resolvedAt:
      status === "booked" || status === "lost" || status === "closed"
        ? new Date()
        : opp.resolvedAt,
  };

  console.log(
    `[OpportunityService] Updated opportunity ${id} status to ${status}`
  );
  return updated;
}

export async function addNote(
  opportunityId: string,
  userId: string,
  content: string
): Promise<OpportunityNote> {
  const user = DEMO_USERS.find((u) => u.id === userId);
  const note: OpportunityNote = {
    id: `note_${Date.now()}`,
    opportunityId,
    userId,
    userName: user?.name ?? "Unknown User",
    content,
    createdAt: new Date(),
  };

  console.log(
    `[OpportunityService] Note added to ${opportunityId} by ${note.userName}`
  );
  return note;
}

export async function getOpportunityStats(
  businessId: string
): Promise<OpportunityStats> {
  const opps = DEMO_OPPORTUNITIES.filter((o) => o.businessId === businessId);

  const byStatus: Record<string, number> = {};
  const byType: Record<string, number> = {};
  let totalEstimated = 0;
  let totalActual = 0;
  let bookedCount = 0;

  for (const o of opps) {
    byStatus[o.status] = (byStatus[o.status] ?? 0) + 1;
    byType[o.type] = (byType[o.type] ?? 0) + 1;
    totalEstimated += o.estimatedValue ?? 0;
    totalActual += o.actualValue ?? 0;
    if (o.status === "booked") bookedCount++;
  }

  return {
    total: opps.length,
    byStatus,
    byType,
    totalEstimatedValue: totalEstimated,
    totalActualValue: totalActual,
    conversionRate: opps.length > 0 ? bookedCount / opps.length : 0,
  };
}
