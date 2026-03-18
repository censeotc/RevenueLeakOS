import {
  demoOpportunities,
  demoContacts,
  demoCallEvents,
  demoEstimates,
  demoMessages,
  demoBookings,
  getContactById,
  getUserById,
} from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

export type OpportunityType = "missed_call" | "estimate_rescue" | "reactivation";
export type OpportunityStatus = "new" | "contacted" | "in_progress" | "responded" | "booked" | "won" | "lost" | "closed";

export interface OpportunitySummary {
  total: number;
  byType: Record<OpportunityType, number>;
  byStatus: Record<string, number>;
  totalPipelineValue: number;
  totalRecoveredValue: number;
  conversionRate: number;
}

export interface OpportunityDetail {
  id: string;
  type: string;
  status: string;
  title: string;
  description: string | null;
  estimatedValue: number;
  actualValue: number | null;
  source: string | null;
  contactId: string;
  assignedToId: string | null;
  createdAt: Date;
  resolvedAt: Date | null;
  contact: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  } | null;
  assignedTo: {
    id: string;
    name: string;
    role: string;
  } | null;
  messages: typeof demoMessages;
  callEvents: typeof demoCallEvents;
  estimates: typeof demoEstimates;
  bookings: typeof demoBookings;
}

class OpportunityService {
  getAll(filters?: {
    type?: OpportunityType;
    status?: OpportunityStatus;
    assignedToId?: string;
    contactId?: string;
  }) {
    let results = [...demoOpportunities];

    if (filters?.type) {
      results = results.filter((o) => o.type === filters.type);
    }
    if (filters?.status) {
      results = results.filter((o) => o.status === filters.status);
    }
    if (filters?.assignedToId) {
      results = results.filter((o) => o.assignedToId === filters.assignedToId);
    }
    if (filters?.contactId) {
      results = results.filter((o) => o.contactId === filters.contactId);
    }

    return results;
  }

  getById(id: string): OpportunityDetail | null {
    const opp = demoOpportunities.find((o) => o.id === id);
    if (!opp) return null;

    const contact = getContactById(opp.contactId);
    const assignedTo = opp.assignedToId ? getUserById(opp.assignedToId) : null;

    return {
      ...opp,
      contact: contact
        ? { id: contact.id, firstName: contact.firstName, lastName: contact.lastName, phone: contact.phone, email: contact.email }
        : null,
      assignedTo: assignedTo
        ? { id: assignedTo.id, name: assignedTo.name, role: assignedTo.role }
        : null,
      messages: demoMessages.filter((m) => m.opportunityId === opp.id),
      callEvents: demoCallEvents.filter((c) => c.opportunityId === opp.id),
      estimates: demoEstimates.filter((e) => e.opportunityId === opp.id),
      bookings: demoBookings.filter((b) => b.opportunityId === opp.id),
    };
  }

  getSummary(): OpportunitySummary {
    const all = demoOpportunities;

    const byType = {
      missed_call: all.filter((o) => o.type === "missed_call").length,
      estimate_rescue: all.filter((o) => o.type === "estimate_rescue").length,
      reactivation: all.filter((o) => o.type === "reactivation").length,
    };

    const byStatus: Record<string, number> = {};
    all.forEach((o) => {
      byStatus[o.status] = (byStatus[o.status] || 0) + 1;
    });

    const active = all.filter((o) => !["won", "lost", "closed"].includes(o.status));
    const won = all.filter((o) => ["won", "booked"].includes(o.status));

    return {
      total: all.length,
      byType,
      byStatus,
      totalPipelineValue: active.reduce((sum, o) => sum + o.estimatedValue, 0),
      totalRecoveredValue: won.reduce((sum, o) => sum + (o.actualValue || 0), 0),
      conversionRate: all.length > 0 ? Math.round((won.length / all.length) * 100 * 10) / 10 : 0,
    };
  }

  getActive() {
    return demoOpportunities.filter(
      (o) => !["won", "lost", "closed"].includes(o.status)
    );
  }

  getHighValue(threshold = 2500) {
    return demoOpportunities.filter((o) => o.estimatedValue >= threshold);
  }

  getUnassigned() {
    return demoOpportunities.filter((o) => !o.assignedToId);
  }

  getRecentlyCreated(withinHours = 24) {
    const cutoff = new Date(Date.now() - withinHours * 3600000);
    return demoOpportunities.filter((o) => o.createdAt > cutoff);
  }

  createFromMissedCall(input: {
    contactId: string;
    callerName: string;
    callerNumber: string;
    estimatedValue?: number;
  }) {
    return {
      id: `opp_mc_${Date.now()}`,
      type: "missed_call" as const,
      status: "new" as const,
      title: `Missed call - ${input.callerName}`,
      description: `Inbound missed call from ${input.callerNumber}`,
      estimatedValue: input.estimatedValue || 350,
      actualValue: null,
      source: "phone",
      contactId: input.contactId,
      assignedToId: null,
      createdAt: new Date(),
      resolvedAt: null,
    };
  }

  createFromStaleEstimate(input: {
    contactId: string;
    contactName: string;
    estimateAmount: number;
    serviceType: string;
  }) {
    return {
      id: `opp_er_${Date.now()}`,
      type: "estimate_rescue" as const,
      status: "new" as const,
      title: `Stale estimate - ${input.contactName}`,
      description: `${input.serviceType} estimate (${formatCurrency(input.estimateAmount)}) awaiting follow-up`,
      estimatedValue: input.estimateAmount,
      actualValue: null,
      source: "estimate",
      contactId: input.contactId,
      assignedToId: null,
      createdAt: new Date(),
      resolvedAt: null,
    };
  }

  createForReactivation(input: {
    contactId: string;
    contactName: string;
    daysSinceService: number;
    estimatedValue?: number;
  }) {
    return {
      id: `opp_ra_${Date.now()}`,
      type: "reactivation" as const,
      status: "new" as const,
      title: `Reactivation - ${input.contactName}`,
      description: `${input.daysSinceService} days since last service`,
      estimatedValue: input.estimatedValue || 450,
      actualValue: null,
      source: "reactivation",
      contactId: input.contactId,
      assignedToId: null,
      createdAt: new Date(),
      resolvedAt: null,
    };
  }

  updateStatus(id: string, status: OpportunityStatus, actualValue?: number) {
    return {
      id,
      status,
      actualValue: actualValue || null,
      resolvedAt: ["won", "lost", "closed", "booked"].includes(status) ? new Date() : null,
    };
  }
}

export const opportunityService = new OpportunityService();
