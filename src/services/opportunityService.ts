import type { Opportunity, OpportunityStatus } from "@/types";
import { demoOpportunities, getContactById, getUserById } from "@/data/seed";

let opportunities = [...demoOpportunities];
let nextId = opportunities.length + 1;

export const opportunityService = {
  getAll(): Opportunity[] {
    return [...opportunities].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  },

  getById(id: string): Opportunity | undefined {
    return opportunities.find((o) => o.id === id);
  },

  getByType(type: string): Opportunity[] {
    return opportunities
      .filter((o) => o.type === type)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  getByStatus(status: OpportunityStatus): Opportunity[] {
    return opportunities
      .filter((o) => o.status === status)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  getForContact(contactId: string): Opportunity[] {
    return opportunities.filter((o) => o.contactId === contactId);
  },

  getOpen(): Opportunity[] {
    return opportunities.filter(
      (o) => !["won", "lost"].includes(o.status)
    );
  },

  updateStatus(id: string, status: OpportunityStatus): Opportunity | undefined {
    opportunities = opportunities.map((o) => {
      if (o.id !== id) return o;
      return {
        ...o,
        status,
        resolvedAt: ["won", "lost", "booked"].includes(status) ? new Date() : o.resolvedAt,
        actualValue: status === "won" ? o.estimatedValue : o.actualValue,
      };
    });
    return opportunities.find((o) => o.id === id);
  },

  assign(id: string, userId: string): Opportunity | undefined {
    opportunities = opportunities.map((o) =>
      o.id === id ? { ...o, assignedToId: userId } : o
    );
    return opportunities.find((o) => o.id === id);
  },

  create(partial: Partial<Opportunity>): Opportunity {
    const opp: Opportunity = {
      id: `opp_${String(nextId++).padStart(2, "0")}`,
      type: partial.type ?? "missed_call",
      status: "new",
      title: partial.title ?? "New Opportunity",
      description: partial.description ?? null,
      estimatedValue: partial.estimatedValue ?? 0,
      actualValue: null,
      source: partial.source ?? "manual",
      contactId: partial.contactId ?? "",
      assignedToId: partial.assignedToId ?? null,
      createdAt: new Date(),
      resolvedAt: null,
    };
    opportunities = [opp, ...opportunities];
    return opp;
  },

  getWithRelations(id: string) {
    const opp = opportunities.find((o) => o.id === id);
    if (!opp) return undefined;
    return {
      ...opp,
      contact: getContactById(opp.contactId),
      assignedTo: opp.assignedToId ? getUserById(opp.assignedToId) : undefined,
    };
  },

  getSummary() {
    const all = opportunities;
    const open = all.filter((o) => !["won", "lost"].includes(o.status));
    const won = all.filter((o) => o.status === "won");
    const totalPipeline = open.reduce((s, o) => s + o.estimatedValue, 0);
    const totalRecovered = won.reduce((s, o) => s + (o.actualValue ?? 0), 0);
    return {
      total: all.length,
      open: open.length,
      won: won.length,
      lost: all.filter((o) => o.status === "lost").length,
      totalPipeline,
      totalRecovered,
      byType: {
        missed_call: all.filter((o) => o.type === "missed_call").length,
        estimate_rescue: all.filter((o) => o.type === "estimate_rescue").length,
        reactivation: all.filter((o) => o.type === "reactivation").length,
      },
    };
  },

  reset() {
    opportunities = [...demoOpportunities];
    nextId = opportunities.length + 1;
  },
};
