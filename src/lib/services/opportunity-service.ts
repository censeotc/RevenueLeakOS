import { createId, mutateDemoStore } from "@/lib/data/demo-store";
import { findContactByPhone, getDormantSegments } from "@/lib/data/selectors";
import type {
  BookingSourceType,
  OpportunityStatus,
  OpportunityType,
} from "@/lib/domain/types";
import { twilioMockService } from "@/lib/services/twilio-mock-service";

type MissedCallInput = {
  firstName: string;
  lastName: string;
  phone: string;
  serviceType: string;
  summary: string;
  sourceLabel?: string;
  afterHours?: boolean;
};

export const opportunityService = {
  recordMissedCall(input: MissedCallInput) {
    const timestamp = new Date().toISOString();

    const existingContact = findContactByPhone(input.phone);
    const duplicateWindowMs = 4 * 60 * 60 * 1000;

    return mutateDemoStore((store) => {
      const duplicate = store.callEvents.find(
        (call) =>
          call.phoneNumber === input.phone &&
          new Date(timestamp).getTime() - new Date(call.startedAt).getTime() < duplicateWindowMs,
      );

      if (duplicate?.opportunityId) {
        return;
      }

      const contactId = existingContact?.id ?? createId("contact");
      if (!existingContact) {
        store.contacts.unshift({
          id: contactId,
          businessId: store.business.id,
          locationId: store.locations[0].id,
          firstName: input.firstName,
          lastName: input.lastName,
          email: `${input.firstName.toLowerCase()}.${input.lastName.toLowerCase()}@example.com`,
          phone: input.phone,
          type: "lead",
          status: "active",
          tags: ["missed-call"],
          source: input.sourceLabel ?? "Inbound call",
          notesSummary: "Created automatically from missed-call workflow.",
          lastContactedAt: timestamp,
        });
      }

      const opportunityId = createId("opp");
      store.opportunities.unshift({
        id: opportunityId,
        businessId: store.business.id,
        contactId,
        locationId: store.locations[0].id,
        ownerId: store.users.find((user) => user.role === "csr")?.id,
        campaignId: store.campaigns.find((campaign) => campaign.type === "missed_call_followup")?.id,
        type: "missed_call",
        status: "new",
        title: `${input.serviceType} missed call`,
        description: input.summary,
        serviceType: input.serviceType,
        value: input.serviceType.toLowerCase().includes("install") ? 2800 : 650,
        sourceLabel: input.sourceLabel ?? "Inbound call",
        intakeSummary: input.summary,
        nextActionAt: timestamp,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      store.callEvents.unshift({
        id: createId("call"),
        businessId: store.business.id,
        opportunityId,
        contactId,
        locationId: store.locations[0].id,
        phoneNumber: input.phone,
        direction: "inbound",
        classification: input.afterHours ? "after-hours" : "missed",
        ringDurationSeconds: 36,
        isAfterHours: Boolean(input.afterHours),
        wasAnswered: false,
        wasBooked: false,
        summary: input.summary,
        startedAt: timestamp,
        endedAt: timestamp,
      });

      store.activityLogs.unshift({
        id: createId("activity"),
        businessId: store.business.id,
        opportunityId,
        contactId,
        type: "workflow",
        title: "Missed call opportunity created",
        message: `Opportunity created from ${input.afterHours ? "after-hours" : "missed"} inbound call.`,
        createdAt: timestamp,
      });

      twilioMockService.sendMessage({
        businessId: store.business.id,
        opportunityId,
        contactId,
        campaignId: store.campaigns.find((campaign) => campaign.type === "missed_call_followup")?.id,
        templateId: store.templates.find((template) => template.category === "missed_call")?.id,
        body: `Hi ${input.firstName}, sorry we missed your call. Reply with your issue and we'll get you scheduled fast.`,
      });
    });
  },

  updateOpportunityStatus(opportunityId: string, status: OpportunityStatus) {
    return mutateDemoStore((store) => {
      const opportunity = store.opportunities.find((item) => item.id === opportunityId);
      if (!opportunity) return;

      opportunity.status = status;
      opportunity.updatedAt = new Date().toISOString();
      if (status === "booked") {
        opportunity.bookedAt = new Date().toISOString();
      }
      if (status === "lost" || status === "closed") {
        opportunity.closedAt = new Date().toISOString();
      }
    });
  },

  assignOpportunity(opportunityId: string, ownerId: string) {
    return mutateDemoStore((store) => {
      const opportunity = store.opportunities.find((item) => item.id === opportunityId);
      if (!opportunity) return;
      opportunity.ownerId = ownerId;
      opportunity.updatedAt = new Date().toISOString();
    });
  },

  addOpportunityNote(opportunityId: string, authorId: string, body: string) {
    const timestamp = new Date().toISOString();
    return mutateDemoStore((store) => {
      const opportunity = store.opportunities.find((item) => item.id === opportunityId);
      if (!opportunity) return;

      store.opportunityNotes.unshift({
        id: createId("note"),
        opportunityId,
        authorId,
        body,
        createdAt: timestamp,
      });

      store.activityLogs.unshift({
        id: createId("activity"),
        businessId: store.business.id,
        opportunityId,
        actorUserId: authorId,
        type: "note",
        title: "Opportunity note added",
        message: body,
        createdAt: timestamp,
      });

      opportunity.updatedAt = timestamp;
    });
  },

  simulateReply(opportunityId: string, body: string) {
    const timestamp = new Date().toISOString();
    return mutateDemoStore((store) => {
      const opportunity = store.opportunities.find((item) => item.id === opportunityId);
      if (!opportunity) return;

      opportunity.status = "responded";
      opportunity.lastContactAt = timestamp;
      opportunity.updatedAt = timestamp;

      twilioMockService.simulateReply({
        businessId: store.business.id,
        opportunityId,
        contactId: opportunity.contactId,
        body,
      });
    });
  },

  logBooking(opportunityId: string, title: string, revenue: number) {
    const timestamp = new Date().toISOString();

    return mutateDemoStore((store) => {
      const opportunity = store.opportunities.find((item) => item.id === opportunityId);
      if (!opportunity) return;

      const sourceType = opportunity.type as BookingSourceType;
      store.bookings.unshift({
        id: createId("booking"),
        businessId: store.business.id,
        opportunityId,
        contactId: opportunity.contactId,
        locationId: opportunity.locationId,
        sourceType,
        attributionMethod: opportunity.type === "reactivation" ? "influenced" : "direct",
        title,
        scheduledFor: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        revenue,
        notes: "Logged from mock workflow.",
      });

      opportunity.status = "booked";
      opportunity.bookedAt = timestamp;
      opportunity.updatedAt = timestamp;

      const call = store.callEvents.find((item) => item.opportunityId === opportunityId);
      if (call) {
        call.wasBooked = true;
      }

      store.activityLogs.unshift({
        id: createId("activity"),
        businessId: store.business.id,
        opportunityId,
        contactId: opportunity.contactId,
        type: "booking",
        title: "Booking logged",
        message: `${title} logged for ${revenue.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        })}.`,
        createdAt: timestamp,
      });
    });
  },

  enrollEstimateFollowUp(estimateId: string) {
    const timestamp = new Date().toISOString();

    return mutateDemoStore((store) => {
      const estimate = store.estimates.find((item) => item.id === estimateId);
      if (!estimate) return;

      const existing = estimate.opportunityId
        ? store.opportunities.find((item) => item.id === estimate.opportunityId)
        : undefined;

      if (existing) {
        existing.status = "attempted";
        existing.updatedAt = timestamp;
      } else {
        const opportunityId = createId("opp");
        store.opportunities.unshift({
          id: opportunityId,
          businessId: store.business.id,
          contactId: estimate.contactId,
          locationId: estimate.locationId,
          ownerId: store.users.find((user) => user.role === "manager")?.id,
          type: "estimate_rescue",
          status: "attempted",
          title: `${estimate.serviceType} estimate rescue`,
          description: "Created from stale estimate enrollment.",
          serviceType: estimate.serviceType,
          value: estimate.amount,
          sourceLabel: "Estimate import",
          nextActionAt: timestamp,
          createdAt: timestamp,
          updatedAt: timestamp,
        });
        estimate.opportunityId = opportunityId;
      }

      estimate.status = "stale";
      estimate.staleAt = estimate.staleAt ?? timestamp;

      store.activityLogs.unshift({
        id: createId("activity"),
        businessId: store.business.id,
        opportunityId: estimate.opportunityId,
        contactId: estimate.contactId,
        type: "estimate",
        title: "Estimate enrolled in rescue follow-up",
        message: `${estimate.serviceType} estimate enrolled in automated follow-up.`,
        createdAt: timestamp,
      });
    });
  },

  updateEstimateStatus(estimateId: string, status: "responded" | "booked" | "lost") {
    const timestamp = new Date().toISOString();

    return mutateDemoStore((store) => {
      const estimate = store.estimates.find((item) => item.id === estimateId);
      if (!estimate) return;

      estimate.status = status;
      if (status === "responded") estimate.respondedAt = timestamp;
      if (status === "booked") estimate.bookedAt = timestamp;
      if (status === "lost") estimate.lostAt = timestamp;

      if (estimate.opportunityId) {
        const opportunity = store.opportunities.find((item) => item.id === estimate.opportunityId);
        if (opportunity) {
          opportunity.status =
            status === "responded" ? "responded" : status === "booked" ? "booked" : "lost";
          opportunity.updatedAt = timestamp;
        }
      }
    });
  },

  createReactivationOpportunities(segmentId: string, ownerId?: string) {
    const timestamp = new Date().toISOString();
    const segment = getDormantSegments().find((item) => item.id === segmentId);
    if (!segment) return;

    return mutateDemoStore((store) => {
      for (const contact of segment.contacts) {
        const existing = store.opportunities.find(
          (opportunity) =>
            opportunity.contactId === contact.id &&
            opportunity.type === "reactivation" &&
            !["lost", "closed"].includes(opportunity.status),
        );

        if (existing) continue;

        store.opportunities.unshift({
          id: createId("opp"),
          businessId: store.business.id,
          contactId: contact.id,
          locationId: contact.locationId,
          ownerId: ownerId ?? store.users.find((user) => user.role === "manager")?.id,
          type: "reactivation",
          status: "new",
          title: `${segment.name} outreach`,
          description: "Created from reactivation segment launch.",
          serviceType: segment.serviceType,
          value: 450,
          sourceLabel: segment.name,
          nextActionAt: timestamp,
          createdAt: timestamp,
          updatedAt: timestamp,
        });
      }
    });
  },

  createOrUpdateOpportunity(
    type: OpportunityType,
    status: OpportunityStatus,
    updates: Partial<MissedCallInput> & { contactId: string; title: string; value: number },
  ) {
    return mutateDemoStore((store) => {
      store.opportunities.unshift({
        id: createId("opp"),
        businessId: store.business.id,
        contactId: updates.contactId,
        locationId: store.locations[0].id,
        type,
        status,
        title: updates.title,
        serviceType: updates.serviceType ?? "General service",
        value: updates.value,
        description: updates.summary,
        sourceLabel: updates.sourceLabel,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  },
};
