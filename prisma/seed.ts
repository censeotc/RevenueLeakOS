import {
  AttributionMethod,
  BookingSourceType,
  CampaignStatus,
  CampaignType,
  ChannelType,
  ContactStatus,
  ContactType,
  EstimateStatus,
  Industry,
  IntegrationProvider,
  IntegrationStatus,
  MessageDirection,
  MessageStatus,
  OpportunityStatus,
  OpportunityType,
  PrismaClient,
  UserRole,
} from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000);

const names = [
  ["Mia", "Rodriguez"],
  ["Ethan", "Foster"],
  ["Ava", "Nguyen"],
  ["Noah", "Peterson"],
  ["Liam", "Carter"],
  ["Charlotte", "Bennett"],
  ["Amelia", "Brooks"],
  ["Elijah", "Reed"],
  ["Olivia", "Fisher"],
  ["Mason", "Watts"],
  ["Sophia", "Turner"],
  ["Lucas", "Mitchell"],
  ["Isabella", "Murphy"],
  ["Benjamin", "Dixon"],
  ["Evelyn", "Hayes"],
  ["Henry", "Sullivan"],
  ["Harper", "Griffin"],
  ["Logan", "Morris"],
  ["Aria", "Wells"],
  ["James", "Price"],
  ["Ella", "Ward"],
  ["Jack", "Stewart"],
  ["Scarlett", "Kelley"],
  ["Sebastian", "Palmer"],
];

