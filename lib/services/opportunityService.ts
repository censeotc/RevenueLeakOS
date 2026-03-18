import {
  AttributionMethod,
  BookingSourceType,
  OpportunityStatus,
  OpportunityType,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { twilioMockService } from "@/lib/services/twilioMockService";

export const opportunityService = {
  async listByBusiness(businessId: string, type?: OpportunityType | "all") {
    return prisma.opportunity.findMany({
      where: {
        businessId,
        ...(type && type !== "all" ? { type } : {}),
      },
      include: {
        contact: true,
        owner: true,
        notes: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
        },
        messageEvents: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        callEvents: {
          orderBy: { startedAt: "desc" },
          take: 5,
        },
        bookings: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: [{ createdAt: "desc" }],
    });
  },

  async updateStatus(opportunityId: string, status: OpportunityStatus) {
    return prisma.opportunity.update({
      where: { id: opportunityId },
      data: {
        status,
        closedAt: status === OpportunityStatus.booked || status === OpportunityStatus.lost
          ? new Date()
          : null,
      },
    });
  },

  async assign(opportunityId: string, ownerId: string) {
    return prisma.opportunity.update({
      where: { id: opportunityId },
      data: { ownerId },
    });
  },

  async addNote(opportunityId: string, userId: string, body: string) {
    return prisma.opportunityNote.create({
      data: {
        opportunityId,
        userId,
        body,
      },
    });
  },

  async runMissedCallWorkflow(input: {
    businessId: string;
    fromNumber: string;
    toNumber: string;
    intakeSummary?: string;
  }) {
    const suppressionThreshold = new Date(Date.now() - 4 * 60 * 60 * 1000);
    const recentCall = await prisma.callEvent.findFirst({
      where: {
        businessId: input.businessId,
        fromNumber: input.fromNumber,
        isMissed: true,
        startedAt: { gte: suppressionThreshold },
      },
      orderBy: { startedAt: "desc" },
    });

    if (recentCall?.opportunityId) {
      return { suppressed: true, opportunityId: recentCall.opportunityId };
    }

    const contact =
      (await prisma.contact.findFirst({
        where: {
          businessId: input.businessId,
          phone: input.fromNumber,
        },
      })) ??
      (await prisma.contact.create({
        data: {
          businessId: input.businessId,
          firstName: "New",
          lastName: "Caller",
          fullName: "New Caller",
          phone: input.fromNumber,
          tags: ["auto-created"],
        },
      }));

    const opportunity = await prisma.opportunity.create({
      data: {
        businessId: input.businessId,
        contactId: contact.id,
        type: OpportunityType.missed_call,
        status: OpportunityStatus.new,
        title: `Missed inbound call from ${contact.fullName}`,
        description: "Auto-created from inbound missed call workflow.",
        serviceType: "Unspecified",
        value: 950,
      },
    });

    await prisma.callEvent.create({
      data: {
        businessId: input.businessId,
        contactId: contact.id,
        opportunityId: opportunity.id,
        fromNumber: input.fromNumber,
        toNumber: input.toNumber,
        startedAt: new Date(),
        isMissed: true,
        outcome: "missed",
        intakeSummary: input.intakeSummary ?? "Inbound missed call captured by workflow.",
      },
    });

    const sms = await twilioMockService.sendSms({
      businessId: input.businessId,
      contactId: contact.id,
      opportunityId: opportunity.id,
      body: `Hi ${contact.firstName}, sorry we missed your call. Reply with your issue and we can book you right away.`,
    });

    await prisma.activityLog.create({
      data: {
        businessId: input.businessId,
        opportunityId: opportunity.id,
        contactId: contact.id,
        eventType: "missed_call_workflow",
        summary: "Missed call workflow executed and SMS sent.",
        metadata: {
          messageId: sms.id,
        },
      },
    });

    return { suppressed: false, opportunityId: opportunity.id, contactId: contact.id };
  },

  async logBooking(input: {
    businessId: string;
    opportunityId: string;
    contactId: string;
    sourceType: BookingSourceType;
    revenue: number;
    serviceType: string;
  }) {
    const booking = await prisma.booking.create({
      data: {
        businessId: input.businessId,
        opportunityId: input.opportunityId,
        contactId: input.contactId,
        sourceType: input.sourceType,
        attributionMethod: AttributionMethod.direct,
        revenue: input.revenue,
        serviceType: input.serviceType,
        scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.opportunity.update({
      where: { id: input.opportunityId },
      data: { status: OpportunityStatus.booked, closedAt: new Date() },
    });

    await prisma.activityLog.create({
      data: {
        businessId: input.businessId,
        opportunityId: input.opportunityId,
        contactId: input.contactId,
        eventType: "booking_created",
        summary: `Booking logged from ${input.sourceType} workflow.`,
        metadata: {
          bookingId: booking.id,
          revenue: input.revenue,
        },
      },
    });

    return booking;
  },
};
