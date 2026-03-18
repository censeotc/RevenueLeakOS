import { prisma } from "@/lib/prisma";
import { twilioMockService } from "./twilioMockService";
import type { CreateOpportunityInput, UpdateOpportunityInput } from "@/types";

export const opportunityService = {
  async create(input: CreateOpportunityInput) {
    return prisma.opportunity.create({
      data: {
        businessId: input.businessId,
        contactId: input.contactId,
        type: input.type as any,
        status: "new",
        title: input.title,
        description: input.description,
        serviceType: input.serviceType,
        estimatedValue: input.estimatedValue,
        source: input.source,
        assignedToId: input.assignedToId,
      },
      include: {
        contact: true,
        assignedTo: true,
      },
    });
  },

  async update(id: string, input: UpdateOpportunityInput) {
    return prisma.opportunity.update({
      where: { id },
      data: {
        status: input.status as any,
        assignedToId: input.assignedToId,
        estimatedValue: input.estimatedValue,
        actualValue: input.actualValue,
        serviceType: input.serviceType,
        description: input.description,
        resolvedAt: input.resolvedAt,
      },
    });
  },

  async addNote(opportunityId: string, authorName: string, content: string, authorId?: string) {
    return prisma.opportunityNote.create({
      data: {
        opportunityId,
        authorId: authorId ?? null,
        authorName,
        content,
      },
    });
  },

  async handleMissedCall(businessId: string, callerPhone: string, isAfterHours: boolean = false) {
    const business = await prisma.business.findUnique({ where: { id: businessId } });
    if (!business) throw new Error("Business not found");

    // Duplicate suppression: skip if same number called within suppression window
    const suppressionMinutes = business.missedCallSuppressionMin;
    const windowStart = new Date(Date.now() - suppressionMinutes * 60 * 1000);
    const recentCall = await prisma.callEvent.findFirst({
      where: {
        businessId,
        callerPhone,
        createdAt: { gte: windowStart },
      },
    });
    if (recentCall) {
      console.log(`[OpportunityService] Suppressed duplicate missed call from ${callerPhone}`);
      return null;
    }

    // Match or create contact
    let contact = await prisma.contact.findFirst({
      where: { businessId, phone: callerPhone },
    });
    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          businessId,
          firstName: "Unknown",
          lastName: "Caller",
          phone: callerPhone,
          type: "lead",
          status: "active",
        },
      });
    }

    // Create call event
    const callEvent = await prisma.callEvent.create({
      data: {
        businessId,
        contactId: contact.id,
        callerPhone,
        direction: "inbound",
        status: "missed",
        isAfterHours,
      },
    });

    // Create opportunity
    const opportunity = await prisma.opportunity.create({
      data: {
        businessId,
        contactId: contact.id,
        type: "missed_call",
        status: "new",
        title: `Missed Call — ${contact.firstName} ${contact.lastName}`,
        source: isAfterHours ? "after_hours" : "missed_call",
        estimatedValue: 0,
      },
    });

    // Link call event to opportunity
    await prisma.callEvent.update({
      where: { id: callEvent.id },
      data: { opportunityId: opportunity.id },
    });

    // Send mock SMS
    const contactName = `${contact.firstName} ${contact.lastName}`;
    const body = twilioMockService.formatMissedCallMessage(contactName, business.name);
    await twilioMockService.sendSMS({
      to: callerPhone,
      body,
      opportunityId: opportunity.id,
      businessId,
    });

    await prisma.activityLog.create({
      data: {
        businessId,
        contactId: contact.id,
        opportunityId: opportunity.id,
        action: "missed_call_workflow",
        description: `Missed call from ${formatPhone(callerPhone)}. Opportunity created and SMS sent.`,
      },
    });

    return { opportunity, callEvent, contact };
  },

  async enrollEstimateInFollowUp(estimateId: string, businessId: string) {
    const estimate = await prisma.estimate.findUnique({
      where: { id: estimateId },
      include: { opportunity: true },
    });
    if (!estimate) throw new Error("Estimate not found");

    let opportunity = estimate.opportunity;
    if (!opportunity && estimate.contactId) {
      opportunity = await prisma.opportunity.create({
        data: {
          businessId,
          contactId: estimate.contactId,
          type: "estimate_rescue",
          status: "new",
          title: `Estimate Follow-Up — ${estimate.title}`,
          estimatedValue: estimate.amount,
          serviceType: estimate.serviceType ?? undefined,
        },
      });

      await prisma.estimate.update({
        where: { id: estimateId },
        data: { opportunityId: opportunity.id, status: "stale" },
      });
    }

    return opportunity;
  },

  async getByBusiness(businessId: string, filters?: { type?: string; status?: string }) {
    return prisma.opportunity.findMany({
      where: {
        businessId,
        ...(filters?.type ? { type: filters.type as any } : {}),
        ...(filters?.status ? { status: filters.status as any } : {}),
      },
      include: {
        contact: true,
        assignedTo: { select: { id: true, name: true, email: true } },
        _count: { select: { notes: true, callEvents: true, messageEvents: true, bookings: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    return prisma.opportunity.findUnique({
      where: { id },
      include: {
        contact: true,
        assignedTo: { select: { id: true, name: true, email: true } },
        notes: { orderBy: { createdAt: "desc" } },
        callEvents: { orderBy: { createdAt: "desc" } },
        messageEvents: { orderBy: { createdAt: "desc" } },
        bookings: { orderBy: { createdAt: "desc" } },
        _count: { select: { notes: true, callEvents: true, messageEvents: true, bookings: true } },
      },
    });
  },
};

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}
