import { PrismaClient, Role, OpportunityType, OpportunityStatus, EstimateStatus, CallDirection, CallStatus, CampaignType, CampaignStatus, IntegrationStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const business = await prisma.business.create({
    data: {
      name: "Comfort Air HVAC",
      industry: "home_services",
      phone: "+15551234567",
      website: "https://comfortairhvac.example.com",
    },
  });

  const owner = await prisma.user.create({
    data: {
      email: "owner@comfortair.example.com",
      name: "Jordan Rivera",
      role: Role.OWNER,
      businessId: business.id,
    },
  });

  await prisma.user.create({
    data: {
      email: "manager@comfortair.example.com",
      name: "Casey Morgan",
      role: Role.MANAGER,
      businessId: business.id,
    },
  });

  const contacts = await Promise.all(
    [
      { firstName: "Alice", lastName: "Chen", email: "alice@example.com", phone: "+15559001001", source: "website", tags: ["residential"] },
      { firstName: "Bob", lastName: "Martinez", email: "bob@example.com", phone: "+15559001002", source: "referral", tags: ["commercial"] },
      { firstName: "Carol", lastName: "Johnson", email: "carol@example.com", phone: "+15559001003", source: "google_ads", tags: ["residential", "repeat"] },
      { firstName: "Dave", lastName: "Kim", email: "dave@example.com", phone: "+15559001004", source: "yelp", tags: ["residential"] },
      { firstName: "Eve", lastName: "Patel", email: "eve@example.com", phone: "+15559001005", source: "website", tags: ["commercial", "priority"] },
    ].map((c) =>
      prisma.contact.create({
        data: { ...c, businessId: business.id },
      })
    )
  );

  await Promise.all([
    prisma.opportunity.create({
      data: {
        type: OpportunityType.UNSOLD_ESTIMATE,
        status: OpportunityStatus.OPEN,
        value: 4200,
        description: "AC replacement estimate sent 3 weeks ago — no response",
        contactId: contacts[0].id,
        businessId: business.id,
      },
    }),
    prisma.opportunity.create({
      data: {
        type: OpportunityType.MISSED_CALL,
        status: OpportunityStatus.IN_PROGRESS,
        value: 350,
        description: "Missed call during lunch — callback scheduled",
        contactId: contacts[1].id,
        businessId: business.id,
      },
    }),
    prisma.opportunity.create({
      data: {
        type: OpportunityType.LAPSED_CUSTOMER,
        status: OpportunityStatus.OPEN,
        value: 1800,
        description: "Last service visit 14 months ago — due for maintenance",
        contactId: contacts[2].id,
        businessId: business.id,
      },
    }),
    prisma.opportunity.create({
      data: {
        type: OpportunityType.UNSOLD_ESTIMATE,
        status: OpportunityStatus.WON,
        value: 6500,
        description: "Furnace install — approved after follow-up",
        contactId: contacts[3].id,
        businessId: business.id,
        resolvedAt: new Date(),
      },
    }),
  ]);

  await Promise.all([
    prisma.estimate.create({
      data: {
        number: "EST-1001",
        amount: 4200,
        status: EstimateStatus.PENDING,
        issuedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        contactId: contacts[0].id,
        businessId: business.id,
      },
    }),
    prisma.estimate.create({
      data: {
        number: "EST-1002",
        amount: 6500,
        status: EstimateStatus.APPROVED,
        issuedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        contactId: contacts[3].id,
        businessId: business.id,
      },
    }),
    prisma.estimate.create({
      data: {
        number: "EST-1003",
        amount: 980,
        status: EstimateStatus.EXPIRED,
        issuedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        contactId: contacts[4].id,
        businessId: business.id,
      },
    }),
  ]);

  await Promise.all([
    prisma.call.create({
      data: {
        direction: CallDirection.INBOUND,
        status: CallStatus.MISSED,
        from: "+15559001002",
        to: "+15551234567",
        contactId: contacts[1].id,
        businessId: business.id,
      },
    }),
    prisma.call.create({
      data: {
        direction: CallDirection.OUTBOUND,
        status: CallStatus.COMPLETED,
        from: "+15551234567",
        to: "+15559001001",
        duration: 245,
        contactId: contacts[0].id,
        businessId: business.id,
      },
    }),
  ]);

  const campaign = await prisma.campaign.create({
    data: {
      name: "Unsold Estimate — 3-Touch Follow-Up",
      type: CampaignType.ESTIMATE_FOLLOWUP,
      status: CampaignStatus.ACTIVE,
      businessId: business.id,
    },
  });

  await Promise.all([
    prisma.campaignStep.create({
      data: { campaignId: campaign.id, order: 1, channel: "sms", delayDays: 0 },
    }),
    prisma.campaignStep.create({
      data: { campaignId: campaign.id, order: 2, channel: "email", delayDays: 3 },
    }),
    prisma.campaignStep.create({
      data: { campaignId: campaign.id, order: 3, channel: "sms", delayDays: 7 },
    }),
  ]);

  await Promise.all([
    prisma.template.create({
      data: {
        name: "Estimate Follow-Up SMS",
        channel: "sms",
        body: "Hi {{firstName}}, just checking in on your {{service}} estimate (#{{estimateNumber}}). Have any questions? Reply here or call us at {{businessPhone}}.",
        variables: ["firstName", "service", "estimateNumber", "businessPhone"],
        businessId: business.id,
      },
    }),
    prisma.template.create({
      data: {
        name: "Reactivation Email",
        channel: "email",
        subject: "We miss you, {{firstName}}!",
        body: "Hi {{firstName}},\n\nIt's been a while since your last visit. We'd love to help keep your {{equipmentType}} running smoothly.\n\nSchedule your maintenance today and get {{discountPercent}}% off.\n\nBest,\n{{businessName}}",
        variables: ["firstName", "equipmentType", "discountPercent", "businessName"],
        businessId: business.id,
      },
    }),
  ]);

  await prisma.integration.createMany({
    data: [
      { provider: "twilio", status: IntegrationStatus.CONNECTED, businessId: business.id, config: {} },
      { provider: "servicetitan", status: IntegrationStatus.DISCONNECTED, businessId: business.id },
      { provider: "quickbooks", status: IntegrationStatus.DISCONNECTED, businessId: business.id },
    ],
  });

  console.log("Seed complete ✓");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
