import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  CampaignStatus,
  Prisma,
  PrismaClient,
  OpportunityStatus,
  OpportunityType,
} from "@prisma/client";
import { DEMO_BUSINESS_NAME, DEFAULTS } from "../lib/constants";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for seed script.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);
const daysFromNow = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

async function reset() {
  await prisma.activityLog.deleteMany();
  await prisma.reportSnapshot.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.messageEvent.deleteMany();
  await prisma.callEvent.deleteMany();
  await prisma.estimate.deleteMany();
  await prisma.opportunityNote.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.campaignStep.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.template.deleteMany();
  await prisma.integrationConnection.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.user.deleteMany();
  await prisma.location.deleteMany();
  await prisma.business.deleteMany();
}

async function main() {
  await reset();

  const business = await prisma.business.create({
    data: {
      name: DEMO_BUSINESS_NAME,
      timezone: DEFAULTS.timezone,
      staleEstimateDays: DEFAULTS.staleEstimateDays,
      attributionWindowDays: DEFAULTS.attributionWindowDays,
      highValueThreshold: DEFAULTS.highValueThreshold,
      duplicateMissedCallSuppressionHours: DEFAULTS.duplicateMissedCallSuppressionHours,
    },
  });

  const ownerPassword = await bcrypt.hash("DemoPass123!", 10);
  const owner = await prisma.user.create({
    data: {
      businessId: business.id,
      email: "owner@northshorehvac.com",
      name: "Alex Mercer",
      role: "owner",
      passwordHash: ownerPassword,
    },
  });

  const manager = await prisma.user.create({
    data: {
      businessId: business.id,
      email: "manager@northshorehvac.com",
      name: "Jordan Blake",
      role: "manager",
      passwordHash: await bcrypt.hash("DemoPass123!", 10),
    },
  });

  const csr = await prisma.user.create({
    data: {
      businessId: business.id,
      email: "csr@northshorehvac.com",
      name: "Taylor Reed",
      role: "csr",
      passwordHash: await bcrypt.hash("DemoPass123!", 10),
    },
  });

  const location = await prisma.location.create({
    data: {
      businessId: business.id,
      name: "Main Office",
      phone: "+12485550111",
      address1: "100 Harbor Ave",
      city: "Detroit",
      state: "MI",
      postalCode: "48201",
    },
  });

  const contactNames = [
    "Mia Johnson",
    "Liam Carter",
    "Noah Bennett",
    "Emma Walker",
    "Ava Cooper",
    "Sophia Morgan",
    "Mason Hughes",
    "Isabella Price",
    "Ethan Reed",
    "Amelia Scott",
    "Lucas Perez",
    "Harper Evans",
    "Elijah Foster",
    "Charlotte Bailey",
    "James Rivera",
    "Evelyn Kelly",
    "Benjamin Powell",
    "Abigail Brooks",
    "Henry Murphy",
    "Emily Ward",
    "Jack Sanders",
    "Scarlett Cook",
    "Logan Bryant",
    "Grace Bell",
  ];

  const contacts = [];
  for (let i = 0; i < contactNames.length; i += 1) {
    const [firstName, lastName] = contactNames[i].split(" ");
    // Distribute service history for reactivation segments.
    const contact = await prisma.contact.create({
      data: {
        businessId: business.id,
        locationId: location.id,
        firstName,
        lastName,
        phone: `+1248555${(1000 + i).toString()}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        tags:
          i % 4 === 0
            ? ["maintenance", "vip"]
            : i % 3 === 0
              ? ["member"]
              : ["residential"],
        notes: i % 5 === 0 ? "Prefers text communication." : null,
        lastServiceDate: daysAgo(30 + i * 20),
        nextServiceDue: daysFromNow((i % 6) * 5 - 7),
        membershipRenewalDate: daysFromNow((i % 8) * 10 - 20),
        systemInstallDate: daysAgo(365 * (7 + (i % 8))),
      },
    });
    contacts.push(contact);
  }

  const templates = await prisma.$transaction([
    prisma.template.create({
      data: {
        businessId: business.id,
        createdByUserId: owner.id,
        name: "Missed Call - Initial Outreach",
        type: "sms",
        content:
          "Hi {{firstName}}, this is {{businessName}}. We missed your call and can help right away. Want to get booked?",
        variables: ["firstName", "businessName"],
      },
    }),
    prisma.template.create({
      data: {
        businessId: business.id,
        createdByUserId: owner.id,
        name: "Estimate Follow-up - Day 1",
        type: "sms",
        content:
          "Hi {{firstName}}, checking in on estimate {{estimateNumber}} for {{serviceType}}. Reply with any questions.",
        variables: ["firstName", "estimateNumber", "serviceType"],
      },
    }),
    prisma.template.create({
      data: {
        businessId: business.id,
        createdByUserId: manager.id,
        name: "Reactivation Offer",
        type: "sms",
        content:
          "Hi {{firstName}}, we have priority service slots this week at {{businessName}}. Want one?",
        variables: ["firstName", "businessName"],
      },
    }),
    prisma.template.create({
      data: {
        businessId: business.id,
        createdByUserId: manager.id,
        name: "Booking Confirmation",
        type: "email",
        subject: "Your service is booked",
        content:
          "Hi {{firstName}}, your booking with {{businessName}} is confirmed. We'll see you soon.",
        variables: ["firstName", "businessName"],
      },
    }),
  ]);

  const campaigns = [];
  const campaignSeeds: Array<{ name: string; segment: string; status: CampaignStatus }> = [
    {
      name: "Spring Tune-Up Reactivation",
      segment: "maintenance_due",
      status: "active",
    },
    {
      name: "Dormant Customers Winback",
      segment: "no_service_12_months",
      status: "draft",
    },
    {
      name: "Membership Renewal Push",
      segment: "membership_renewal",
      status: "paused",
    },
  ];
  for (const item of campaignSeeds) {
    const campaign = await prisma.campaign.create({
      data: {
        businessId: business.id,
        createdByUserId: owner.id,
        name: item.name,
        segment: item.segment,
        status: item.status,
        launchCount: item.status === "active" ? 1 : 0,
        launchedAt: item.status === "active" ? daysAgo(2) : null,
        steps: {
          create: [
            {
              stepOrder: 1,
              channel: "sms",
              delayHours: 0,
              templateId: templates[2].id,
            },
            {
              stepOrder: 2,
              channel: "sms",
              delayHours: 48,
              bodyOverride:
                "Just checking back in from North Shore Heating & Plumbing. Need service this month?",
            },
          ],
        },
      },
    });
    campaigns.push(campaign);
  }

  const estimates = [];
  for (let i = 0; i < 8; i += 1) {
    const estimate = await prisma.estimate.create({
      data: {
        businessId: business.id,
        locationId: location.id,
        contactId: contacts[i].id,
        estimateNo: `EST-${1200 + i}`,
        serviceType: i % 2 === 0 ? "Furnace Repair" : "Water Heater",
        amount: new Prisma.Decimal(850 + i * 220),
        status: i < 5 ? "stale" : i === 5 ? "responded" : "sent",
        sentAt: daysAgo(10 + i),
        staleAt: daysAgo(3 + i),
        respondedAt: i === 5 ? daysAgo(1) : null,
      },
    });
    estimates.push(estimate);
  }

  const opportunities = [];
  for (let i = 0; i < 5; i += 1) {
    const opp = await prisma.opportunity.create({
      data: {
        businessId: business.id,
        contactId: contacts[i].id,
        assignedUserId: i % 2 === 0 ? csr.id : manager.id,
        type: "missed_call",
        status:
          i === 0
            ? OpportunityStatus.booked
            : i === 1
              ? OpportunityStatus.responded
              : OpportunityStatus.open,
        title: `Missed call from ${contacts[i].firstName} ${contacts[i].lastName}`,
        potentialValue: new Prisma.Decimal(600 + i * 75),
        influencedValue: new Prisma.Decimal(600 + i * 75),
        recoveredValue: new Prisma.Decimal(i === 0 ? 750 : 0),
      },
    });
    opportunities.push(opp);
  }

  for (let i = 0; i < 5; i += 1) {
    const opp = await prisma.opportunity.create({
      data: {
        businessId: business.id,
        contactId: estimates[i].contactId,
        assignedUserId: manager.id,
        type: "estimate_rescue",
        status: i === 0 ? "booked" : i === 1 ? "responded" : "contacted",
        title: `Rescue ${estimates[i].estimateNo}`,
        sourceRef: estimates[i].id,
        potentialValue: estimates[i].amount,
        influencedValue: estimates[i].amount,
        recoveredValue: i === 0 ? estimates[i].amount : new Prisma.Decimal(0),
        estimate: {
          connect: { id: estimates[i].id },
        },
      },
    });
    opportunities.push(opp);
  }

  for (let i = 10; i < 14; i += 1) {
    const opp = await prisma.opportunity.create({
      data: {
        businessId: business.id,
        contactId: contacts[i].id,
        assignedUserId: owner.id,
        campaignId: campaigns[0].id,
        type: "reactivation",
        status: i % 3 === 0 ? "booked" : "open",
        title: `Reactivation for ${contacts[i].firstName} ${contacts[i].lastName}`,
        potentialValue: new Prisma.Decimal(2200),
        influencedValue: new Prisma.Decimal(2200),
        recoveredValue: i % 3 === 0 ? new Prisma.Decimal(1950) : new Prisma.Decimal(0),
      },
    });
    opportunities.push(opp);
  }

  for (let i = 0; i < 9; i += 1) {
    const contact = contacts[i];
    const opportunity = opportunities[i % opportunities.length];
    await prisma.callEvent.create({
      data: {
        businessId: business.id,
        contactId: contact.id,
        locationId: location.id,
        opportunityId: opportunity.id,
        fromNumber: contact.phone,
        toNumber: location.phone!,
        direction: "inbound",
        disposition:
          i < 3
            ? "missed"
            : i < 5
              ? "after_hours"
              : i === 5
                ? "responded"
                : i === 6
                  ? "booked"
                  : "abandoned",
        durationSec: i < 2 ? null : 120 + i * 10,
        occurredAt: daysAgo(6 - i),
        respondedAt: i >= 5 ? daysAgo(5 - i) : null,
      },
    });
  }

  const missedCallOpps = opportunities.filter((o) => o.type === OpportunityType.missed_call);
  for (const [index, opportunity] of missedCallOpps.entries()) {
    await prisma.messageEvent.createMany({
      data: [
        {
          businessId: business.id,
          contactId: opportunity.contactId,
          opportunityId: opportunity.id,
          templateId: templates[0].id,
          direction: "outbound",
          status: "sent",
          body: "Hi, we missed your call and can help today.",
          sentAt: daysAgo(2 + index),
        },
        {
          businessId: business.id,
          contactId: opportunity.contactId,
          opportunityId: opportunity.id,
          direction: "inbound",
          status: "received",
          body: index % 2 === 0 ? "Can you come tomorrow?" : "Please call me back.",
          receivedAt: daysAgo(1 + index),
        },
      ],
    });
  }

  const bookingsData = [
    { oppIdx: 0, source: "missed_call", revenue: 750 },
    { oppIdx: 5, source: "estimate_rescue", revenue: 1450 },
    { oppIdx: 6, source: "estimate_rescue", revenue: 1890 },
    { oppIdx: 9, source: "reactivation", revenue: 2100 },
    { oppIdx: 10, source: "reactivation", revenue: 2390 },
    { oppIdx: 3, source: "missed_call", revenue: 680 },
  ] as const;

  for (const [i, item] of bookingsData.entries()) {
    const opportunity = opportunities[item.oppIdx];
    await prisma.booking.create({
      data: {
        businessId: business.id,
        contactId: opportunity.contactId,
        opportunityId: opportunity.id,
        source: item.source,
        revenue: new Prisma.Decimal(item.revenue),
        scheduledAt: daysAgo(6 - i),
      },
    });
  }

  for (let i = 0; i < 16; i += 1) {
    await prisma.activityLog.create({
      data: {
        businessId: business.id,
        userId: i % 2 === 0 ? manager.id : csr.id,
        contactId: contacts[i].id,
        opportunityId: opportunities[i % opportunities.length].id,
        campaignId: i % 3 === 0 ? campaigns[0].id : null,
        action:
          i % 4 === 0
            ? "opportunity_created"
            : i % 4 === 1
              ? "message_sent"
              : i % 4 === 2
                ? "message_received"
                : "booking_created",
        message:
          i % 4 === 0
            ? "New opportunity added to pipeline."
            : i % 4 === 1
              ? "Automated outreach sent."
              : i % 4 === 2
                ? "Customer replied to outreach."
                : "Booking logged from outreach workflow.",
        createdAt: daysAgo(14 - i),
      },
    });
  }

  await prisma.activityLog.createMany({
    data: [
      {
        businessId: business.id,
        action: "settings_updated",
        message: "High value threshold reached for 3 open opportunities.",
        isAlert: true,
        alertLevel: "high",
        createdAt: daysAgo(1),
      },
      {
        businessId: business.id,
        action: "integration_updated",
        message: "Twilio health check failed on one message retry.",
        isAlert: true,
        alertLevel: "medium",
        createdAt: daysAgo(2),
      },
      {
        businessId: business.id,
        action: "estimate_enrolled",
        message: "5 stale estimates are ready for follow-up.",
        isAlert: true,
        alertLevel: "low",
        createdAt: daysAgo(3),
      },
    ],
  });

  await prisma.integrationConnection.createMany({
    data: [
      {
        businessId: business.id,
        provider: "twilio",
        status: "connected",
        externalAccountId: "acct_twilio_demo",
        connectedAt: daysAgo(15),
        lastTestedAt: daysAgo(1),
      },
      {
        businessId: business.id,
        provider: "gmail",
        status: "connected",
        externalAccountId: "gmail_demo",
        connectedAt: daysAgo(20),
        lastTestedAt: daysAgo(1),
      },
      {
        businessId: business.id,
        provider: "csv_import",
        status: "connected",
        connectedAt: daysAgo(5),
        lastTestedAt: daysAgo(1),
      },
    ],
  });

  await prisma.reportSnapshot.createMany({
    data: [
      {
        businessId: business.id,
        snapshotDate: daysAgo(7),
        recoveredRevenue: new Prisma.Decimal(5200),
        influencedRevenue: new Prisma.Decimal(7800),
        opportunitiesRecovered: 6,
        bookingsCreated: 5,
        avgResponseMinutes: 19,
        estimatesReopened: 3,
        customersReactivated: 2,
        workflowComparison: {
          missed_call: 3,
          estimate_rescue: 2,
          reactivation: 1,
        },
      },
      {
        businessId: business.id,
        snapshotDate: daysAgo(1),
        recoveredRevenue: new Prisma.Decimal(9260),
        influencedRevenue: new Prisma.Decimal(14900),
        opportunitiesRecovered: 10,
        bookingsCreated: 8,
        avgResponseMinutes: 15,
        estimatesReopened: 5,
        customersReactivated: 3,
        workflowComparison: {
          missed_call: 4,
          estimate_rescue: 3,
          reactivation: 3,
        },
      },
    ],
  });

  console.log("Seeded RevenueLeak OS demo tenant");
  console.log("Business:", DEMO_BUSINESS_NAME);
  console.log("Owner login: owner@northshorehvac.com / DemoPass123!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
