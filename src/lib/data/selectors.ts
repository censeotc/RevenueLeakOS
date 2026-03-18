import { differenceInDays } from "date-fns";

import { getDemoStore } from "@/lib/data/demo-store";
import type {
  DemoCampaign,
  DemoContact,
  DemoEstimate,
  DemoOpportunity,
  DemoReportSnapshot,
  DemoTenantData,
  OpportunityType,
  OpportunityWithRelations,
} from "@/lib/domain/types";

function sortByNewest<T extends Record<string, unknown>>(
  items: T[],
) {
  return [...items].sort((a, b) => {
    const left = new Date(
      (a.createdAt as string | undefined) ??
        (a.startedAt as string | undefined) ??
        (a.sentAt as string | undefined) ??
        (a.periodEnd as string | undefined) ??
        0,
    ).getTime();
    const right = new Date(
      (b.createdAt as string | undefined) ??
        (b.startedAt as string | undefined) ??
        (b.sentAt as string | undefined) ??
        (b.periodEnd as string | undefined) ??
        0,
    ).getTime();
    return right - left;
  });
}

export function getBusiness() {
  return getDemoStore().business;
}

export function getUsers() {
  return getDemoStore().users;
}

export function getLocations() {
  return getDemoStore().locations;
}

export function getContacts() {
  return getDemoStore().contacts;
}

export function getOpportunities(type?: OpportunityType) {
  const store = getDemoStore();
  const filtered = type
    ? store.opportunities.filter((item) => item.type === type)
    : store.opportunities;

  return sortByNewest(filtered).map((opportunity) => attachOpportunityRelations(store, opportunity));
}

export function getOpportunityById(id?: string) {
  if (!id) return undefined;
  const store = getDemoStore();
  const opportunity = store.opportunities.find((item) => item.id === id);
  return opportunity ? attachOpportunityRelations(store, opportunity) : undefined;
}

export function getCalls(classification?: string) {
  const store = getDemoStore();
  const calls = classification && classification !== "all"
    ? store.callEvents.filter((call) => call.classification === classification)
    : store.callEvents;

  return [...calls]
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .map((call) => ({
      ...call,
      contact: store.contacts.find((contact) => contact.id === call.contactId),
      opportunity: call.opportunityId
        ? store.opportunities.find((opportunity) => opportunity.id === call.opportunityId)
        : undefined,
      messages: store.messageEvents.filter((message) => message.opportunityId === call.opportunityId),
      booking: call.opportunityId
        ? store.bookings.find((booking) => booking.opportunityId === call.opportunityId)
        : undefined,
    }));
}

export function getEstimates(status?: string) {
  const store = getDemoStore();
  const estimates = status && status !== "all"
    ? store.estimates.filter((estimate) => estimate.status === status)
    : store.estimates;

  return [...estimates]
    .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
    .reverse()
    .map((estimate) => attachEstimateRelations(store, estimate));
}

export function getCampaigns() {
  const store = getDemoStore();
  return store.campaigns.map((campaign) => ({
    ...campaign,
    steps: store.campaignSteps
      .filter((step) => step.campaignId === campaign.id)
      .sort((a, b) => a.position - b.position),
    opportunities: store.opportunities.filter((opportunity) => opportunity.campaignId === campaign.id),
    messageCount: store.messageEvents.filter((message) => message.campaignId === campaign.id).length,
    bookingCount: store.bookings.filter((booking) =>
      store.opportunities.some(
        (opportunity) => opportunity.id === booking.opportunityId && opportunity.campaignId === campaign.id,
      ),
    ).length,
  }));
}

export function getTemplates(category?: string) {
  const store = getDemoStore();
  return store.templates.filter((template) => (category && category !== "all" ? template.category === category : true));
}

export function getIntegrations() {
  return getDemoStore().integrationConnections;
}

export function getReportSnapshots() {
  return sortByNewest<DemoReportSnapshot>(getDemoStore().reportSnapshots);
}

export function getLatestReportSnapshot() {
  return getReportSnapshots()[0];
}

