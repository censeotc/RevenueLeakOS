import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.activityLog.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.messageEvent.deleteMany();
  await prisma.campaignStep.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.template.deleteMany();
  await prisma.opportunityNote.deleteMany();
  await prisma.estimate.deleteMany();
  await prisma.callEvent.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.integrationConnection.deleteMany();
  await prisma.reportSnapshot.deleteMany();
  await prisma.location.deleteMany();
  await prisma.user.deleteMany();
  await prisma.business.deleteMany();

  const business = await prisma.business.create({
    data: {
      id: "biz_northshore",
      name: "North Shore Heating & Plumbing",
      phone: "+13135550100",
      email: "office@northshoreheating.com",
      website: "https://northshoreheating.com",
      timezone: "America/Detroit",
      staleEstimateDays: 7,
      attributionWindowDays: 14,
      highValueThreshold: 2500,
      missedCallSuppressionHours: 4,
      address: "2847 Lakeshore Blvd",
      city: "Grosse Pointe",
      state: "MI",
      zip: "48236",
    },
  });

  const location = await prisma.location.create({
    data: {
      id: "loc_main",
      name: "Main Office",
      address: "2847 Lakeshore Blvd",
      city: "Grosse Pointe",
      state: "MI",
      zip: "48236",
      phone: "+13135550100",
      businessId: business.id,
      isDefault: true,
    },
  });

  const owner = await prisma.user.create({
    data: {
      id: "user_owner",
      email: "mike@northshoreheating.com",
      name: "Mike Kowalski",
      role: "owner",
      phone: "+13135550101",
      businessId: business.id,
    },
  });

  const manager = await prisma.user.create({
    data: {
      id: "user_manager",
      email: "sarah@northshoreheating.com",
      name: "Sarah Chen",
      role: "manager",
      phone: "+13135550102",
      businessId: business.id,
    },
  });

  const csr1 = await prisma.user.create({
    data: {
      id: "user_csr1",
      email: "jen@northshoreheating.com",
      name: "Jen Martinez",
      role: "csr",
      phone: "+13135550103",
      businessId: business.id,
    },
  });

  const csr2 = await prisma.user.create({
    data: {
      id: "user_csr2",
      email: "dave@northshoreheating.com",
      name: "Dave Thompson",
      role: "csr",
      phone: "+13135550104",
      businessId: business.id,
    },
  });

  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000);
  const minsAgo = (m: number) => new Date(now.getTime() - m * 60000);
  const daysFromNow = (d: number) => new Date(now.getTime() + d * 86400000);

  const contacts = await Promise.all([
    prisma.contact.create({ data: { id: "ct_01", firstName: "Robert", lastName: "Anderson", phone: "+13135551001", email: "randerson@email.com", address: "1234 Maple St", city: "Grosse Pointe", state: "MI", zip: "48236", tags: ["residential", "hvac"], source: "referral", lastServiceDate: daysAgo(45), lifetimeValue: 4200, businessId: business.id } }),
    prisma.contact.create({ data: { id: "ct_02", firstName: "Linda", lastName: "Jacobs", phone: "+13135551002", email: "ljacobs@email.com", address: "567 Oak Ave", city: "St Clair Shores", state: "MI", zip: "48080", tags: ["residential", "plumbing"], source: "google", lastServiceDate: daysAgo(180), lifetimeValue: 2800, businessId: business.id } }),
    prisma.contact.create({ data: { id: "ct_03", firstName: "James", lastName: "Wilson", phone: "+13135551003", email: "jwilson@email.com", address: "890 Elm Dr", city: "Grosse Pointe Park", state: "MI", zip: "48230", tags: ["residential", "hvac", "maintenance"], source: "website", lastServiceDate: daysAgo(400), lifetimeValue: 8500, businessId: business.id } }),
    prisma.contact.create({ data: { id: "ct_04", firstName: "Patricia", lastName: "Moore", phone: "+13135551004", email: "pmoore@email.com", address: "321 Pine Ln", city: "Harper Woods", state: "MI", zip: "48225", tags: ["residential", "electrical"], source: "yelp", lastServiceDate: daysAgo(90), lifetimeValue: 1200, businessId: business.id } }),
    prisma.contact.create({ data: { id: "ct_05", firstName: "Thomas", lastName: "Garcia", phone: "+13135551005", email: "tgarcia@email.com", address: "654 Birch Ct", city: "Eastpointe", state: "MI", zip: "48021", tags: ["commercial", "hvac"], source: "referral", lastServiceDate: daysAgo(30), lifetimeValue: 12000, businessId: business.id } }),
    prisma.contact.create({ data: { id: "ct_06", firstName: "Susan", lastName: "Miller", phone: "+13135551006", email: "smiller@email.com", address: "987 Cedar Rd", city: "Grosse Pointe", state: "MI", zip: "48236", tags: ["residential", "plumbing", "hvac"], source: "google", lastServiceDate: daysAgo(365), lifetimeValue: 6700, businessId: business.id } }),
    prisma.contact.create({ data: { id: "ct_07", firstName: "Charles", lastName: "Davis", phone: "+13135551007", email: "cdavis@email.com", address: "147 Walnut St", city: "Detroit", state: "MI", zip: "48224", tags: ["residential", "hvac"], source: "website", lastServiceDate: daysAgo(500), lifetimeValue: 3400, businessId: business.id } }),
    prisma.contact.create({ data: { id: "ct_08", firstName: "Margaret", lastName: "Taylor", phone: "+13135551008", email: "mtaylor@email.com", address: "258 Spruce Ave", city: "St Clair Shores", state: "MI", zip: "48081", tags: ["residential", "plumbing"], source: "referral", lastServiceDate: daysAgo(60), lifetimeValue: 900, businessId: business.id } }),
    prisma.contact.create({ data: { id: "ct_09", firstName: "Daniel", lastName: "Brown", phone: "+13135551009", email: "dbrown@email.com", address: "369 Ash Blvd", city: "Grosse Pointe Farms", state: "MI", zip: "48236", tags: ["residential", "hvac", "plumbing"], source: "google", lastServiceDate: daysAgo(200), lifetimeValue: 5600, businessId: business.id } }),
    prisma.contact.create({ data: { id: "ct_10", firstName: "Nancy", lastName: "Johnson", phone: "+13135551010", email: "njohnson@email.com", address: "741 Hickory Ln", city: "Grosse Pointe Woods", state: "MI", zip: "48236", tags: ["residential", "hvac"], source: "yelp", lastServiceDate: daysAgo(420), lifetimeValue: 7200, businessId: business.id } }),
    prisma.contact.create({ data: { id: "ct_11", firstName: "Kevin", lastName: "Lee", phone: "+13135551011", email: "klee@email.com", address: "852 Poplar St", city: "Harper Woods", state: "MI", zip: "48225", tags: ["commercial", "plumbing"], source: "referral", lastServiceDate: daysAgo(150), lifetimeValue: 15000, businessId: business.id } }),
    prisma.contact.create({ data: { id: "ct_12", firstName: "Betty", lastName: "White", phone: "+13135551012", email: "bwhite@email.com", address: "963 Magnolia Dr", city: "Eastpointe", state: "MI", zip: "48021", tags: ["residential", "electrical"], source: "website", lastServiceDate: daysAgo(300), lifetimeValue: 2100, businessId: business.id } }),
    prisma.contact.create({ data: { id: "ct_13", firstName: "Steven", lastName: "Clark", phone: "+13135551013", email: "sclark@email.com", address: "159 Sycamore Ct", city: "Grosse Pointe", state: "MI", zip: "48236", tags: ["residential", "hvac"], source: "google", lastServiceDate: daysAgo(75), lifetimeValue: 3800, businessId: business.id } }),
    prisma.contact.create({ data: { id: "ct_14", firstName: "Dorothy", lastName: "Harris", phone: "+13135551014", email: "dharris@email.com", address: "267 Chestnut Ave", city: "St Clair Shores", state: "MI", zip: "48080", tags: ["residential", "plumbing", "hvac"], source: "referral", lastServiceDate: daysAgo(100), lifetimeValue: 4500, businessId: business.id } }),
    prisma.contact.create({ data: { id: "ct_15", firstName: "Paul", lastName: "Martinez", phone: "+13135551015", email: "pmartinez@email.com", address: "378 Willow Rd", city: "Detroit", state: "MI", zip: "48215", tags: ["commercial", "hvac", "plumbing"], source: "website", lastServiceDate: daysAgo(250), lifetimeValue: 22000, businessId: business.id } }),
    prisma.contact.create({ data: { id: "ct_16", firstName: "Karen", lastName: "Robinson", phone: "+13135551016", email: "krobinson@email.com", address: "489 Dogwood St", city: "Grosse Pointe Park", state: "MI", zip: "48230", tags: ["residential", "hvac"], source: "yelp", lastServiceDate: daysAgo(380), lifetimeValue: 6100, businessId: business.id } }),
    prisma.contact.create({ data: { id: "ct_17", firstName: "Brian", lastName: "Hall", phone: "+13135551017", email: "bhall@email.com", address: "591 Redwood Ln", city: "Grosse Pointe", state: "MI", zip: "48236", tags: ["residential", "plumbing"], source: "google", lastServiceDate: daysAgo(50), lifetimeValue: 1800, businessId: business.id } }),
    prisma.contact.create({ data: { id: "ct_18", firstName: "Sandra", lastName: "Young", phone: "+13135551018", email: "syoung@email.com", address: "602 Cypress Ave", city: "Harper Woods", state: "MI", zip: "48225", tags: ["residential", "hvac", "maintenance"], source: "referral", lastServiceDate: daysAgo(450), lifetimeValue: 9200, businessId: business.id } }),
    prisma.contact.create({ data: { id: "ct_19", firstName: "Mark", lastName: "Walker", phone: "+13135551019", email: "mwalker@email.com", address: "713 Juniper Dr", city: "St Clair Shores", state: "MI", zip: "48081", tags: ["residential", "electrical", "hvac"], source: "website", lastServiceDate: daysAgo(120), lifetimeValue: 3200, businessId: business.id } }),
    prisma.contact.create({ data: { id: "ct_20", firstName: "Donna", lastName: "King", phone: "+13135551020", email: "dking@email.com", address: "824 Sequoia Ct", city: "Grosse Pointe Woods", state: "MI", zip: "48236", tags: ["residential", "plumbing", "hvac"], source: "referral", lastServiceDate: daysAgo(330), lifetimeValue: 5400, businessId: business.id } }),
    prisma.contact.create({ data: { id: "ct_21", firstName: "George", lastName: "Wright", phone: "+13135551021", email: "gwright@email.com", address: "935 Fir St", city: "Eastpointe", state: "MI", zip: "48021", tags: ["commercial", "hvac"], source: "google", lastServiceDate: daysAgo(15), lifetimeValue: 18500, businessId: business.id } }),
    prisma.contact.create({ data: { id: "ct_22", firstName: "Carol", lastName: "Lopez", phone: "+13135551022", email: "clopez@email.com", address: "146 Hemlock Rd", city: "Detroit", state: "MI", zip: "48224", tags: ["residential", "hvac"], source: "yelp", lifetimeValue: 0, businessId: business.id } }),
    prisma.contact.create({ data: { id: "ct_23", firstName: "Edward", lastName: "Scott", phone: "+13135551023", email: "escott@email.com", address: "257 Aspen Ave", city: "Grosse Pointe", state: "MI", zip: "48236", tags: ["residential", "plumbing"], source: "referral", lastServiceDate: daysAgo(550), lifetimeValue: 4100, businessId: business.id } }),
    prisma.contact.create({ data: { id: "ct_24", firstName: "Ruth", lastName: "Green", phone: "+13135551024", email: "rgreen@email.com", address: "368 Larch Ln", city: "St Clair Shores", state: "MI", zip: "48080", tags: ["residential", "hvac", "plumbing"], source: "website", lastServiceDate: daysAgo(280), lifetimeValue: 7800, businessId: business.id } }),
  ]);

  // Opportunities - 15 total covering all three types
  const opportunities = await Promise.all([
    // Missed call opportunities
    prisma.opportunity.create({ data: { id: "opp_01", type: "missed_call", status: "new", title: "Missed call - Robert Anderson", description: "Inbound missed call, no voicemail left", estimatedValue: 350, contactId: "ct_01", businessId: business.id, assignedToId: csr1.id, createdAt: hoursAgo(2) } }),
    prisma.opportunity.create({ data: { id: "opp_02", type: "missed_call", status: "contacted", title: "Missed call - Carol Lopez", description: "After-hours call, SMS auto-reply sent", estimatedValue: 500, contactId: "ct_22", businessId: business.id, assignedToId: csr1.id, createdAt: hoursAgo(8) } }),
    prisma.opportunity.create({ data: { id: "opp_03", type: "missed_call", status: "booked", title: "Missed call - Daniel Brown", description: "Responded to SMS, booked furnace tune-up", estimatedValue: 189, actualValue: 189, contactId: "ct_09", businessId: business.id, assignedToId: csr2.id, createdAt: daysAgo(2), resolvedAt: daysAgo(1) } }),
    prisma.opportunity.create({ data: { id: "opp_04", type: "missed_call", status: "lost", title: "Missed call - Patricia Moore", description: "Called back, went with another provider", estimatedValue: 800, contactId: "ct_04", businessId: business.id, assignedToId: csr1.id, createdAt: daysAgo(5), resolvedAt: daysAgo(3) } }),
    prisma.opportunity.create({ data: { id: "opp_05", type: "missed_call", status: "new", title: "Missed call - Mark Walker", description: "Weekend call, not yet contacted", estimatedValue: 275, contactId: "ct_19", businessId: business.id, createdAt: hoursAgo(1) } }),

    // Estimate rescue opportunities
    prisma.opportunity.create({ data: { id: "opp_06", type: "estimate_rescue", status: "new", title: "Stale estimate - Linda Jacobs", description: "Water heater replacement estimate, 12 days old", estimatedValue: 3200, contactId: "ct_02", businessId: business.id, assignedToId: manager.id, createdAt: daysAgo(5) } }),
    prisma.opportunity.create({ data: { id: "opp_07", type: "estimate_rescue", status: "in_progress", title: "Stale estimate - Steven Clark", description: "AC unit replacement, follow-up #2 sent", estimatedValue: 5800, contactId: "ct_13", businessId: business.id, assignedToId: csr2.id, createdAt: daysAgo(10) } }),
    prisma.opportunity.create({ data: { id: "opp_08", type: "estimate_rescue", status: "responded", title: "Stale estimate - Thomas Garcia", description: "Commercial HVAC maintenance contract, customer interested", estimatedValue: 8500, contactId: "ct_05", businessId: business.id, assignedToId: manager.id, createdAt: daysAgo(8) } }),
    prisma.opportunity.create({ data: { id: "opp_09", type: "estimate_rescue", status: "won", title: "Rescued estimate - Dorothy Harris", description: "Boiler replacement, signed after follow-up", estimatedValue: 6200, actualValue: 6200, contactId: "ct_14", businessId: business.id, assignedToId: csr1.id, createdAt: daysAgo(14), resolvedAt: daysAgo(3) } }),

    // Reactivation opportunities
    prisma.opportunity.create({ data: { id: "opp_10", type: "reactivation", status: "new", title: "Reactivation - James Wilson", description: "No service in 13 months, previously high-value customer", estimatedValue: 1200, contactId: "ct_03", businessId: business.id, createdAt: daysAgo(3) } }),
    prisma.opportunity.create({ data: { id: "opp_11", type: "reactivation", status: "contacted", title: "Reactivation - Susan Miller", description: "12 months since last service, maintenance due", estimatedValue: 450, contactId: "ct_06", businessId: business.id, assignedToId: csr2.id, createdAt: daysAgo(7) } }),
    prisma.opportunity.create({ data: { id: "opp_12", type: "reactivation", status: "booked", title: "Reactivation - Nancy Johnson", description: "14 months dormant, booked furnace inspection", estimatedValue: 350, actualValue: 350, contactId: "ct_10", businessId: business.id, assignedToId: csr1.id, createdAt: daysAgo(10), resolvedAt: daysAgo(2) } }),
    prisma.opportunity.create({ data: { id: "opp_13", type: "reactivation", status: "new", title: "Reactivation - Charles Davis", description: "16+ months dormant, replacement cycle candidate", estimatedValue: 4500, contactId: "ct_07", businessId: business.id, createdAt: daysAgo(1) } }),
    prisma.opportunity.create({ data: { id: "opp_14", type: "reactivation", status: "contacted", title: "Reactivation - Karen Robinson", description: "12+ months dormant, membership renewal opportunity", estimatedValue: 600, contactId: "ct_16", businessId: business.id, assignedToId: csr2.id, createdAt: daysAgo(5) } }),
    prisma.opportunity.create({ data: { id: "opp_15", type: "reactivation", status: "won", title: "Reactivation - Edward Scott", description: "18 months dormant, signed maintenance contract", estimatedValue: 2400, actualValue: 2400, contactId: "ct_23", businessId: business.id, assignedToId: manager.id, createdAt: daysAgo(20), resolvedAt: daysAgo(5) } }),
  ]);

  // Opportunity Notes
  await Promise.all([
    prisma.opportunityNote.create({ data: { content: "Left voicemail, will try again tomorrow", opportunityId: "opp_01", authorId: csr1.id, createdAt: hoursAgo(1) } }),
    prisma.opportunityNote.create({ data: { content: "Customer responded to SMS, wants a quote for drain cleaning", opportunityId: "opp_02", authorId: csr1.id, createdAt: hoursAgo(6) } }),
    prisma.opportunityNote.create({ data: { content: "Booked for Thursday 2-4pm", opportunityId: "opp_03", authorId: csr2.id, createdAt: daysAgo(1) } }),
    prisma.opportunityNote.create({ data: { content: "Customer says price is too high, considering competitor quote", opportunityId: "opp_07", authorId: csr2.id, createdAt: daysAgo(3) } }),
    prisma.opportunityNote.create({ data: { content: "Offered 10% discount on maintenance agreement, customer accepted", opportunityId: "opp_09", authorId: csr1.id, createdAt: daysAgo(4) } }),
    prisma.opportunityNote.create({ data: { content: "Sent seasonal maintenance reminder email", opportunityId: "opp_11", authorId: csr2.id, createdAt: daysAgo(5) } }),
  ]);

  // Call Events - 10 total
  await Promise.all([
    prisma.callEvent.create({ data: { id: "call_01", callerNumber: "+13135551001", calledNumber: "+13135550100", direction: "inbound", status: "missed", duration: 0, callerName: "Robert Anderson", callTime: hoursAgo(2), contactId: "ct_01", opportunityId: "opp_01", businessId: business.id } }),
    prisma.callEvent.create({ data: { id: "call_02", callerNumber: "+13135551022", calledNumber: "+13135550100", direction: "inbound", status: "after_hours", duration: 0, callerName: "Carol Lopez", callTime: hoursAgo(8), contactId: "ct_22", opportunityId: "opp_02", businessId: business.id } }),
    prisma.callEvent.create({ data: { id: "call_03", callerNumber: "+13135551009", calledNumber: "+13135550100", direction: "inbound", status: "booked", duration: 180, callerName: "Daniel Brown", callTime: daysAgo(2), contactId: "ct_09", opportunityId: "opp_03", businessId: business.id } }),
    prisma.callEvent.create({ data: { id: "call_04", callerNumber: "+13135551004", calledNumber: "+13135550100", direction: "inbound", status: "lost", duration: 45, callerName: "Patricia Moore", callTime: daysAgo(5), contactId: "ct_04", opportunityId: "opp_04", businessId: business.id } }),
    prisma.callEvent.create({ data: { id: "call_05", callerNumber: "+13135551019", calledNumber: "+13135550100", direction: "inbound", status: "missed", duration: 0, callerName: "Mark Walker", callTime: hoursAgo(1), contactId: "ct_19", opportunityId: "opp_05", businessId: business.id } }),
    prisma.callEvent.create({ data: { id: "call_06", callerNumber: "+13135551005", calledNumber: "+13135550100", direction: "inbound", status: "responded", duration: 420, callerName: "Thomas Garcia", callTime: daysAgo(3), contactId: "ct_05", businessId: business.id } }),
    prisma.callEvent.create({ data: { id: "call_07", callerNumber: "+13135551017", calledNumber: "+13135550100", direction: "inbound", status: "missed", duration: 0, callerName: "Brian Hall", callTime: daysAgo(1), contactId: "ct_17", businessId: business.id } }),
    prisma.callEvent.create({ data: { id: "call_08", callerNumber: "+13135551011", calledNumber: "+13135550100", direction: "inbound", status: "abandoned", duration: 15, callerName: "Kevin Lee", callTime: daysAgo(1), contactId: "ct_11", businessId: business.id } }),
    prisma.callEvent.create({ data: { id: "call_09", callerNumber: "+13135550100", calledNumber: "+13135551001", direction: "outbound", status: "responded", duration: 240, callerName: null, callTime: hoursAgo(1), contactId: "ct_01", businessId: business.id } }),
    prisma.callEvent.create({ data: { id: "call_10", callerNumber: "+13135551021", calledNumber: "+13135550100", direction: "inbound", status: "booked", duration: 360, callerName: "George Wright", callTime: daysAgo(2), contactId: "ct_21", businessId: business.id } }),
  ]);

  // Estimates - 10 total
  await Promise.all([
    prisma.estimate.create({ data: { id: "est_01", estimateNumber: "EST-2026-001", amount: 3200, serviceType: "Water Heater Replacement", description: "50-gal tankless water heater install", status: "stale", sentAt: daysAgo(12), contactId: "ct_02", opportunityId: "opp_06", businessId: business.id } }),
    prisma.estimate.create({ data: { id: "est_02", estimateNumber: "EST-2026-002", amount: 5800, serviceType: "AC Unit Replacement", description: "3-ton central AC unit replacement", status: "follow_up", sentAt: daysAgo(15), followUpCount: 2, contactId: "ct_13", opportunityId: "opp_07", businessId: business.id } }),
    prisma.estimate.create({ data: { id: "est_03", estimateNumber: "EST-2026-003", amount: 8500, serviceType: "Commercial HVAC Maintenance", description: "Annual commercial HVAC service contract", status: "viewed", sentAt: daysAgo(10), viewedAt: daysAgo(8), contactId: "ct_05", opportunityId: "opp_08", businessId: business.id } }),
    prisma.estimate.create({ data: { id: "est_04", estimateNumber: "EST-2026-004", amount: 6200, serviceType: "Boiler Replacement", description: "High-efficiency boiler install", status: "booked", sentAt: daysAgo(18), contactId: "ct_14", opportunityId: "opp_09", businessId: business.id } }),
    prisma.estimate.create({ data: { id: "est_05", estimateNumber: "EST-2026-005", amount: 450, serviceType: "Drain Cleaning", description: "Main sewer line cleaning", status: "sent", sentAt: daysAgo(3), contactId: "ct_08", businessId: business.id } }),
    prisma.estimate.create({ data: { id: "est_06", estimateNumber: "EST-2026-006", amount: 1800, serviceType: "Furnace Repair", description: "Heat exchanger diagnostic and repair", status: "stale", sentAt: daysAgo(9), contactId: "ct_12", businessId: business.id } }),
    prisma.estimate.create({ data: { id: "est_07", estimateNumber: "EST-2026-007", amount: 2400, serviceType: "Ductwork", description: "Full duct cleaning and sealing", status: "sent", sentAt: daysAgo(2), contactId: "ct_17", businessId: business.id } }),
    prisma.estimate.create({ data: { id: "est_08", estimateNumber: "EST-2026-008", amount: 12500, serviceType: "Full HVAC System", description: "Complete HVAC system replacement", status: "stale", sentAt: daysAgo(11), viewedAt: daysAgo(9), contactId: "ct_15", businessId: business.id } }),
    prisma.estimate.create({ data: { id: "est_09", estimateNumber: "EST-2026-009", amount: 750, serviceType: "Water Line Repair", description: "Kitchen water line replacement", status: "expired", sentAt: daysAgo(35), contactId: "ct_20", businessId: business.id } }),
    prisma.estimate.create({ data: { id: "est_10", estimateNumber: "EST-2026-010", amount: 950, serviceType: "Garbage Disposal", description: "InSinkErator install + plumbing", status: "viewed", sentAt: daysAgo(5), viewedAt: daysAgo(4), contactId: "ct_24", businessId: business.id } }),
  ]);

  // Templates
  await Promise.all([
    prisma.template.create({ data: { id: "tpl_01", name: "Missed Call Auto-Reply", type: "sms", body: "Hi {{firstName}}, we missed your call at {{businessName}}! We're sorry we couldn't pick up. How can we help? Reply here or call us back at {{businessPhone}}.", variables: ["firstName", "businessName", "businessPhone"], businessId: business.id } }),
    prisma.template.create({ data: { id: "tpl_02", name: "Estimate Follow-Up", type: "sms", body: "Hi {{firstName}}, just checking in on the {{serviceType}} estimate we sent on {{estimateDate}}. Do you have any questions? We'd love to help get this scheduled for you.", variables: ["firstName", "serviceType", "estimateDate"], businessId: business.id } }),
    prisma.template.create({ data: { id: "tpl_03", name: "Reactivation Outreach", type: "sms", body: "Hi {{firstName}}, it's been a while since your last service with {{businessName}}! We'd love to have you back. Book a tune-up this month and save 15%. Reply YES to schedule.", variables: ["firstName", "businessName"], businessId: business.id } }),
    prisma.template.create({ data: { id: "tpl_04", name: "Booking Confirmation", type: "sms", body: "Hi {{firstName}}, your {{serviceType}} appointment is confirmed for {{appointmentDate}} at {{appointmentTime}}. See you then! - {{businessName}}", variables: ["firstName", "serviceType", "appointmentDate", "appointmentTime", "businessName"], businessId: business.id } }),
    prisma.template.create({ data: { id: "tpl_05", name: "Estimate Follow-Up Email", type: "email", subject: "Your {{serviceType}} Estimate from {{businessName}}", body: "Hi {{firstName}},\n\nWe wanted to follow up on the estimate we sent for {{serviceType}} on {{estimateDate}}.\n\nYour estimate total: {{estimateAmount}}\n\nIf you have any questions or would like to move forward, just reply to this email or call us at {{businessPhone}}.\n\nBest regards,\n{{businessName}}", variables: ["firstName", "serviceType", "estimateDate", "estimateAmount", "businessPhone", "businessName"], businessId: business.id } }),
    prisma.template.create({ data: { id: "tpl_06", name: "Maintenance Reminder", type: "email", subject: "Time for Your Annual {{serviceType}} Maintenance", body: "Hi {{firstName}},\n\nIt's been {{monthsSinceService}} months since your last {{serviceType}} service. Regular maintenance helps prevent costly breakdowns and keeps your system running efficiently.\n\nSchedule your maintenance visit today and we'll include a complimentary system inspection.\n\nCall us: {{businessPhone}}\n\n{{businessName}}", variables: ["firstName", "serviceType", "monthsSinceService", "businessPhone", "businessName"], businessId: business.id } }),
  ]);

  // Campaigns
  await Promise.all([
    prisma.campaign.create({
      data: {
        id: "camp_01", name: "Winter Furnace Check-Up", description: "Reactivation campaign targeting customers who haven't had furnace service in 12+ months", type: "reactivation", status: "active", targetCount: 45, sentCount: 38, responseCount: 12, bookedCount: 6, businessId: business.id,
        steps: {
          create: [
            { id: "step_01", stepOrder: 1, type: "sms", templateId: "tpl_03", delayHours: 0, body: "Time for your annual furnace check-up!" },
            { id: "step_02", stepOrder: 2, type: "wait", delayHours: 48 },
            { id: "step_03", stepOrder: 3, type: "email", templateId: "tpl_06", delayHours: 0, subject: "Don't forget your furnace maintenance" },
            { id: "step_04", stepOrder: 4, type: "wait", delayHours: 72 },
            { id: "step_05", stepOrder: 5, type: "sms", delayHours: 0, body: "Last chance for 15% off furnace tune-up!" },
          ],
        },
      },
    }),
    prisma.campaign.create({
      data: {
        id: "camp_02", name: "Stale Estimate Recovery", description: "Follow up on estimates older than 7 days", type: "estimate_rescue", status: "active", targetCount: 22, sentCount: 18, responseCount: 7, bookedCount: 3, businessId: business.id,
        steps: {
          create: [
            { id: "step_06", stepOrder: 1, type: "sms", templateId: "tpl_02", delayHours: 0 },
            { id: "step_07", stepOrder: 2, type: "wait", delayHours: 72 },
            { id: "step_08", stepOrder: 3, type: "email", templateId: "tpl_05", delayHours: 0 },
          ],
        },
      },
    }),
    prisma.campaign.create({
      data: {
        id: "camp_03", name: "Missed Call Weekend Recovery", description: "Auto-outreach for weekend missed calls", type: "missed_call", status: "active", targetCount: 15, sentCount: 15, responseCount: 9, bookedCount: 5, businessId: business.id,
        steps: {
          create: [
            { id: "step_09", stepOrder: 1, type: "sms", templateId: "tpl_01", delayHours: 0 },
            { id: "step_10", stepOrder: 2, type: "wait", delayHours: 24 },
            { id: "step_11", stepOrder: 3, type: "call", delayHours: 0, body: "Follow up call" },
          ],
        },
      },
    }),
    prisma.campaign.create({
      data: {
        id: "camp_04", name: "Spring AC Prep", description: "Draft campaign for spring AC maintenance push", type: "reactivation", status: "draft", targetCount: 0, sentCount: 0, responseCount: 0, bookedCount: 0, businessId: business.id,
        steps: {
          create: [
            { id: "step_12", stepOrder: 1, type: "sms", delayHours: 0, body: "Spring is here! Time to get your AC ready." },
          ],
        },
      },
    }),
  ]);

  // Message Events
  await Promise.all([
    prisma.messageEvent.create({ data: { channel: "sms", direction: "outbound", toNumber: "+13135551001", fromNumber: "+13135550100", body: "Hi Robert, we missed your call at North Shore Heating & Plumbing! How can we help? Reply here or call us back at (313) 555-0100.", status: "delivered", contactId: "ct_01", opportunityId: "opp_01", businessId: business.id, sentAt: hoursAgo(2) } }),
    prisma.messageEvent.create({ data: { channel: "sms", direction: "outbound", toNumber: "+13135551022", fromNumber: "+13135550100", body: "Hi Carol, we missed your call at North Shore Heating & Plumbing! We're sorry we couldn't pick up. How can we help?", status: "delivered", contactId: "ct_22", opportunityId: "opp_02", businessId: business.id, sentAt: hoursAgo(7) } }),
    prisma.messageEvent.create({ data: { channel: "sms", direction: "inbound", toNumber: "+13135550100", fromNumber: "+13135551022", body: "Hi, I need someone to look at my furnace. It's making a weird noise.", status: "received", contactId: "ct_22", opportunityId: "opp_02", businessId: business.id, sentAt: hoursAgo(6) } }),
    prisma.messageEvent.create({ data: { channel: "sms", direction: "outbound", toNumber: "+13135551022", fromNumber: "+13135550100", body: "We can definitely help with that! When would be a good time for a technician to come out?", status: "delivered", contactId: "ct_22", opportunityId: "opp_02", businessId: business.id, sentAt: hoursAgo(5) } }),
    prisma.messageEvent.create({ data: { channel: "sms", direction: "outbound", toNumber: "+13135551009", fromNumber: "+13135550100", body: "Hi Daniel, your furnace tune-up is confirmed for Thursday 2-4pm. See you then! - North Shore Heating & Plumbing", status: "delivered", contactId: "ct_09", opportunityId: "opp_03", businessId: business.id, sentAt: daysAgo(1) } }),
    prisma.messageEvent.create({ data: { channel: "sms", direction: "outbound", toNumber: "+13135551002", fromNumber: "+13135550100", body: "Hi Linda, just checking in on the Water Heater Replacement estimate we sent. Do you have any questions?", status: "delivered", contactId: "ct_02", opportunityId: "opp_06", businessId: business.id, sentAt: daysAgo(5) } }),
    prisma.messageEvent.create({ data: { channel: "email", direction: "outbound", toEmail: "tgarcia@email.com", fromEmail: "office@northshoreheating.com", subject: "Your Commercial HVAC Maintenance Estimate", body: "Hi Thomas, we wanted to follow up on the Commercial HVAC Maintenance estimate we sent...", status: "delivered", contactId: "ct_05", opportunityId: "opp_08", businessId: business.id, sentAt: daysAgo(3) } }),
    prisma.messageEvent.create({ data: { channel: "sms", direction: "outbound", toNumber: "+13135551006", fromNumber: "+13135550100", body: "Hi Susan, it's been a while since your last service with North Shore Heating & Plumbing! Book a tune-up this month and save 15%.", status: "delivered", contactId: "ct_06", opportunityId: "opp_11", businessId: business.id, sentAt: daysAgo(7) } }),
  ]);

  // Bookings
  await Promise.all([
    prisma.booking.create({ data: { id: "bk_01", title: "Furnace Tune-Up", description: "Annual furnace maintenance", scheduledAt: daysFromNow(2), duration: 120, serviceType: "HVAC Maintenance", estimatedValue: 189, status: "scheduled", contactId: "ct_09", opportunityId: "opp_03", businessId: business.id, bookedById: csr2.id } }),
    prisma.booking.create({ data: { id: "bk_02", title: "Boiler Replacement", description: "High-efficiency boiler installation", scheduledAt: daysFromNow(5), duration: 480, serviceType: "Boiler Install", estimatedValue: 6200, status: "scheduled", contactId: "ct_14", opportunityId: "opp_09", businessId: business.id, bookedById: csr1.id } }),
    prisma.booking.create({ data: { id: "bk_03", title: "Furnace Inspection", description: "Reactivation - customer returning after 14 months", scheduledAt: daysFromNow(3), duration: 90, serviceType: "HVAC Inspection", estimatedValue: 350, status: "scheduled", contactId: "ct_10", opportunityId: "opp_12", businessId: business.id, bookedById: csr1.id } }),
    prisma.booking.create({ data: { id: "bk_04", title: "HVAC Maintenance Contract", description: "Annual maintenance agreement setup", scheduledAt: daysFromNow(7), duration: 120, serviceType: "Maintenance Agreement", estimatedValue: 2400, status: "scheduled", contactId: "ct_23", opportunityId: "opp_15", businessId: business.id, bookedById: manager.id } }),
    prisma.booking.create({ data: { id: "bk_05", title: "Commercial HVAC Checkup", description: "Quarterly commercial HVAC inspection", scheduledAt: daysFromNow(1), duration: 240, serviceType: "Commercial HVAC", estimatedValue: 1500, status: "scheduled", contactId: "ct_21", businessId: business.id, bookedById: manager.id } }),
    prisma.booking.create({ data: { id: "bk_06", title: "Drain Cleaning", description: "Main line snaking", scheduledAt: daysAgo(1), duration: 60, serviceType: "Plumbing", estimatedValue: 275, status: "completed", contactId: "ct_17", businessId: business.id, bookedById: csr2.id } }),
    prisma.booking.create({ data: { id: "bk_07", title: "Thermostat Install", description: "Smart thermostat installation", scheduledAt: daysAgo(3), duration: 60, serviceType: "HVAC", estimatedValue: 350, status: "completed", contactId: "ct_01", businessId: business.id, bookedById: csr1.id } }),
    prisma.booking.create({ data: { id: "bk_08", title: "Water Heater Flush", description: "Annual water heater maintenance", scheduledAt: daysFromNow(4), duration: 60, serviceType: "Plumbing", estimatedValue: 150, status: "scheduled", contactId: "ct_08", businessId: business.id, bookedById: csr2.id } }),
  ]);

  // Activity Logs
  await Promise.all([
    prisma.activityLog.create({ data: { action: "opportunity.created", entityType: "opportunity", entityId: "opp_01", metadata: JSON.stringify({ type: "missed_call", contact: "Robert Anderson" }), userId: null, businessId: business.id, createdAt: hoursAgo(2) } }),
    prisma.activityLog.create({ data: { action: "sms.sent", entityType: "opportunity", entityId: "opp_01", metadata: JSON.stringify({ template: "Missed Call Auto-Reply" }), userId: null, businessId: business.id, createdAt: hoursAgo(2) } }),
    prisma.activityLog.create({ data: { action: "opportunity.created", entityType: "opportunity", entityId: "opp_05", metadata: JSON.stringify({ type: "missed_call", contact: "Mark Walker" }), userId: null, businessId: business.id, createdAt: hoursAgo(1) } }),
    prisma.activityLog.create({ data: { action: "call.outbound", entityType: "contact", entityId: "ct_01", metadata: JSON.stringify({ duration: 240 }), userId: csr1.id, businessId: business.id, createdAt: hoursAgo(1) } }),
    prisma.activityLog.create({ data: { action: "sms.received", entityType: "opportunity", entityId: "opp_02", metadata: JSON.stringify({ from: "Carol Lopez" }), userId: null, businessId: business.id, createdAt: hoursAgo(6) } }),
    prisma.activityLog.create({ data: { action: "booking.created", entityType: "booking", entityId: "bk_01", metadata: JSON.stringify({ contact: "Daniel Brown", service: "Furnace Tune-Up" }), userId: csr2.id, businessId: business.id, createdAt: daysAgo(1) } }),
    prisma.activityLog.create({ data: { action: "opportunity.won", entityType: "opportunity", entityId: "opp_09", metadata: JSON.stringify({ value: 6200, type: "estimate_rescue" }), userId: csr1.id, businessId: business.id, createdAt: daysAgo(3) } }),
    prisma.activityLog.create({ data: { action: "estimate.stale", entityType: "estimate", entityId: "est_01", metadata: JSON.stringify({ amount: 3200, days: 12 }), userId: null, businessId: business.id, createdAt: daysAgo(5) } }),
    prisma.activityLog.create({ data: { action: "campaign.launched", entityType: "campaign", entityId: "camp_01", metadata: JSON.stringify({ name: "Winter Furnace Check-Up", targets: 45 }), userId: manager.id, businessId: business.id, createdAt: daysAgo(14) } }),
    prisma.activityLog.create({ data: { action: "opportunity.won", entityType: "opportunity", entityId: "opp_15", metadata: JSON.stringify({ value: 2400, type: "reactivation" }), userId: manager.id, businessId: business.id, createdAt: daysAgo(5) } }),
    prisma.activityLog.create({ data: { action: "booking.created", entityType: "booking", entityId: "bk_06", metadata: JSON.stringify({ contact: "Brian Hall", service: "Drain Cleaning" }), userId: csr2.id, businessId: business.id, createdAt: daysAgo(2) } }),
    prisma.activityLog.create({ data: { action: "estimate.sent", entityType: "estimate", entityId: "est_07", metadata: JSON.stringify({ amount: 2400, contact: "Brian Hall" }), userId: csr2.id, businessId: business.id, createdAt: daysAgo(2) } }),
  ]);

  // Integration Connections
  await Promise.all([
    prisma.integrationConnection.create({ data: { provider: "twilio", status: "connected", config: JSON.stringify({ accountSid: "mock_sid", phoneNumber: "+13135550100" }), lastSyncAt: hoursAgo(1), businessId: business.id } }),
    prisma.integrationConnection.create({ data: { provider: "google_calendar", status: "connected", lastSyncAt: hoursAgo(2), businessId: business.id } }),
    prisma.integrationConnection.create({ data: { provider: "jobber", status: "disconnected", businessId: business.id } }),
    prisma.integrationConnection.create({ data: { provider: "housecall_pro", status: "disconnected", businessId: business.id } }),
    prisma.integrationConnection.create({ data: { provider: "service_titan", status: "disconnected", businessId: business.id } }),
    prisma.integrationConnection.create({ data: { provider: "gmail", status: "pending", businessId: business.id } }),
    prisma.integrationConnection.create({ data: { provider: "outlook", status: "disconnected", businessId: business.id } }),
    prisma.integrationConnection.create({ data: { provider: "csv_import", status: "connected", businessId: business.id } }),
  ]);

  // Report Snapshots
  await Promise.all([
    prisma.reportSnapshot.create({ data: { periodStart: daysAgo(30), periodEnd: now, revenueInfluenced: 34750, revenueRecovered: 9139, opportunitiesCreated: 15, opportunitiesRecovered: 4, bookingsCreated: 8, avgResponseMinutes: 18, estimatesReopened: 3, customersReactivated: 3, missedCallsHandled: 5, conversionRate: 26.7, businessId: business.id } }),
    prisma.reportSnapshot.create({ data: { periodStart: daysAgo(60), periodEnd: daysAgo(30), revenueInfluenced: 28400, revenueRecovered: 7200, opportunitiesCreated: 12, opportunitiesRecovered: 3, bookingsCreated: 6, avgResponseMinutes: 24, estimatesReopened: 2, customersReactivated: 2, missedCallsHandled: 4, conversionRate: 25.0, businessId: business.id } }),
    prisma.reportSnapshot.create({ data: { periodStart: daysAgo(90), periodEnd: daysAgo(60), revenueInfluenced: 22100, revenueRecovered: 5800, opportunitiesCreated: 10, opportunitiesRecovered: 2, bookingsCreated: 5, avgResponseMinutes: 32, estimatesReopened: 1, customersReactivated: 1, missedCallsHandled: 3, conversionRate: 20.0, businessId: business.id } }),
  ]);

  console.log("Seed complete!");
  console.log(`  Business: ${business.name}`);
  console.log(`  Users: 4`);
  console.log(`  Contacts: ${contacts.length}`);
  console.log(`  Opportunities: ${opportunities.length}`);
  console.log(`  Call Events: 10`);
  console.log(`  Estimates: 10`);
  console.log(`  Templates: 6`);
  console.log(`  Campaigns: 4`);
  console.log(`  Bookings: 8`);
  console.log(`  Activity Logs: 12`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