async function main() {
  await prisma.$transaction([
    prisma.opportunityNote.deleteMany(),
    prisma.callEvent.deleteMany(),
    prisma.messageEvent.deleteMany(),
    prisma.booking.deleteMany(),
    prisma.activityLog.deleteMany(),
    prisma.campaignStep.deleteMany(),
    prisma.campaign.deleteMany(),
    prisma.template.deleteMany(),
    prisma.reportSnapshot.deleteMany(),
    prisma.integrationConnection.deleteMany(),
    prisma.opportunity.deleteMany(),
    prisma.estimate.deleteMany(),
    prisma.contact.deleteMany(),
    prisma.location.deleteMany(),
    prisma.user.deleteMany(),
    prisma.business.deleteMany(),
  ]);

  const business = await prisma.business.create({
    data: {
      name: "North Shore Heating & Plumbing",
      industry: Industry.multi_trade,
      timezone: "America/Detroit",
      staleEstimateDays: 7,
      attributionWindowDays: 14,
      highValueThreshold: 2500,
      missedCallSuppressionHours: 4,
    },
  });

  const sharedPassword = await hash("Demo@12345", 10);

  const owner = await prisma.user.create({
    data: {
      businessId: business.id,
      email: "owner@northshore.demo",
      name: "Casey Morgan",
      passwordHash: sharedPassword,
      role: UserRole.owner,
    },
  });

  const manager = await prisma.user.create({
    data: {
      businessId: business.id,
      email: "manager@northshore.demo",
      name: "Jordan Patel",
      passwordHash: sharedPassword,
      role: UserRole.manager,
    },
  });

  const csr = await prisma.user.create({
    data: {
      businessId: business.id,
      email: "csr@northshore.demo",
      name: "Taylor Shaw",
      passwordHash: sharedPassword,
      role: UserRole.csr,
    },
  });

  const locations = await Promise.all([
    prisma.location.create({
      data: {
        businessId: business.id,
        name: "Main Office",
        address1: "1042 Harbor Ave",
        city: "Grosse Pointe",
        state: "MI",
        postalCode: "48230",
        phone: "(313) 555-0198",
      },
    }),
    prisma.location.create({
      data: {
        businessId: business.id,
        name: "Service Dispatch",
        address1: "760 Lakeshore Dr",
        city: "St. Clair Shores",
        state: "MI",
        postalCode: "48081",
        phone: "(313) 555-0101",
      },
    }),
  ]);

  const contacts = await Promise.all(
    names.map(([firstName, lastName], index) => {
      const fullName = `${firstName} ${lastName}`;
      const isDormant = index % 6 === 0;
      const type =
        index % 5 === 0
          ? ContactType.former_customer
          : index % 2 === 0
            ? ContactType.customer
            : ContactType.lead;

      return prisma.contact.create({
        data: {
          businessId: business.id,
          locationId: locations[index % 2]?.id,
          firstName,
          lastName,
          fullName,
          phone: `+13135550${String(index + 100).padStart(3, "0")}`,
          email: `${firstName}.${lastName}@example.com`.toLowerCase(),
          type,
          status: isDormant ? ContactStatus.dormant : ContactStatus.active,
          tags: isDormant ? ["dormant", "maintenance"] : ["residential"],
          lastServiceAt: daysAgo(15 + index * 14),
          lifetimeValue: 450 + index * 260,
        },
      });
    }),
  );

  const templates = await Promise.all([
    prisma.template.create({
      data: {
        businessId: business.id,
        createdById: manager.id,
        name: "Missed Call First Touch",
        description: "Immediate missed call callback text",
        type: CampaignType.missed_call_followup,
        channel: ChannelType.sms,
        body: "Hi {{firstName}} — sorry we missed your call. Need HVAC/plumbing help today? Reply YES and we can book you in minutes.",
      },
    }),
    prisma.template.create({
      data: {
        businessId: business.id,
        createdById: manager.id,
        name: "Estimate Rescue Day 7",
        description: "Stale estimate nudge",
        type: CampaignType.estimate_rescue,
        channel: ChannelType.sms,
        body: "Hi {{firstName}}, checking in on estimate #{{estimateId}} for {{serviceType}}. We have openings this week if you want to move forward.",
      },
    }),
    prisma.template.create({
      data: {
        businessId: business.id,
        createdById: owner.id,
        name: "Seasonal Reactivation Offer",
        description: "Inactive customer winback",
        type: CampaignType.reactivation,
        channel: ChannelType.email,
        subject: "Ready for spring tune-up savings?",
        body: "Hi {{firstName}}, it has been a while since your last service. Book this month and receive priority scheduling + waived dispatch fee.",
      },
    }),
    prisma.template.create({
      data: {
        businessId: business.id,
        createdById: owner.id,
        name: "Membership Renewal Reminder",
        description: "Maintenance membership renewal",
        type: CampaignType.reactivation,
        channel: ChannelType.sms,
        body: "Your North Shore membership is up for renewal. Reply RENEW to keep same-day priority + seasonal tune-up included.",
      },
    }),
  ]);

  const opportunities = await Promise.all(
    Array.from({ length: 14 }).map((_, index) => {
      const type =
        index < 5
          ? OpportunityType.missed_call
          : index < 10
            ? OpportunityType.estimate_rescue
            : OpportunityType.reactivation;
      const statusChoices: OpportunityStatus[] = [
        OpportunityStatus.new,
        OpportunityStatus.attempted,
        OpportunityStatus.responded,
        OpportunityStatus.qualified,
        OpportunityStatus.booked,
        OpportunityStatus.lost,
      ];
      const status = statusChoices[index % statusChoices.length];
      const ownerId = index % 3 === 0 ? owner.id : index % 2 === 0 ? manager.id : csr.id;
      const contact = contacts[index];

      return prisma.opportunity.create({
        data: {
          businessId: business.id,
          contactId: contact.id,
          ownerId,
          type,
          status,
          title:
            type === OpportunityType.missed_call
              ? `Missed inbound call - ${contact.lastName} household`
              : type === OpportunityType.estimate_rescue
                ? `Rescue stale estimate for ${contact.lastName}`
                : `Reactivation outreach - ${contact.lastName}`,
          description:
            type === OpportunityType.reactivation
              ? "No service in >12 months. High probability for tune-up conversion."
              : "Prioritize same-day follow-up to recover potential revenue.",
          serviceType: ["AC repair", "Water heater", "Panel upgrade", "Boiler tune-up"][
            index % 4
          ],
          value: 900 + index * 340,
          priority: index % 4 === 0 ? 3 : 1,
          sourceRef: `${type}-${index + 1}`,
          lastContactedAt: hoursAgo(5 + index * 3),
          createdAt: daysAgo(20 - index),
        },
      });
    }),
  );

  const estimates = await Promise.all(
    Array.from({ length: 9 }).map((_, index) => {
      const status =
        index < 4
          ? EstimateStatus.stale
          : index === 4
            ? EstimateStatus.responded
            : index === 5
              ? EstimateStatus.booked
              : EstimateStatus.open;

      return prisma.estimate.create({
        data: {
          businessId: business.id,
          contactId: contacts[index + 5].id,
          amount: 1800 + index * 700,
          serviceType: ["Furnace replacement", "Tankless install", "Generator install"][
            index % 3
          ],
          status,
          sentAt: daysAgo(4 + index * 2),
          respondedAt: status === EstimateStatus.responded ? daysAgo(3) : null,
          bookedAt: status === EstimateStatus.booked ? daysAgo(2) : null,
          externalId: `EST-${2020 + index}`,
        },
      });
    }),
  );

  await Promise.all(
    opportunities
      .filter((o) => o.type === OpportunityType.estimate_rescue)
      .map((opportunity, index) =>
        prisma.opportunity.update({
          where: { id: opportunity.id },
          data: { estimateId: estimates[index]?.id ?? null },
        }),
      ),
  );

  const campaigns = await Promise.all([
    prisma.campaign.create({
      data: {
        businessId: business.id,
        createdById: manager.id,
        type: CampaignType.missed_call_followup,
        status: CampaignStatus.active,
        name: "After-hours Missed Call Recovery",
        targetSegment: "after-hours + no callback in 15m",
        startedAt: daysAgo(10),
      },
    }),
    prisma.campaign.create({
      data: {
        businessId: business.id,
        createdById: manager.id,
        type: CampaignType.estimate_rescue,
        status: CampaignStatus.active,
        name: "Stale Estimate Day-7 Rescue",
        targetSegment: "estimates older than 7 days",
        startedAt: daysAgo(8),
      },
    }),
    prisma.campaign.create({
      data: {
        businessId: business.id,
        createdById: owner.id,
        type: CampaignType.reactivation,
        status: CampaignStatus.scheduled,
        name: "Spring Reactivation Push",
        targetSegment: "no service 12+ months",
      },
    }),
  ]);

  await Promise.all([
    prisma.campaignStep.create({
      data: {
        campaignId: campaigns[0].id,
        orderIndex: 1,
        channel: ChannelType.sms,
        templateId: templates[0].id,
        delayHours: 0,
      },
    }),
    prisma.campaignStep.create({
      data: {
        campaignId: campaigns[0].id,
        orderIndex: 2,
        channel: ChannelType.sms,
        templateId: templates[0].id,
        delayHours: 18,
      },
    }),
    prisma.campaignStep.create({
      data: {
        campaignId: campaigns[1].id,
        orderIndex: 1,
        channel: ChannelType.sms,
        templateId: templates[1].id,
        delayHours: 0,
      },
    }),
    prisma.campaignStep.create({
      data: {
        campaignId: campaigns[2].id,
        orderIndex: 1,
        channel: ChannelType.email,
        templateId: templates[2].id,
        delayHours: 0,
      },
    }),
  ]);

  await Promise.all(
    Array.from({ length: 9 }).map((_, index) =>
      prisma.callEvent.create({
        data: {
          businessId: business.id,
          contactId: contacts[index].id,
          opportunityId: opportunities[index].id,
          fromNumber: contacts[index].phone,
          toNumber: "+13135550111",
          startedAt: hoursAgo(6 + index * 5),
          durationSec: index % 2 === 0 ? 0 : 112,
          isMissed: index % 2 === 0,
          isAfterHours: index % 3 === 0,
          isAbandoned: index % 4 === 0,
          outcome: index % 2 === 0 ? "missed" : "responded",
          intakeSummary:
            index % 2 === 0
              ? "Customer requested urgent same-day service."
              : "CSR captured issue and scheduled follow-up call.",
        },
      }),
    ),
  );

  await Promise.all(
    Array.from({ length: 14 }).map((_, index) => {
      const isOutbound = index % 3 !== 0;
      return prisma.messageEvent.create({
        data: {
          businessId: business.id,
          contactId: contacts[index % contacts.length].id,
          opportunityId: opportunities[index % opportunities.length].id,
          campaignId: campaigns[index % campaigns.length].id,
          templateId: templates[index % templates.length].id,
          channel: index % 4 === 0 ? ChannelType.email : ChannelType.sms,
          direction: isOutbound ? MessageDirection.outbound : MessageDirection.inbound,
          status: isOutbound ? MessageStatus.delivered : MessageStatus.replied,
          body: isOutbound
            ? "North Shore follow-up: we can reserve your preferred service window."
            : "Can you do Thursday morning?",
          sentAt: hoursAgo(2 + index),
          deliveredAt: hoursAgo(1 + index),
        },
      });
    }),
  );

  const bookings = await Promise.all(
    Array.from({ length: 6 }).map((_, index) =>
      prisma.booking.create({
        data: {
          businessId: business.id,
          contactId: contacts[index + 4].id,
          opportunityId: opportunities[index + 2].id,
          sourceType:
            index < 2
              ? BookingSourceType.missed_call
              : index < 4
                ? BookingSourceType.estimate_rescue
                : BookingSourceType.reactivation,
          attributionMethod:
            index % 2 === 0 ? AttributionMethod.direct : AttributionMethod.influenced,
          revenue: 1200 + index * 850,
          scheduledFor: daysAgo(-(index + 1)),
          serviceType: ["AC Tune-Up", "Water Heater", "Electrical Panel"][index % 3],
          createdById: index % 2 === 0 ? csr.id : manager.id,
        },
      }),
    ),
  );

  await Promise.all(
    opportunities.slice(0, 8).map((opportunity, index) =>
      prisma.opportunityNote.create({
        data: {
          opportunityId: opportunity.id,
          userId: index % 2 === 0 ? csr.id : manager.id,
          body:
            index % 2 === 0
              ? "Customer responded with preferred callback window."
              : "Left voicemail and sent template follow-up.",
        },
      }),
    ),
  );

  await Promise.all(
    Array.from({ length: 20 }).map((_, index) =>
      prisma.activityLog.create({
        data: {
          businessId: business.id,
          userId: index % 3 === 0 ? owner.id : index % 2 === 0 ? manager.id : csr.id,
          opportunityId: opportunities[index % opportunities.length].id,
          contactId: contacts[index % contacts.length].id,
          eventType:
            index % 5 === 0
              ? "alert"
              : index % 4 === 0
                ? "booking_logged"
                : "status_updated",
          summary:
            index % 5 === 0
              ? "Alert: response time exceeded 30 minutes."
              : index % 4 === 0
                ? "Booking created from recovered opportunity."
                : "Opportunity moved to attempted.",
          metadata: {
            source: "seed",
            sequence: index + 1,
          },
          createdAt: hoursAgo(index * 2),
        },
      }),
    ),
  );

  await Promise.all(
    Object.values(IntegrationProvider).map((provider, index) =>
      prisma.integrationConnection.create({
        data: {
          businessId: business.id,
          provider,
          status:
            provider === IntegrationProvider.twilio
              ? IntegrationStatus.connected
              : index % 3 === 0
                ? IntegrationStatus.pending
                : IntegrationStatus.disconnected,
          connectedAt: provider === IntegrationProvider.twilio ? daysAgo(30) : null,
          lastSyncAt: provider === IntegrationProvider.twilio ? hoursAgo(4) : null,
          lastTestAt: provider === IntegrationProvider.twilio ? hoursAgo(5) : null,
          config: provider === IntegrationProvider.twilio ? { fromNumber: "+13135550111" } : {},
        },
      }),
    ),
  );

  await Promise.all([
    prisma.reportSnapshot.create({
      data: {
        businessId: business.id,
        label: "Last 14 days",
        fromDate: daysAgo(14),
        toDate: now,
        metrics: {
          revenueInfluenced: 22800,
          revenueDirect: 14200,
          opportunitiesRecovered: 19,
          bookingsCreated: 11,
          avgResponseMinutes: 17,
          estimatesReopened: 6,
          customersReactivated: 4,
        },
      },
    }),
    prisma.reportSnapshot.create({
      data: {
        businessId: business.id,
        label: "Previous 14 days",
        fromDate: daysAgo(28),
        toDate: daysAgo(14),
        metrics: {
          revenueInfluenced: 17400,
          revenueDirect: 10800,
          opportunitiesRecovered: 14,
          bookingsCreated: 8,
          avgResponseMinutes: 24,
          estimatesReopened: 3,
          customersReactivated: 2,
        },
      },
    }),
  ]);

  console.log("Seed complete");
  console.log("Demo login users:");
  console.log("owner@northshore.demo / Demo@12345");
  console.log("manager@northshore.demo / Demo@12345");
  console.log("csr@northshore.demo / Demo@12345");
  console.log(`Created ${contacts.length} contacts, ${opportunities.length} opportunities`);
  console.log(`Created ${bookings.length} bookings`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