export function getRecentActivity(limit = 6) {
  const store = getDemoStore();
  return [...store.activityLogs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
    .map((activity) => ({
      ...activity,
      actor: activity.actorUserId
        ? store.users.find((user) => user.id === activity.actorUserId)
        : undefined,
      opportunity: activity.opportunityId
        ? store.opportunities.find((opportunity) => opportunity.id === activity.opportunityId)
        : undefined,
      contact: activity.contactId ? store.contacts.find((contact) => contact.id === activity.contactId) : undefined,
    }));
}

export function getAlerts() {
  return getDemoStore().alerts;
}

export function getDormantSegments() {
  const store = getDemoStore();
  const now = new Date();

  const segments = [
    {
      id: "segment_dormant_12m",
      name: "No service in 12+ months",
      contacts: store.contacts.filter((contact) => {
        if (!contact.lastServiceAt) return false;
        return differenceInDays(now, new Date(contact.lastServiceAt)) >= 365;
      }),
      serviceType: "Tune-up + system inspection",
    },
    {
      id: "segment_maintenance_due",
      name: "Maintenance due",
      contacts: store.contacts.filter((contact) => {
        if (!contact.lastServiceAt) return false;
        return differenceInDays(now, new Date(contact.lastServiceAt)) >= 330;
      }),
      serviceType: "Maintenance visit",
    },
    {
      id: "segment_membership",
      name: "Membership renewal",
      contacts: store.contacts.filter((contact) => contact.tags.includes("membership")),
      serviceType: "Membership renewal",
    },
    {
      id: "segment_replacement",
      name: "Replacement cycle candidates",
      contacts: store.contacts.filter((contact) => contact.tags.includes("replacement")),
      serviceType: "Replacement consultation",
    },
  ];

  return segments.map((segment) => ({
    ...segment,
    estimatedValue: segment.contacts.reduce((sum) => sum + 450, 0),
  }));
}

export function getWorkflowSummary() {
  const opportunities = getDemoStore().opportunities;
  return [
    {
      type: "missed_call" as const,
      label: "Missed Call",
      count: opportunities.filter((item) => item.type === "missed_call").length,
    },
    {
      type: "estimate_rescue" as const,
      label: "Estimate Rescue",
      count: opportunities.filter((item) => item.type === "estimate_rescue").length,
    },
    {
      type: "reactivation" as const,
      label: "Reactivation",
      count: opportunities.filter((item) => item.type === "reactivation").length,
    },
  ];
}

export function getDemoWalkthroughData() {
  const store = getDemoStore();
  const opportunity = attachOpportunityRelations(
    store,
    store.opportunities.find((item) => item.id === "opp_missed_01") ?? store.opportunities[0],
  );

  return {
    opportunity,
    messages: opportunity.messages,
    booking: opportunity.bookings[0],
    snapshot: getLatestReportSnapshot(),
  };
}

export function findContactByPhone(phone: string) {
  const normalized = phone.replace(/\D/g, "");
  return getDemoStore().contacts.find(
    (contact) => contact.phone.replace(/\D/g, "") === normalized,
  );
}

export function attachOpportunityRelations(
  store: DemoTenantData,
  opportunity: DemoOpportunity,
): OpportunityWithRelations {
  return {
    ...opportunity,
    contact: store.contacts.find((contact) => contact.id === opportunity.contactId)!,
    owner: opportunity.ownerId
      ? store.users.find((user) => user.id === opportunity.ownerId)
      : undefined,
    notes: store.opportunityNotes.filter((note) => note.opportunityId === opportunity.id),
    callEvents: store.callEvents.filter((call) => call.opportunityId === opportunity.id),
    estimates: store.estimates.filter((estimate) => estimate.opportunityId === opportunity.id),
    messages: store.messageEvents.filter((message) => message.opportunityId === opportunity.id),
    bookings: store.bookings.filter((booking) => booking.opportunityId === opportunity.id),
    activities: store.activityLogs.filter((activity) => activity.opportunityId === opportunity.id),
  };
}

export function attachEstimateRelations(store: DemoTenantData, estimate: DemoEstimate) {
  const contact = store.contacts.find((item) => item.id === estimate.contactId)!;
  const opportunity = estimate.opportunityId
    ? store.opportunities.find((item) => item.id === estimate.opportunityId)
    : undefined;

  return {
    ...estimate,
    contact,
    opportunity,
    ageInDays: differenceInDays(new Date(), new Date(estimate.sentAt)),
  };
}

export function getCampaignById(campaignId?: string): DemoCampaign | undefined {
  if (!campaignId) return undefined;
  return getDemoStore().campaigns.find((campaign) => campaign.id === campaignId);
}

export function getContactById(contactId?: string): DemoContact | undefined {
  if (!contactId) return undefined;
  return getDemoStore().contacts.find((contact) => contact.id === contactId);
}
