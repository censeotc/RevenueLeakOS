import {
  ActivityType,
  BookingSource,
  CampaignStatus,
  CallDisposition,
  EstimateStatus,
  IntegrationProvider,
  IntegrationStatus,
  OpportunityStatus,
  OpportunityType,
  Prisma,
  UserRole,
} from "@prisma/client";
import { addMonths, subMonths } from "date-fns";
import { prisma } from "@/lib/prisma";
import { DEFAULTS } from "@/lib/constants";
import { normalizePhone, twilioService } from "@/lib/services/twilioService";
import { ReactivationSegmentKey } from "@/lib/types";

const money = (value: Prisma.Decimal | number | string) =>
  new Prisma.Decimal(value).toDecimalPlaces(2);

export async function getDemoBusiness() {
  return prisma.business.findFirst({
    where: { name: { equals: "North Shore Heating & Plumbing" } },
  });
}

export async function getDashboardData(businessId: string) {
  const [opportunities, bookings, estimates, callEvents, alerts, activity] =
    await prisma.$transaction([
      prisma.opportunity.findMany({
        where: { businessId },
        include: { contact: true, assignedUser: true },
        orderBy: { lastActivityAt: "desc" },
      }),
      prisma.booking.findMany({ where: { businessId } }),
      prisma.estimate.findMany({ where: { businessId } }),
      prisma.callEvent.findMany({ where: { businessId } }),
      prisma.activityLog.findMany({
        where: { businessId, isAlert: true },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      prisma.activityLog.findMany({
        where: { businessId },
        orderBy: { createdAt: "desc" },
        take: 12,
      }),
    ]);

  const recoveredRevenue = opportunities.reduce(
    (acc, item) => acc + Number(item.recoveredValue),
    0,
  );
  const influencedRevenue = opportunities.reduce(
    (acc, item) => acc + Number(item.influencedValue),
    0,
  );
  const oppsRecovered = opportunities.filter((o) => o.status === "booked").length;
  const estimatesReopened = estimates.filter(
    (e) => e.status === "responded" || e.status === "booked",
  ).length;
  const customersReactivated = opportunities.filter(
    (o) => o.type === "reactivation" && o.status === "booked",
  ).length;

  const respondedCalls = callEvents.filter((c) => c.respondedAt).length;
  const avgResponseMin =
    respondedCalls === 0
      ? 0
      : Math.round(
          callEvents
            .filter((c) => c.respondedAt)
            .reduce((sum, c) => {
              const diff =
                (new Date(c.respondedAt!).getTime() - new Date(c.occurredAt).getTime()) /
                (1000 * 60);
              return sum + Math.max(diff, 0);
            }, 0) / respondedCalls,
        );

  return {
    kpis: {
      revenueInfluenced: influencedRevenue,
      opportunitiesRecovered: oppsRecovered,
      bookingsCreated: bookings.length,
      avgResponseTime: avgResponseMin,
      estimatesReopened,
      customersReactivated,
      recoveredRevenue,
    },
    alerts,
    recentActivity: activity,
    quickActions: [
      "Simulate missed call",
      "Enroll stale estimates",
      "Launch reactivation campaign",
    ],
  };
}

export async function getOpportunityList(
  businessId: string,
  type: "all" | OpportunityType = "all",
) {
  return prisma.opportunity.findMany({
    where: {
      businessId,
      ...(type === "all" ? {} : { type }),
    },
    include: {
      contact: true,
      assignedUser: true,
      notes: { take: 3, orderBy: { createdAt: "desc" } },
    },
    orderBy: { lastActivityAt: "desc" },
  });
}

export async function getOpportunityById(opportunityId: string) {
  return prisma.opportunity.findUnique({
    where: { id: opportunityId },
    include: {
      contact: true,
      assignedUser: true,
      notes: { include: { user: true }, orderBy: { createdAt: "desc" } },
      callEvents: { orderBy: { occurredAt: "desc" } },
      messageEvents: { orderBy: { createdAt: "desc" }, take: 10 },
      bookings: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function getCallEvents(
  businessId: string,
  disposition: "all" | CallDisposition = "all",
) {
  return prisma.callEvent.findMany({
    where: {
      businessId,
      ...(disposition === "all" ? {} : { disposition }),
    },
    include: {
      contact: true,
      opportunity: {
        include: {
          messageEvents: {
            orderBy: { createdAt: "desc" },
            take: 2,
          },
        },
      },
      booking: true,
    },
    orderBy: { occurredAt: "desc" },
  });
}

export async function getEstimates(
  businessId: string,
  status: "all" | EstimateStatus = "all",
) {
  return prisma.estimate.findMany({
    where: {
      businessId,
      ...(status === "all" ? {} : { status }),
    },
    include: {
      contact: true,
      opportunity: true,
      booking: true,
    },
    orderBy: { staleAt: "desc" },
  });
}

export async function getReactivationSegments(businessId: string) {
  const now = new Date();
  const twelveMonthsAgo = subMonths(now, 12);
  const replacementCutoff = subMonths(now, 120);

  const [noService, maintenanceDue, renewalDue, replacement] = await prisma.$transaction([
    prisma.contact.findMany({
      where: { businessId, OR: [{ lastServiceDate: null }, { lastServiceDate: { lt: twelveMonthsAgo } }] },
      take: 20,
      orderBy: { lastServiceDate: "asc" },
    }),
    prisma.contact.findMany({
      where: { businessId, nextServiceDue: { lte: now } },
      take: 20,
      orderBy: { nextServiceDue: "asc" },
    }),
    prisma.contact.findMany({
      where: { businessId, membershipRenewalDate: { lte: addMonths(now, 1) } },
      take: 20,
      orderBy: { membershipRenewalDate: "asc" },
    }),
    prisma.contact.findMany({
      where: { businessId, systemInstallDate: { lte: replacementCutoff } },
      take: 20,
      orderBy: { systemInstallDate: "asc" },
    }),
  ]);

  const build = (label: string, key: ReactivationSegmentKey, contacts: typeof noService) => ({
    label,
    key,
    contacts,
    count: contacts.length,
    estimatedValue: contacts.length * 1800,
  });

  return {
    no_service_12_months: build("No service in 12+ months", "no_service_12_months", noService),
    maintenance_due: build("Maintenance due", "maintenance_due", maintenanceDue),
    membership_renewal: build("Membership renewal", "membership_renewal", renewalDue),
    replacement_cycle: build("Replacement cycle candidates", "replacement_cycle", replacement),
  };
}

export async function getReportsData(businessId: string) {
  const [opportunities, bookings, callEvents] = await prisma.$transaction([
    prisma.opportunity.findMany({ where: { businessId } }),
    prisma.booking.findMany({ where: { businessId } }),
    prisma.callEvent.findMany({ where: { businessId } }),
  ]);

  const byWorkflow = {
    missed_call: opportunities.filter((o) => o.type === "missed_call"),
    estimate_rescue: opportunities.filter((o) => o.type === "estimate_rescue"),
    reactivation: opportunities.filter((o) => o.type === "reactivation"),
  };

  return {
    recoveredRevenue: opportunities.reduce((sum, o) => sum + Number(o.recoveredValue), 0),
    influencedRevenue: opportunities.reduce((sum, o) => sum + Number(o.influencedValue), 0),
    workflowComparison: Object.entries(byWorkflow).map(([workflow, list]) => ({
      workflow,
      opportunities: list.length,
      recovered: list.reduce((sum, o) => sum + Number(o.recoveredValue), 0),
      influenced: list.reduce((sum, o) => sum + Number(o.influencedValue), 0),
    })),
    conversionSummary: {
      totalOpportunities: opportunities.length,
      booked: opportunities.filter((o) => o.status === "booked").length,
      responded: opportunities.filter((o) => o.status === "responded").length,
      lost: opportunities.filter((o) => o.status === "lost").length,
    },
    responseTimeSummary: {
      respondedCalls: callEvents.filter((c) => c.respondedAt).length,
      totalCalls: callEvents.length,
    },
    bookingsCreated: bookings.length,
  };
}

export async function getContacts(businessId: string) {
  return prisma.contact.findMany({
    where: { businessId },
    include: {
      opportunities: {
        select: { id: true, type: true, status: true, title: true },
        orderBy: { updatedAt: "desc" },
        take: 4,
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCampaigns(businessId: string) {
  return prisma.campaign.findMany({
    where: { businessId },
    include: {
      steps: { include: { template: true }, orderBy: { stepOrder: "asc" } },
      opportunities: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTemplates(businessId: string) {
  return prisma.template.findMany({
    where: { businessId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getIntegrations(businessId: string) {
  const existing = await prisma.integrationConnection.findMany({
    where: { businessId },
  });
  const existingMap = new Map(existing.map((item) => [item.provider, item]));

  return Object.values(IntegrationProvider).map((provider) => {
    const found = existingMap.get(provider);
    return (
      found ?? {
        id: `virtual-${provider}`,
        businessId,
        provider,
        status: "disconnected" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        externalAccountId: null,
        connectedAt: null,
        lastTestedAt: null,
        lastError: null,
        config: null,
      }
    );
  });
}

export async function getSettingsData(businessId: string) {
  const [business, users] = await prisma.$transaction([
    prisma.business.findUniqueOrThrow({ where: { id: businessId } }),
    prisma.user.findMany({
      where: { businessId },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return { business, users };
}

export async function getUsersByBusiness(businessId: string) {
  return prisma.user.findMany({
    where: { businessId, isActive: true },
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });
}

export async function assignOpportunityOwner(opportunityId: string, userId: string | null) {
  const opportunity = await prisma.opportunity.update({
    where: { id: opportunityId },
    data: {
      assignedUserId: userId,
      lastActivityAt: new Date(),
    },
  });

  await prisma.activityLog.create({
    data: {
      businessId: opportunity.businessId,
      opportunityId: opportunity.id,
      userId: userId ?? undefined,
      action: ActivityType.opportunity_updated,
      message: "Opportunity owner assignment updated.",
    },
  });

  return opportunity;
}

export async function addOpportunityNote(
  opportunityId: string,
  userId: string | undefined,
  content: string,
) {
  const opportunity = await prisma.opportunity.findUniqueOrThrow({
    where: { id: opportunityId },
    select: { id: true, businessId: true },
  });

  const note = await prisma.opportunityNote.create({
    data: {
      opportunityId,
      userId,
      content,
    },
  });

  await prisma.activityLog.create({
    data: {
      businessId: opportunity.businessId,
      opportunityId,
      userId,
      action: ActivityType.note_added,
      message: "Opportunity note added.",
    },
  });

  return note;
}

function missedCallTemplate(firstName: string, businessName: string) {
  return `Hi ${firstName}, this is ${businessName}. We noticed we missed your call—would you like to book service?`;
}

function mapOpportunityTypeToBookingSource(type: OpportunityType): BookingSource {
  if (type === "missed_call") return "missed_call";
  if (type === "estimate_rescue") return "estimate_rescue";
  return "reactivation";
}

export async function simulateMissedCallWorkflow(args: {
  businessId: string;
  toNumber: string;
  fromNumber: string;
  contactName?: string;
}) {
  const business = await prisma.business.findUniqueOrThrow({
    where: { id: args.businessId },
    select: { id: true, name: true, duplicateMissedCallSuppressionHours: true },
  });

  const normalized = normalizePhone(args.fromNumber);
  const [firstName = "Caller", ...rest] = (args.contactName ?? "Caller").trim().split(" ");
  const lastName = rest.join(" ") || "Unknown";

  const contact =
    (await prisma.contact.findFirst({
      where: { businessId: business.id, phone: normalized },
    })) ??
    (await prisma.contact.create({
      data: {
        businessId: business.id,
        firstName,
        lastName,
        phone: normalized,
        tags: ["new_lead"],
      },
    }));

  const suppressionWindow = new Date(
    Date.now() - business.duplicateMissedCallSuppressionHours * 60 * 60 * 1000,
  );
  const existingOpp = await prisma.opportunity.findFirst({
    where: {
      businessId: business.id,
      contactId: contact.id,
      type: "missed_call",
      createdAt: { gte: suppressionWindow },
      status: { in: ["open", "contacted", "responded"] },
    },
    orderBy: { createdAt: "desc" },
  });

  const opportunity =
    existingOpp ??
    (await prisma.opportunity.create({
      data: {
        businessId: business.id,
        contactId: contact.id,
        type: "missed_call",
        status: "open",
        title: `Missed inbound call from ${contact.firstName} ${contact.lastName}`,
        potentialValue: money(650),
        influencedValue: money(650),
      },
    }));

  const callEvent = await prisma.callEvent.create({
    data: {
      businessId: business.id,
      contactId: contact.id,
      opportunityId: opportunity.id,
      fromNumber: normalized,
      toNumber: normalizePhone(args.toNumber),
      direction: "inbound",
      disposition: "missed",
      occurredAt: new Date(),
    },
  });

  const template = await prisma.template.findFirst({
    where: {
      businessId: business.id,
      isArchived: false,
      type: "sms",
      name: { contains: "Missed Call" },
    },
    orderBy: { updatedAt: "desc" },
  });
  const smsBody = template?.content
    ? template.content
        .replace("{{firstName}}", contact.firstName)
        .replace("{{businessName}}", business.name)
    : missedCallTemplate(contact.firstName, business.name);

  const outbound = await prisma.messageEvent.create({
    data: {
      businessId: business.id,
      contactId: contact.id,
      opportunityId: opportunity.id,
      templateId: template?.id,
      direction: "outbound",
      status: "queued",
      body: smsBody,
      sentAt: new Date(),
    },
  });

  const twilioResult = await twilioService.sendSms({
    to: normalized,
    from: normalizePhone(args.toNumber),
    body: smsBody,
  });

  await prisma.messageEvent.update({
    where: { id: outbound.id },
    data: {
      status: "sent",
      providerExternalId: twilioResult.sid,
    },
  });

  await prisma.activityLog.createMany({
    data: [
      {
        businessId: business.id,
        contactId: contact.id,
        opportunityId: opportunity.id,
        action: ActivityType.call_missed,
        message: "Missed inbound call captured.",
      },
      {
        businessId: business.id,
        contactId: contact.id,
        opportunityId: opportunity.id,
        action: ActivityType.message_sent,
        message: "Automated missed-call SMS sent.",
      },
    ],
  });

  return { contact, opportunity, callEvent, messageId: outbound.id };
}

export async function simulateReply(opportunityId: string, body: string) {
  const opportunity = await prisma.opportunity.findUniqueOrThrow({
    where: { id: opportunityId },
    include: { contact: true },
  });

  const message = await prisma.messageEvent.create({
    data: {
      businessId: opportunity.businessId,
      contactId: opportunity.contactId,
      opportunityId: opportunity.id,
      direction: "inbound",
      status: "received",
      body,
      receivedAt: new Date(),
    },
  });

  await prisma.opportunity.update({
    where: { id: opportunity.id },
    data: {
      status: "responded",
      lastActivityAt: new Date(),
    },
  });

  await prisma.callEvent.updateMany({
    where: { opportunityId: opportunity.id, disposition: { in: ["missed", "abandoned"] } },
    data: {
      disposition: "responded",
      respondedAt: new Date(),
    },
  });

  await prisma.activityLog.create({
    data: {
      businessId: opportunity.businessId,
      contactId: opportunity.contactId,
      opportunityId: opportunity.id,
      action: ActivityType.message_received,
      message: "Customer SMS reply received.",
    },
  });

  return message;
}

export async function logBooking(opportunityId: string, revenue: number) {
  const opportunity = await prisma.opportunity.findUniqueOrThrow({
    where: { id: opportunityId },
    include: {
      callEvents: {
        orderBy: { occurredAt: "desc" },
        take: 1,
      },
      estimate: true,
      campaign: true,
    },
  });

  const booking = await prisma.booking.create({
    data: {
      businessId: opportunity.businessId,
      contactId: opportunity.contactId,
      opportunityId: opportunity.id,
      callEventId: opportunity.callEvents[0]?.id,
      estimateId: opportunity.estimate?.id,
      campaignId: opportunity.campaignId ?? undefined,
      source: mapOpportunityTypeToBookingSource(opportunity.type),
      revenue: money(revenue),
      scheduledAt: new Date(),
    },
  });

  await prisma.opportunity.update({
    where: { id: opportunity.id },
    data: {
      status: "booked",
      recoveredValue: money(Number(opportunity.recoveredValue) + revenue),
      influencedValue: money(Number(opportunity.influencedValue) + revenue),
      lastActivityAt: new Date(),
      closedAt: new Date(),
    },
  });

  await prisma.callEvent.updateMany({
    where: { opportunityId: opportunity.id },
    data: {
      disposition: "booked",
      respondedAt: new Date(),
    },
  });

  if (opportunity.estimate) {
    await prisma.estimate.update({
      where: { id: opportunity.estimate.id },
      data: {
        status: "booked",
        bookedAt: new Date(),
      },
    });
  }

  await prisma.activityLog.create({
    data: {
      businessId: opportunity.businessId,
      contactId: opportunity.contactId,
      opportunityId: opportunity.id,
      campaignId: opportunity.campaignId ?? undefined,
      action: ActivityType.booking_created,
      message: "Booking logged from opportunity.",
      details: {
        revenue,
        source: opportunity.type,
      },
    },
  });

  return booking;
}

export async function syncStaleEstimateOpportunities(businessId: string) {
  const business = await prisma.business.findUniqueOrThrow({
    where: { id: businessId },
    select: { staleEstimateDays: true },
  });
  const cutoff = new Date(Date.now() - business.staleEstimateDays * 24 * 60 * 60 * 1000);

  const staleEstimates = await prisma.estimate.findMany({
    where: {
      businessId,
      status: { in: ["sent", "stale"] },
      sentAt: { lte: cutoff },
    },
  });

  for (const estimate of staleEstimates) {
    const opp =
      estimate.opportunityId
        ? await prisma.opportunity.findUnique({ where: { id: estimate.opportunityId } })
        : null;

    const opportunity =
      opp ??
      (await prisma.opportunity.create({
        data: {
          businessId,
          contactId: estimate.contactId,
          type: "estimate_rescue",
          status: "open",
          title: `Rescue estimate ${estimate.estimateNo}`,
          sourceRef: estimate.id,
          potentialValue: estimate.amount,
          influencedValue: estimate.amount,
        },
      }));

    await prisma.estimate.update({
      where: { id: estimate.id },
      data: {
        status: "stale",
        opportunityId: opportunity.id,
      },
    });
  }

  return staleEstimates.length;
}

export async function enrollEstimateInFollowup(estimateId: string) {
  const estimate = await prisma.estimate.findUniqueOrThrow({
    where: { id: estimateId },
  });

  const opportunity =
    estimate.opportunityId
      ? await prisma.opportunity.findUnique({ where: { id: estimate.opportunityId } })
      : await prisma.opportunity.create({
          data: {
            businessId: estimate.businessId,
            contactId: estimate.contactId,
            type: "estimate_rescue",
            status: "contacted",
            title: `Rescue estimate ${estimate.estimateNo}`,
            sourceRef: estimate.id,
            potentialValue: estimate.amount,
            influencedValue: estimate.amount,
          },
        });

  await prisma.estimate.update({
    where: { id: estimate.id },
    data: {
      status: "enrolled_followup",
      enrolledAt: new Date(),
      opportunityId: opportunity?.id,
    },
  });

  if (opportunity) {
    await prisma.opportunity.update({
      where: { id: opportunity.id },
      data: {
        status: "contacted",
        lastActivityAt: new Date(),
      },
    });
  }

  await prisma.activityLog.create({
    data: {
      businessId: estimate.businessId,
      contactId: estimate.contactId,
      opportunityId: opportunity?.id,
      action: ActivityType.estimate_enrolled,
      message: "Estimate enrolled in follow-up workflow.",
    },
  });
}

export async function setEstimateOutcome(args: {
  estimateId: string;
  status: "responded" | "booked" | "lost";
  revenue?: number;
}) {
  const estimate = await prisma.estimate.findUniqueOrThrow({
    where: { id: args.estimateId },
    include: { opportunity: true },
  });

  const now = new Date();
  const statusUpdate: Prisma.EstimateUpdateInput = {
    status: args.status,
    respondedAt: args.status === "responded" ? now : undefined,
    bookedAt: args.status === "booked" ? now : undefined,
    lostAt: args.status === "lost" ? now : undefined,
  };

  await prisma.estimate.update({
    where: { id: estimate.id },
    data: statusUpdate,
  });

  if (estimate.opportunity) {
    await prisma.opportunity.update({
      where: { id: estimate.opportunity.id },
      data: {
        status:
          args.status === "responded"
            ? OpportunityStatus.responded
            : args.status === "booked"
              ? OpportunityStatus.booked
              : OpportunityStatus.lost,
        recoveredValue:
          args.status === "booked"
            ? money(Number(estimate.opportunity.recoveredValue) + (args.revenue ?? Number(estimate.amount)))
            : estimate.opportunity.recoveredValue,
        influencedValue:
          args.status === "booked"
            ? money(Number(estimate.opportunity.influencedValue) + (args.revenue ?? Number(estimate.amount)))
            : estimate.opportunity.influencedValue,
        closedAt: args.status === "booked" || args.status === "lost" ? now : null,
        lastActivityAt: now,
      },
    });
  }

  if (args.status === "booked" && estimate.opportunity) {
    await prisma.booking.create({
      data: {
        businessId: estimate.businessId,
        contactId: estimate.contactId,
        opportunityId: estimate.opportunity.id,
        estimateId: estimate.id,
        source: "estimate_rescue",
        revenue: money(args.revenue ?? Number(estimate.amount)),
        scheduledAt: now,
      },
    });
  }
}

async function getReactivationContacts(
  businessId: string,
  segment: ReactivationSegmentKey,
) {
  const now = new Date();
  if (segment === "no_service_12_months") {
    return prisma.contact.findMany({
      where: {
        businessId,
        OR: [{ lastServiceDate: null }, { lastServiceDate: { lt: subMonths(now, 12) } }],
      },
      take: 25,
      orderBy: { createdAt: "asc" },
    });
  }
  if (segment === "maintenance_due") {
    return prisma.contact.findMany({
      where: { businessId, nextServiceDue: { lte: now } },
      take: 25,
      orderBy: { nextServiceDue: "asc" },
    });
  }
  if (segment === "membership_renewal") {
    return prisma.contact.findMany({
      where: { businessId, membershipRenewalDate: { lte: addMonths(now, 1) } },
      take: 25,
      orderBy: { membershipRenewalDate: "asc" },
    });
  }
  return prisma.contact.findMany({
    where: { businessId, systemInstallDate: { lte: subMonths(now, 120) } },
    take: 25,
    orderBy: { systemInstallDate: "asc" },
  });
}

const segmentLabels: Record<ReactivationSegmentKey, string> = {
  no_service_12_months: "No service in 12+ months",
  maintenance_due: "Maintenance due",
  membership_renewal: "Membership renewal",
  replacement_cycle: "Replacement cycle candidates",
};

export async function launchReactivationCampaign(args: {
  businessId: string;
  userId?: string;
  segment: ReactivationSegmentKey;
}) {
  const [contacts, business] = await Promise.all([
    getReactivationContacts(args.businessId, args.segment),
    prisma.business.findUniqueOrThrow({
      where: { id: args.businessId },
      select: { name: true },
    }),
  ]);
  if (contacts.length === 0) {
    return { campaignId: null, created: 0 };
  }

  const campaign = await prisma.campaign.create({
    data: {
      businessId: args.businessId,
      createdByUserId: args.userId,
      name: `Reactivation: ${segmentLabels[args.segment]}`,
      segment: args.segment,
      status: "active",
      launchCount: 1,
      launchedAt: new Date(),
      steps: {
        create: [
          {
            stepOrder: 1,
            channel: "sms",
            delayHours: 0,
            bodyOverride:
              "Hi {{firstName}}, it has been a while since your last service with {{businessName}}. Need anything this week?",
          },
          {
            stepOrder: 2,
            channel: "sms",
            delayHours: 48,
            bodyOverride:
              "Friendly follow-up from {{businessName}} — we have maintenance slots available this week.",
          },
        ],
      },
    },
  });

  for (const contact of contacts) {
    const opportunity = await prisma.opportunity.create({
      data: {
        businessId: args.businessId,
        contactId: contact.id,
        campaignId: campaign.id,
        type: "reactivation",
        status: "open",
        title: `Reactivation for ${contact.firstName} ${contact.lastName}`,
        potentialValue: money(DEFAULTS.highValueThreshold),
        influencedValue: money(DEFAULTS.highValueThreshold),
      },
    });

    const body = `Hi ${contact.firstName}, this is ${business.name}. We'd love to help with your next service.`;
    await prisma.messageEvent.create({
      data: {
        businessId: args.businessId,
        campaignId: campaign.id,
        contactId: contact.id,
        opportunityId: opportunity.id,
        direction: "outbound",
        status: "sent",
        body,
        sentAt: new Date(),
      },
    });
  }

  await prisma.activityLog.create({
    data: {
      businessId: args.businessId,
      userId: args.userId,
      campaignId: campaign.id,
      action: ActivityType.campaign_launched,
      message: `Campaign launched for ${segmentLabels[args.segment]}.`,
      details: { contacts: contacts.length },
    },
  });

  return { campaignId: campaign.id, created: contacts.length };
}

export async function createCampaign(args: {
  businessId: string;
  userId?: string;
  name: string;
  segment: string;
}) {
  return prisma.campaign.create({
    data: {
      businessId: args.businessId,
      createdByUserId: args.userId,
      name: args.name,
      segment: args.segment,
      status: "draft",
      steps: {
        create: [{ stepOrder: 1, channel: "sms", delayHours: 0 }],
      },
    },
  });
}

export async function updateCampaignStatus(campaignId: string, status: CampaignStatus | string) {
  const campaignStatus = status as CampaignStatus;
  return prisma.campaign.update({
    where: { id: campaignId },
    data: {
      status: campaignStatus,
      launchedAt: campaignStatus === "active" ? new Date() : undefined,
      completedAt: campaignStatus === "completed" ? new Date() : undefined,
    },
  });
}

export async function addCampaignStep(args: {
  campaignId: string;
  channel: "sms" | "email";
  delayHours: number;
  bodyOverride?: string;
}) {
  const maxStep = await prisma.campaignStep.findFirst({
    where: { campaignId: args.campaignId },
    orderBy: { stepOrder: "desc" },
  });
  return prisma.campaignStep.create({
    data: {
      campaignId: args.campaignId,
      stepOrder: (maxStep?.stepOrder ?? 0) + 1,
      channel: args.channel,
      delayHours: args.delayHours,
      bodyOverride: args.bodyOverride,
    },
  });
}

export async function createTemplate(args: {
  businessId: string;
  userId?: string;
  name: string;
  type: "sms" | "email";
  content: string;
  subject?: string;
}) {
  return prisma.template.create({
    data: {
      businessId: args.businessId,
      createdByUserId: args.userId,
      name: args.name,
      type: args.type,
      content: args.content,
      subject: args.subject,
      variables: ["firstName", "businessName", "serviceType", "estimateNumber"],
    },
  });
}

export async function duplicateTemplate(templateId: string) {
  const template = await prisma.template.findUniqueOrThrow({
    where: { id: templateId },
  });
  return prisma.template.create({
    data: {
      businessId: template.businessId,
      createdByUserId: template.createdByUserId ?? undefined,
      name: `${template.name} (Copy)`,
      type: template.type,
      subject: template.subject,
      content: template.content,
      variables: template.variables,
    },
  });
}

export async function archiveTemplate(templateId: string) {
  return prisma.template.update({
    where: { id: templateId },
    data: { isArchived: true },
  });
}

export async function setIntegrationStatus(args: {
  businessId: string;
  provider: IntegrationProvider;
  status: IntegrationStatus;
}) {
  return prisma.integrationConnection.upsert({
    where: {
      businessId_provider: {
        businessId: args.businessId,
        provider: args.provider,
      },
    },
    create: {
      businessId: args.businessId,
      provider: args.provider,
      status: args.status,
      connectedAt: args.status === "connected" ? new Date() : null,
      lastTestedAt: new Date(),
    },
    update: {
      status: args.status,
      connectedAt: args.status === "connected" ? new Date() : null,
      lastTestedAt: new Date(),
      lastError:
        args.status === "error"
          ? "Mock test failed. Check provider credentials."
          : null,
    },
  });
}

export async function updateBusinessSettings(args: {
  businessId: string;
  timezone: string;
  staleEstimateDays: number;
  attributionWindowDays: number;
  highValueThreshold: number;
  duplicateMissedCallSuppressionHours: number;
}) {
  return prisma.business.update({
    where: { id: args.businessId },
    data: {
      timezone: args.timezone,
      staleEstimateDays: args.staleEstimateDays,
      attributionWindowDays: args.attributionWindowDays,
      highValueThreshold: args.highValueThreshold,
      duplicateMissedCallSuppressionHours: args.duplicateMissedCallSuppressionHours,
    },
  });
}

export async function createUser(args: {
  businessId: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string;
}) {
  return prisma.user.create({
    data: args,
  });
}
