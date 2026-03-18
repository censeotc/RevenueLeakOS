import { PrismaClient, UserRole, OpportunityType, OpportunityStatus, EstimateStatus, CampaignType, CampaignStatus, CampaignStepType, TemplateType, IntegrationStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo business
  const business = await prisma.business.upsert({
    where: { slug: "demo-hvac-pros" },
    update: {},
    create: {
      name: "Demo HVAC Pros",
      slug: "demo-hvac-pros",
      phone: "+15550001234",
      email: "owner@demohvacpros.com",
      website: "https://demohvacpros.com",
      address: "123 Main St",
      city: "Austin",
      state: "TX",
      zip: "78701",
      industry: "HVAC",
      timezone: "America/Chicago",
      isDemo: true,
    },
  });

  console.log(`✅ Business created: ${business.name}`);

  // Create users
  const owner = await prisma.user.upsert({
    where: { email: "owner@demohvacpros.com" },
    update: {},
    create: {
      email: "owner@demohvacpros.com",
      name: "Mike Johnson",
      role: UserRole.OWNER,
      businessId: business.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "manager@demohvacpros.com" },
    update: {},
    create: {
      email: "manager@demohvacpros.com",
      name: "Sarah Williams",
      role: UserRole.MANAGER,
      businessId: business.id,
    },
  });

  console.log(`✅ Users created`);

  // Create business settings
  await prisma.businessSettings.upsert({
    where: { businessId: business.id },
    update: {},
    create: {
      businessId: business.id,
      attributionWindowDays: 30,
      autoEnrollEstimates: true,
      smsOptInRequired: false,
      notifyOnOpportunity: true,
      notifyOnConversion: true,
    },
  });

  // Create contacts
  const contactsData = [
    { firstName: "Robert", lastName: "Davis", phone: "+15550002001", email: "robert.davis@example.com", tags: ["hvac", "residential"], optedInSms: true },
    { firstName: "Jennifer", lastName: "Martinez", phone: "+15550002002", email: "jennifer.m@example.com", tags: ["hvac", "commercial"], optedInSms: true },
    { firstName: "William", lastName: "Brown", phone: "+15550002003", email: "wbrown@example.com", tags: ["residential", "vip"], optedInSms: false },
    { firstName: "Amanda", lastName: "Wilson", phone: "+15550002004", email: "amandaw@example.com", tags: ["hvac"], optedInSms: true },
    { firstName: "Christopher", lastName: "Taylor", phone: "+15550002005", email: "ctaylor@example.com", tags: ["hvac", "residential"], optedInSms: true },
    { firstName: "Jessica", lastName: "Anderson", phone: "+15550002006", email: "jessica.a@example.com", tags: ["residential"], optedInSms: true },
    { firstName: "Daniel", lastName: "Thomas", phone: "+15550002007", email: "dthomas@example.com", tags: ["commercial"], optedInSms: false },
    { firstName: "Ashley", lastName: "Jackson", phone: "+15550002008", email: "ajackson@example.com", tags: ["hvac", "vip"], optedInSms: true },
    { firstName: "Matthew", lastName: "White", phone: "+15550002009", email: "mwhite@example.com", tags: ["residential"], optedInSms: true },
    { firstName: "Emily", lastName: "Harris", phone: "+15550002010", email: "eharris@example.com", tags: ["commercial", "vip"], optedInSms: true },
  ];

  const contacts = await Promise.all(
    contactsData.map((c) =>
      prisma.contact.create({
        data: { ...c, businessId: business.id },
      })
    )
  );

  console.log(`✅ ${contacts.length} contacts created`);

  // Create estimates
  const estimatesData = [
    { title: "AC Unit Replacement", amount: 4200, status: EstimateStatus.PENDING, contactId: contacts[0].id },
    { title: "Furnace Installation", amount: 3800, status: EstimateStatus.VIEWED, contactId: contacts[1].id },
    { title: "HVAC System Overhaul", amount: 8500, status: EstimateStatus.PENDING, contactId: contacts[2].id },
    { title: "Duct Cleaning & Repair", amount: 1200, status: EstimateStatus.DECLINED, contactId: contacts[3].id },
    { title: "Mini-Split Installation", amount: 2900, status: EstimateStatus.ACCEPTED, contactId: contacts[4].id },
    { title: "Heat Pump Replacement", amount: 5600, status: EstimateStatus.PENDING, contactId: contacts[5].id },
    { title: "Commercial HVAC Service", amount: 12000, status: EstimateStatus.VIEWED, contactId: contacts[6].id },
    { title: "Thermostat Upgrade", amount: 450, status: EstimateStatus.EXPIRED, contactId: contacts[7].id },
  ];

  const estimates = await Promise.all(
    estimatesData.map((e) =>
      prisma.estimate.create({
        data: { ...e, businessId: business.id },
      })
    )
  );

  console.log(`✅ ${estimates.length} estimates created`);

  // Create opportunities
  const opportunitiesData = [
    {
      type: OpportunityType.UNANSWERED_ESTIMATE,
      status: OpportunityStatus.OPEN,
      value: 4200,
      description: "Estimate for AC unit replacement sent 3 days ago — no response",
      contactId: contacts[0].id,
      estimateId: estimates[0].id,
    },
    {
      type: OpportunityType.MISSED_CALL,
      status: OpportunityStatus.OPEN,
      value: 3800,
      description: "Missed inbound call at 2:15 PM",
      contactId: contacts[1].id,
    },
    {
      type: OpportunityType.UNANSWERED_ESTIMATE,
      status: OpportunityStatus.OPEN,
      value: 8500,
      description: "Large commercial estimate — no response after 5 days",
      contactId: contacts[2].id,
      estimateId: estimates[2].id,
    },
    {
      type: OpportunityType.REACTIVATION,
      status: OpportunityStatus.IN_PROGRESS,
      value: 2200,
      description: "Customer last serviced 14 months ago",
      contactId: contacts[3].id,
    },
    {
      type: OpportunityType.MISSED_CALL,
      status: OpportunityStatus.WON,
      value: 2900,
      description: "Missed call recovered via follow-up SMS",
      contactId: contacts[4].id,
    },
    {
      type: OpportunityType.UNANSWERED_ESTIMATE,
      status: OpportunityStatus.OPEN,
      value: 5600,
      description: "Heat pump estimate — viewed but no response",
      contactId: contacts[5].id,
      estimateId: estimates[5].id,
    },
  ];

  const opportunities = await Promise.all(
    opportunitiesData.map((o) =>
      prisma.opportunity.create({
        data: { ...o, businessId: business.id },
      })
    )
  );

  console.log(`✅ ${opportunities.length} opportunities created`);

  // Add notes to opportunities
  await prisma.opportunityNote.createMany({
    data: [
      { content: "Left voicemail. Will follow up via SMS.", opportunityId: opportunities[0].id, authorId: owner.id },
      { content: "Customer mentioned price was competitive.", opportunityId: opportunities[1].id, authorId: owner.id },
      { content: "Second follow-up sent. Awaiting response.", opportunityId: opportunities[2].id, authorId: owner.id },
    ],
  });

  // Create templates
  const templatesData = [
    {
      name: "Estimate Follow-Up #1",
      type: TemplateType.SMS,
      body: "Hi {{firstName}}, this is {{businessName}}. I wanted to follow up on the estimate we sent you for {{estimateTitle}}. Any questions? Reply or call us at {{businessPhone}}.",
      variables: ["firstName", "businessName", "estimateTitle", "businessPhone"],
    },
    {
      name: "Estimate Follow-Up #2",
      type: TemplateType.SMS,
      body: "Hi {{firstName}}, just checking in one more time on your estimate for {{estimateTitle}} (${{estimateAmount}}). We'd love to help — let us know if now is a good time to chat.",
      variables: ["firstName", "estimateTitle", "estimateAmount"],
    },
    {
      name: "Missed Call Recovery",
      type: TemplateType.SMS,
      body: "Hi {{firstName}}, sorry we missed your call! This is {{businessName}}. We're available now — reply here or call us back at {{businessPhone}}.",
      variables: ["firstName", "businessName", "businessPhone"],
    },
    {
      name: "Win-Back Reactivation",
      type: TemplateType.SMS,
      body: "Hi {{firstName}}, it's been a while since we've seen you at {{businessName}}! We're offering existing customers a special seasonal tune-up. Interested? Reply YES or call {{businessPhone}}.",
      variables: ["firstName", "businessName", "businessPhone"],
    },
    {
      name: "Review Request",
      type: TemplateType.SMS,
      body: "Hi {{firstName}}, thank you for choosing {{businessName}}! We'd really appreciate if you could leave us a quick review: {{reviewLink}}. It only takes 30 seconds!",
      variables: ["firstName", "businessName", "reviewLink"],
    },
  ];

  await Promise.all(
    templatesData.map((t) =>
      prisma.template.create({
        data: { ...t, businessId: business.id, isSystem: true },
      })
    )
  );

  console.log(`✅ ${templatesData.length} templates created`);

  // Create campaigns
  const estimateFollowupCampaign = await prisma.campaign.create({
    data: {
      name: "Estimate Follow-Up Sequence",
      type: CampaignType.ESTIMATE_FOLLOWUP,
      status: CampaignStatus.ACTIVE,
      description: "Automatically follows up on unanswered estimates over 7 days",
      goal: "Convert pending estimates to booked jobs",
      businessId: business.id,
      launchedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.campaignStep.createMany({
    data: [
      {
        campaignId: estimateFollowupCampaign.id,
        order: 1,
        type: CampaignStepType.SMS,
        delayDays: 2,
        body: "Hi {{firstName}}, this is {{businessName}}. Following up on your estimate for {{estimateTitle}}. Any questions? We're here to help!",
      },
      {
        campaignId: estimateFollowupCampaign.id,
        order: 2,
        type: CampaignStepType.SMS,
        delayDays: 5,
        body: "Hi {{firstName}}, just one more follow-up on your estimate (${{estimateAmount}}). We'd love to get this scheduled for you. Call us or reply here!",
      },
    ],
  });

  const reactivationCampaign = await prisma.campaign.create({
    data: {
      name: "12-Month Reactivation",
      type: CampaignType.REACTIVATION,
      status: CampaignStatus.ACTIVE,
      description: "Re-engages customers who haven't booked in 12+ months",
      goal: "Book seasonal maintenance or new service",
      businessId: business.id,
      launchedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.campaignStep.create({
    data: {
      campaignId: reactivationCampaign.id,
      order: 1,
      type: CampaignStepType.SMS,
      delayDays: 0,
      body: "Hi {{firstName}}, it's been a while! {{businessName}} is offering past customers a complimentary system check-up this season. Interested? Reply YES.",
    },
  });

  console.log(`✅ Campaigns created`);

  // Create integrations
  const integrationsData = [
    { provider: "ServiceTitan", status: IntegrationStatus.CONNECTED, connectedAt: new Date() },
    { provider: "Twilio", status: IntegrationStatus.CONNECTED, connectedAt: new Date() },
    { provider: "Stripe", status: IntegrationStatus.DISCONNECTED },
    { provider: "Google", status: IntegrationStatus.DISCONNECTED },
    { provider: "Jobber", status: IntegrationStatus.DISCONNECTED },
  ];

  await Promise.all(
    integrationsData.map((i) =>
      prisma.integration.upsert({
        where: { businessId_provider: { businessId: business.id, provider: i.provider } },
        update: {},
        create: { ...i, businessId: business.id },
      })
    )
  );

  console.log(`✅ Integrations created`);

  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
