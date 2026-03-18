import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { subDays, subHours, addDays } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding demo tenant: North Shore Heating & Plumbing...");

  // ─── Business ─────────────────────────────────────────────────────────────
  const business = await prisma.business.upsert({
    where: { slug: "north-shore-heating" },
    update: {},
    create: {
      name: "North Shore Heating & Plumbing",
      slug: "north-shore-heating",
      industry: "multi_trade",
      phone: "(734) 555-0100",
      email: "info@northshoreht.com",
      website: "https://northshoreht.com",
      address: "1420 Harbor Dr",
      city: "Grosse Pointe",
      state: "MI",
      zip: "48230",
      timezone: "America/Detroit",
      staleEstimateDays: 7,
      attributionWindowDays: 14,
      highValueThreshold: 2500,
      missedCallSuppressionMin: 240,
    },
  });

  // ─── Users ────────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("demo1234", 10);

  const owner = await prisma.user.upsert({
    where: { email: "owner@northshoreht.com" },
    update: {},
    create: {
      name: "Mike Harrington",
      email: "owner@northshoreht.com",
      passwordHash,
      phone: "(734) 555-0101",
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@northshoreht.com" },
    update: {},
    create: {
      name: "Sarah Chen",
      email: "manager@northshoreht.com",
      passwordHash,
      phone: "(734) 555-0102",
    },
  });

  const csr = await prisma.user.upsert({
    where: { email: "csr@northshoreht.com" },
    update: {},
    create: {
      name: "James Rivera",
      email: "csr@northshoreht.com",
      passwordHash,
      phone: "(734) 555-0103",
    },
  });

  // Memberships
  await prisma.userMembership.upsert({
    where: { userId_businessId: { userId: owner.id, businessId: business.id } },
    update: {},
    create: { userId: owner.id, businessId: business.id, role: "owner" },
  });
  await prisma.userMembership.upsert({
    where: { userId_businessId: { userId: manager.id, businessId: business.id } },
    update: {},
    create: { userId: manager.id, businessId: business.id, role: "manager" },
  });
  await prisma.userMembership.upsert({
    where: { userId_businessId: { userId: csr.id, businessId: business.id } },
    update: {},
    create: { userId: csr.id, businessId: business.id, role: "csr" },
  });

  // ─── Location ─────────────────────────────────────────────────────────────
  await prisma.location.upsert({
    where: { id: "loc-main" },
    update: {},
    create: {
      id: "loc-main",
      businessId: business.id,
      name: "Main Office",
      address: "1420 Harbor Dr",
      city: "Grosse Pointe",
      state: "MI",
      zip: "48230",
      phone: "(734) 555-0100",
    },
  });

  // ─── Contacts (25) ────────────────────────────────────────────────────────
  const contactData = [
    { firstName: "Robert", lastName: "Caldwell", phone: "(734) 555-1001", email: "r.caldwell@email.com", type: "customer" as const, status: "active" as const, lastServiceAt: subDays(new Date(), 45), totalSpend: 4200, city: "Grosse Pointe" },
    { firstName: "Linda", lastName: "Morrison", phone: "(734) 555-1002", email: "linda.m@email.com", type: "customer" as const, status: "dormant" as const, lastServiceAt: subDays(new Date(), 420), totalSpend: 8750, city: "Harper Woods" },
    { firstName: "Tom", lastName: "Bancroft", phone: "(313) 555-1003", email: "tbancroft@email.com", type: "customer" as const, status: "dormant" as const, lastServiceAt: subDays(new Date(), 380), totalSpend: 3100, city: "St. Clair Shores" },
    { firstName: "Jennifer", lastName: "Walsh", phone: "(313) 555-1004", email: "jwalsh@email.com", type: "customer" as const, status: "active" as const, lastServiceAt: subDays(new Date(), 60), totalSpend: 6400, city: "Grosse Pointe" },
    { firstName: "David", lastName: "Kim", phone: "(248) 555-1005", email: "dkim@email.com", type: "lead" as const, status: "active" as const, lastServiceAt: null, totalSpend: 0, city: "Birmingham" },
    { firstName: "Patricia", lastName: "Nguyen", phone: "(248) 555-1006", email: "p.nguyen@email.com", type: "customer" as const, status: "dormant" as const, lastServiceAt: subDays(new Date(), 500), totalSpend: 2900, city: "Royal Oak" },
    { firstName: "Kevin", lastName: "Stern", phone: "(586) 555-1007", email: "kstern@email.com", type: "customer" as const, status: "active" as const, lastServiceAt: subDays(new Date(), 30), totalSpend: 11200, city: "Macomb" },
    { firstName: "Nancy", lastName: "Ostrowski", phone: "(586) 555-1008", email: "n.ostrowski@email.com", type: "customer" as const, status: "dormant" as const, lastServiceAt: subDays(new Date(), 460), totalSpend: 5600, city: "Warren" },
    { firstName: "Chris", lastName: "Delgado", phone: "(734) 555-1009", email: "c.delgado@email.com", type: "lead" as const, status: "active" as const, lastServiceAt: null, totalSpend: 0, city: "Ann Arbor" },
    { firstName: "Angela", lastName: "Foster", phone: "(734) 555-1010", email: "a.foster@email.com", type: "customer" as const, status: "active" as const, lastServiceAt: subDays(new Date(), 90), totalSpend: 3800, city: "Ypsilanti" },
    { firstName: "Mark", lastName: "Reynolds", phone: "(313) 555-1011", email: "m.reynolds@email.com", type: "customer" as const, status: "active" as const, lastServiceAt: subDays(new Date(), 15), totalSpend: 9300, city: "Detroit" },
    { firstName: "Diane", lastName: "Huang", phone: "(313) 555-1012", email: "d.huang@email.com", type: "former_customer" as const, status: "archived" as const, lastServiceAt: subDays(new Date(), 730), totalSpend: 1200, city: "Dearborn" },
    { firstName: "Paul", lastName: "Thornton", phone: "(248) 555-1013", email: "p.thornton@email.com", type: "customer" as const, status: "dormant" as const, lastServiceAt: subDays(new Date(), 395), totalSpend: 7100, city: "Troy" },
    { firstName: "Sandra", lastName: "Mitchell", phone: "(248) 555-1014", email: "s.mitchell@email.com", type: "customer" as const, status: "active" as const, lastServiceAt: subDays(new Date(), 20), totalSpend: 4500, city: "Bloomfield Hills" },
    { firstName: "Gary", lastName: "Larson", phone: "(586) 555-1015", email: "g.larson@email.com", type: "lead" as const, status: "active" as const, lastServiceAt: null, totalSpend: 0, city: "Sterling Heights" },
    { firstName: "Betty", lastName: "Yamamoto", phone: "(586) 555-1016", email: "b.yamamoto@email.com", type: "customer" as const, status: "dormant" as const, lastServiceAt: subDays(new Date(), 440), totalSpend: 6200, city: "Utica" },
    { firstName: "Steven", lastName: "Brooks", phone: "(734) 555-1017", email: "s.brooks@email.com", type: "customer" as const, status: "active" as const, lastServiceAt: subDays(new Date(), 55), totalSpend: 5100, city: "Livonia" },
    { firstName: "Donna", lastName: "Patel", phone: "(734) 555-1018", email: "d.patel@email.com", type: "customer" as const, status: "active" as const, lastServiceAt: subDays(new Date(), 10), totalSpend: 2700, city: "Plymouth" },
    { firstName: "Brian", lastName: "Kowalski", phone: "(313) 555-1019", email: "b.kowalski@email.com", type: "lead" as const, status: "active" as const, lastServiceAt: null, totalSpend: 0, city: "Hamtramck" },
    { firstName: "Carol", lastName: "Vasquez", phone: "(313) 555-1020", email: "c.vasquez@email.com", type: "customer" as const, status: "dormant" as const, lastServiceAt: subDays(new Date(), 415), totalSpend: 3400, city: "Eastpointe" },
    { firstName: "Eric", lastName: "Zimmerman", phone: "(248) 555-1021", email: "e.zimmerman@email.com", type: "customer" as const, status: "active" as const, lastServiceAt: subDays(new Date(), 35), totalSpend: 8900, city: "West Bloomfield" },
    { firstName: "Helen", lastName: "Murphy", phone: "(248) 555-1022", email: "h.murphy@email.com", type: "customer" as const, status: "dormant" as const, lastServiceAt: subDays(new Date(), 475), totalSpend: 4800, city: "Novi" },
    { firstName: "James", lastName: "Patterson", phone: "(586) 555-1023", email: "j.patterson@email.com", type: "customer" as const, status: "active" as const, lastServiceAt: subDays(new Date(), 70), totalSpend: 6700, city: "Clinton Township" },
    { firstName: "Ruth", lastName: "Sandoval", phone: "(586) 555-1024", email: "r.sandoval@email.com", type: "lead" as const, status: "active" as const, lastServiceAt: null, totalSpend: 0, city: "Roseville" },
    { firstName: "Scott", lastName: "Hoffman", phone: "(734) 555-1025", email: "s.hoffman@email.com", type: "customer" as const, status: "dormant" as const, lastServiceAt: subDays(new Date(), 410), totalSpend: 5500, city: "Garden City" },
  ];

  const contacts = [];
  for (const c of contactData) {
    const contact = await prisma.contact.upsert({
      where: { id: `contact-${c.phone.replace(/\D/g, "")}` },
      update: {},
      create: {
        id: `contact-${c.phone.replace(/\D/g, "")}`,
        businessId: business.id,
        ...c,
        tags: c.type === "customer" && c.totalSpend > 5000 ? ["high-value"] : [],
      },
    });
    contacts.push(contact);
  }

  // ─── Templates (4) ────────────────────────────────────────────────────────
  const templates = await Promise.all([
    prisma.template.upsert({
      where: { id: "tpl-missed-call-1" },
      update: {},
      create: {
        id: "tpl-missed-call-1",
        businessId: business.id,
        name: "Missed Call — Immediate Follow-Up",
        category: "missed_call",
        channelType: "sms",
        body: "Hi {{firstName}}, we missed your call at {{businessName}}! We want to help — reply here or call us back at {{businessPhone}}. We're available {{businessHours}}.",
        variables: ["firstName", "businessName", "businessPhone", "businessHours"],
        useCount: 38,
      },
    }),
    prisma.template.upsert({
      where: { id: "tpl-estimate-1" },
      update: {},
      create: {
        id: "tpl-estimate-1",
        businessId: business.id,
        name: "Estimate Follow-Up — Day 3",
        category: "estimate_rescue",
        channelType: "sms",
        body: "Hi {{firstName}}, just following up on your {{serviceType}} estimate for {{estimateAmount}}. Any questions? We're happy to walk you through it. — {{businessName}}",
        variables: ["firstName", "serviceType", "estimateAmount", "businessName"],
        useCount: 22,
      },
    }),
    prisma.template.upsert({
      where: { id: "tpl-reactivation-1" },
      update: {},
      create: {
        id: "tpl-reactivation-1",
        businessId: business.id,
        name: "Reactivation — Win-Back",
        category: "reactivation",
        channelType: "sms",
        body: "Hi {{firstName}}! It's been a while since we serviced your {{serviceType}}. {{businessName}} is here when you need us — schedule your next tune-up or inspection anytime. Reply YES to get started!",
        variables: ["firstName", "serviceType", "businessName"],
        useCount: 15,
      },
    }),
    prisma.template.upsert({
      where: { id: "tpl-booking-confirm-1" },
      update: {},
      create: {
        id: "tpl-booking-confirm-1",
        businessId: business.id,
        name: "Booking Confirmation",
        category: "booking",
        channelType: "sms",
        body: "Confirmed! Your appointment with {{businessName}} is scheduled for {{appointmentDate}} at {{appointmentTime}}. Our tech {{techName}} will arrive within the service window. Questions? Reply here.",
        variables: ["businessName", "appointmentDate", "appointmentTime", "techName"],
        useCount: 47,
      },
    }),
  ]);

  // ─── Campaigns (3) ────────────────────────────────────────────────────────
  const campaignMissedCall = await prisma.campaign.upsert({
    where: { id: "camp-missed-call" },
    update: {},
    create: {
      id: "camp-missed-call",
      businessId: business.id,
      name: "Missed Call Recovery — June",
      type: "missed_call_followup",
      status: "active",
      channelType: "sms",
      targetCount: 42,
      sentCount: 42,
      repliedCount: 18,
      bookedCount: 11,
      revenue: 24800,
      scheduledAt: subDays(new Date(), 20),
    },
  });

  const campaignEstimate = await prisma.campaign.upsert({
    where: { id: "camp-estimate" },
    update: {},
    create: {
      id: "camp-estimate",
      businessId: business.id,
      name: "Stale Estimate Rescue — Q2",
      type: "estimate_rescue",
      status: "active",
      channelType: "sms",
      targetCount: 28,
      sentCount: 28,
      repliedCount: 14,
      bookedCount: 9,
      revenue: 31500,
      scheduledAt: subDays(new Date(), 15),
    },
  });

  const campaignReactivation = await prisma.campaign.upsert({
    where: { id: "camp-reactivation" },
    update: {},
    create: {
      id: "camp-reactivation",
      businessId: business.id,
      name: "Dormant Customer Win-Back",
      type: "reactivation",
      status: "completed",
      channelType: "sms",
      targetCount: 65,
      sentCount: 65,
      repliedCount: 22,
      bookedCount: 8,
      revenue: 18200,
      scheduledAt: subDays(new Date(), 45),
      completedAt: subDays(new Date(), 10),
    },
  });

  // Campaign steps
  await Promise.all([
    prisma.campaignStep.upsert({
      where: { id: "step-mc-1" },
      update: {},
      create: {
        id: "step-mc-1",
        campaignId: campaignMissedCall.id,
        stepNumber: 1,
        delayDays: 0,
        delayHours: 0,
        channelType: "sms",
        templateId: templates[0].id,
        body: "Hi {{firstName}}, we missed your call at North Shore Heating & Plumbing! We want to help — reply here or call us back.",
        stopOnReply: true,
        stopOnBook: true,
      },
    }),
    prisma.campaignStep.upsert({
      where: { id: "step-mc-2" },
      update: {},
      create: {
        id: "step-mc-2",
        campaignId: campaignMissedCall.id,
        stepNumber: 2,
        delayDays: 1,
        delayHours: 0,
        channelType: "sms",
        body: "Still here when you're ready! North Shore Heating & Plumbing — reply anytime to get on our schedule.",
        stopOnReply: true,
        stopOnBook: true,
      },
    }),
    prisma.campaignStep.upsert({
      where: { id: "step-est-1" },
      update: {},
      create: {
        id: "step-est-1",
        campaignId: campaignEstimate.id,
        stepNumber: 1,
        delayDays: 0,
        delayHours: 0,
        channelType: "sms",
        templateId: templates[1].id,
        body: "Hi {{firstName}}, just checking in on your estimate from North Shore H&P. Ready to move forward? Reply YES!",
        stopOnReply: true,
        stopOnBook: true,
      },
    }),
  ]);

  // ─── Opportunities (12+) ──────────────────────────────────────────────────
  const opportunityData = [
    { contactIdx: 0, type: "missed_call" as const, status: "booked" as const, title: "Missed Call — Robert Caldwell", serviceType: "AC Tune-Up", estimatedValue: 189, actualValue: 189, createdAt: subDays(new Date(), 5) },
    { contactIdx: 4, type: "missed_call" as const, status: "responded" as const, title: "Missed Call — David Kim", serviceType: "HVAC Repair", estimatedValue: 450, actualValue: null, createdAt: subDays(new Date(), 2) },
    { contactIdx: 8, type: "missed_call" as const, status: "new" as const, title: "Missed Call — Chris Delgado", serviceType: null, estimatedValue: 0, actualValue: null, createdAt: subHours(new Date(), 3) },
    { contactIdx: 14, type: "missed_call" as const, status: "attempted" as const, title: "Missed Call — Gary Larson", serviceType: "Plumbing Repair", estimatedValue: 320, actualValue: null, createdAt: subDays(new Date(), 1) },
    { contactIdx: 1, type: "estimate_rescue" as const, status: "booked" as const, title: "Estimate Follow-Up — Furnace Replacement", serviceType: "Furnace Repair", estimatedValue: 4800, actualValue: 4800, createdAt: subDays(new Date(), 12) },
    { contactIdx: 6, type: "estimate_rescue" as const, status: "responded" as const, title: "Estimate Follow-Up — Water Heater Install", serviceType: "Water Heater", estimatedValue: 1650, actualValue: null, createdAt: subDays(new Date(), 8) },
    { contactIdx: 12, type: "estimate_rescue" as const, status: "new" as const, title: "Estimate Follow-Up — Panel Upgrade", serviceType: "Panel Upgrade", estimatedValue: 3200, actualValue: null, createdAt: subDays(new Date(), 14) },
    { contactIdx: 20, type: "estimate_rescue" as const, status: "new" as const, title: "Estimate Follow-Up — AC Replacement", serviceType: "HVAC Installation", estimatedValue: 6400, actualValue: null, createdAt: subDays(new Date(), 9) },
    { contactIdx: 1, type: "reactivation" as const, status: "booked" as const, title: "Reactivation — Linda Morrison", serviceType: "HVAC Repair", estimatedValue: 2800, actualValue: 2800, createdAt: subDays(new Date(), 18) },
    { contactIdx: 7, type: "reactivation" as const, status: "responded" as const, title: "Reactivation — Nancy Ostrowski", serviceType: "Maintenance Plan", estimatedValue: 299, actualValue: null, createdAt: subDays(new Date(), 10) },
    { contactIdx: 2, type: "reactivation" as const, status: "responded" as const, title: "Reactivation — Tom Bancroft", serviceType: "AC Tune-Up", estimatedValue: 189, actualValue: null, createdAt: subDays(new Date(), 7) },
    { contactIdx: 5, type: "reactivation" as const, status: "attempted" as const, title: "Reactivation — Patricia Nguyen", serviceType: "Furnace Repair", estimatedValue: 850, actualValue: null, createdAt: subDays(new Date(), 4) },
    { contactIdx: 19, type: "reactivation" as const, status: "new" as const, title: "Reactivation — Carol Vasquez", serviceType: "Plumbing Repair", estimatedValue: 420, actualValue: null, createdAt: subDays(new Date(), 3) },
  ];

  const opportunities = [];
  for (let i = 0; i < opportunityData.length; i++) {
    const od = opportunityData[i];
    const contact = contacts[od.contactIdx];
    const opp = await prisma.opportunity.upsert({
      where: { id: `opp-${i + 1}` },
      update: {},
      create: {
        id: `opp-${i + 1}`,
        businessId: business.id,
        contactId: contact.id,
        assignedToId: i % 3 === 0 ? manager.id : i % 3 === 1 ? csr.id : null,
        type: od.type,
        status: od.status,
        title: od.title,
        serviceType: od.serviceType ?? undefined,
        estimatedValue: od.estimatedValue,
        actualValue: od.actualValue ?? undefined,
        attributionMethod: od.actualValue ? "direct" : undefined,
        source: od.type === "missed_call" ? "missed_call" : od.type === "estimate_rescue" ? "estimate" : "reactivation_campaign",
        followUpCount: od.status === "new" ? 0 : od.status === "attempted" ? 1 : 2,
        lastContactAt: od.status !== "new" ? subDays(new Date(), Math.floor(Math.random() * 5)) : null,
        resolvedAt: ["booked", "closed"].includes(od.status) ? subDays(new Date(), Math.floor(Math.random() * 10)) : null,
        createdAt: od.createdAt,
      },
    });
    opportunities.push(opp);
  }

  // Opportunity notes
  await Promise.all([
    prisma.opportunityNote.upsert({
      where: { id: "note-1" },
      update: {},
      create: {
        id: "note-1",
        opportunityId: opportunities[0].id,
        authorName: "James Rivera",
        authorId: csr.id,
        content: "Customer confirmed AC isn't cooling properly. Booked for Thursday morning.",
        createdAt: subDays(new Date(), 4),
      },
    }),
    prisma.opportunityNote.upsert({
      where: { id: "note-2" },
      update: {},
      create: {
        id: "note-2",
        opportunityId: opportunities[1].id,
        authorName: "Sarah Chen",
        authorId: manager.id,
        content: "Customer called back — sounds like compressor issue. Estimate pending.",
        createdAt: subDays(new Date(), 1),
      },
    }),
    prisma.opportunityNote.upsert({
      where: { id: "note-3" },
      update: {},
      create: {
        id: "note-3",
        opportunityId: opportunities[4].id,
        authorName: "Sarah Chen",
        authorId: manager.id,
        content: "Furnace replacement confirmed. Customer went with the Bryant 80% efficiency model. Signed contract.",
        createdAt: subDays(new Date(), 11),
      },
    }),
  ]);

  // ─── Call Events (8+) ─────────────────────────────────────────────────────
  const callEventData = [
    { contactIdx: 0, opportunityIdx: 0, callerPhone: "(734) 555-1001", status: "missed", isAfterHours: false, duration: null, createdAt: subDays(new Date(), 5) },
    { contactIdx: 4, opportunityIdx: 1, callerPhone: "(248) 555-1005", status: "missed", isAfterHours: false, duration: null, createdAt: subDays(new Date(), 2) },
    { contactIdx: 8, opportunityIdx: 2, callerPhone: "(734) 555-1009", status: "missed", isAfterHours: true, duration: null, createdAt: subHours(new Date(), 3) },
    { contactIdx: 14, opportunityIdx: 3, callerPhone: "(586) 555-1015", status: "missed", isAfterHours: false, duration: null, createdAt: subDays(new Date(), 1) },
    { contactIdx: 10, opportunityIdx: null, callerPhone: "(313) 555-1011", status: "answered", isAfterHours: false, duration: 245, createdAt: subDays(new Date(), 3) },
    { contactIdx: 13, opportunityIdx: null, callerPhone: "(248) 555-1014", status: "answered", isAfterHours: false, duration: 182, createdAt: subDays(new Date(), 6) },
    { contactIdx: 3, opportunityIdx: null, callerPhone: "(313) 555-1004", status: "answered", isAfterHours: false, duration: 310, createdAt: subDays(new Date(), 8) },
    { contactIdx: 6, opportunityIdx: null, callerPhone: "(248) 555-1007", status: "missed", isAfterHours: false, duration: null, createdAt: subDays(new Date(), 4) },
    { contactIdx: 23, opportunityIdx: null, callerPhone: "(586) 555-1024", status: "missed", isAfterHours: true, duration: null, createdAt: subHours(new Date(), 8) },
  ];

  for (let i = 0; i < callEventData.length; i++) {
    const cd = callEventData[i];
    await prisma.callEvent.upsert({
      where: { id: `call-${i + 1}` },
      update: {},
      create: {
        id: `call-${i + 1}`,
        businessId: business.id,
        contactId: contacts[cd.contactIdx].id,
        opportunityId: cd.opportunityIdx !== null ? opportunities[cd.opportunityIdx].id : null,
        callerPhone: cd.callerPhone,
        direction: "inbound",
        status: cd.status,
        isAfterHours: cd.isAfterHours,
        isAbandoned: false,
        duration: cd.duration,
        createdAt: cd.createdAt,
      },
    });
  }

  // ─── Estimates (8+) ───────────────────────────────────────────────────────
  const estimateData = [
    { contactIdx: 1, opportunityIdx: 4, title: "Furnace Replacement — Bryant 80%", amount: 4800, serviceType: "Furnace Repair", status: "booked" as const, sentAt: subDays(new Date(), 20), bookedAt: subDays(new Date(), 12) },
    { contactIdx: 6, opportunityIdx: 5, title: "50-Gal Water Heater Install", amount: 1650, serviceType: "Water Heater", status: "responded" as const, sentAt: subDays(new Date(), 12), respondedAt: subDays(new Date(), 9) },
    { contactIdx: 12, opportunityIdx: 6, title: "200A Panel Upgrade", amount: 3200, serviceType: "Panel Upgrade", status: "stale" as const, sentAt: subDays(new Date(), 21), expiresAt: subDays(new Date(), 7) },
    { contactIdx: 20, opportunityIdx: 7, title: "2.5-Ton Carrier AC Replacement", amount: 6400, serviceType: "HVAC Installation", status: "stale" as const, sentAt: subDays(new Date(), 16), expiresAt: subDays(new Date(), 2) },
    { contactIdx: 3, opportunityIdx: null, title: "Whole-Home Drain Cleaning", amount: 380, serviceType: "Drain Cleaning", status: "open" as const, sentAt: subDays(new Date(), 3) },
    { contactIdx: 10, opportunityIdx: null, title: "Boiler Tune-Up & Inspection", amount: 225, serviceType: "HVAC Repair", status: "open" as const, sentAt: subDays(new Date(), 2) },
    { contactIdx: 22, opportunityIdx: null, title: "Mini-Split Install — Sunroom", amount: 3800, serviceType: "HVAC Installation", status: "stale" as const, sentAt: subDays(new Date(), 18), expiresAt: subDays(new Date(), 4) },
    { contactIdx: 16, opportunityIdx: null, title: "Electrical Inspection & Permit Work", amount: 1100, serviceType: "Electrical Repair", status: "open" as const, sentAt: subDays(new Date(), 5) },
    { contactIdx: 17, opportunityIdx: null, title: "Annual Maintenance Plan Renewal", amount: 299, serviceType: "Maintenance Plan", status: "stale" as const, sentAt: subDays(new Date(), 10), expiresAt: subDays(new Date(), 3) },
  ];

  for (let i = 0; i < estimateData.length; i++) {
    const ed = estimateData[i];
    await prisma.estimate.upsert({
      where: { id: `est-${i + 1}` },
      update: {},
      create: {
        id: `est-${i + 1}`,
        businessId: business.id,
        contactId: contacts[ed.contactIdx].id,
        opportunityId: ed.opportunityIdx !== null ? opportunities[ed.opportunityIdx].id : null,
        title: ed.title,
        amount: ed.amount,
        serviceType: ed.serviceType,
        status: ed.status,
        sentAt: ed.sentAt,
        respondedAt: (ed as any).respondedAt ?? null,
        bookedAt: (ed as any).bookedAt ?? null,
        expiresAt: (ed as any).expiresAt ?? null,
        source: "jobber",
      },
    });
  }

  // ─── Bookings (6+) ────────────────────────────────────────────────────────
  const bookingData = [
    { contactIdx: 0, opportunityIdx: 0, title: "AC Tune-Up", serviceType: "AC Tune-Up", scheduledAt: addDays(new Date(), 2), revenue: 189, sourceType: "missed_call" as const, attributionMethod: "direct" as const },
    { contactIdx: 1, opportunityIdx: 8, title: "Furnace Replacement Install Day", serviceType: "Furnace Repair", scheduledAt: subDays(new Date(), 3), completedAt: subDays(new Date(), 3), revenue: 4800, sourceType: "estimate_rescue" as const, attributionMethod: "direct" as const },
    { contactIdx: 1, opportunityIdx: 8, title: "Dormant Win-Back — HVAC Repair", serviceType: "HVAC Repair", scheduledAt: subDays(new Date(), 12), completedAt: subDays(new Date(), 12), revenue: 2800, sourceType: "reactivation" as const, attributionMethod: "direct" as const },
    { contactIdx: 6, opportunityIdx: null, title: "Spring HVAC Maintenance", serviceType: "AC Tune-Up", scheduledAt: subDays(new Date(), 8), completedAt: subDays(new Date(), 8), revenue: 189, sourceType: "manual" as const, attributionMethod: undefined },
    { contactIdx: 10, opportunityIdx: null, title: "Boiler Repair & Parts", serviceType: "HVAC Repair", scheduledAt: subDays(new Date(), 5), completedAt: subDays(new Date(), 5), revenue: 760, sourceType: "manual" as const, attributionMethod: undefined },
    { contactIdx: 13, opportunityIdx: null, title: "Plumbing Leak Repair", serviceType: "Plumbing Repair", scheduledAt: subDays(new Date(), 15), completedAt: subDays(new Date(), 15), revenue: 540, sourceType: "manual" as const, attributionMethod: undefined },
    { contactIdx: 3, opportunityIdx: null, title: "Emergency AC Service", serviceType: "Emergency Service", scheduledAt: subDays(new Date(), 22), completedAt: subDays(new Date(), 22), revenue: 380, sourceType: "manual" as const, attributionMethod: undefined },
  ];

  for (let i = 0; i < bookingData.length; i++) {
    const bd = bookingData[i];
    await prisma.booking.upsert({
      where: { id: `booking-${i + 1}` },
      update: {},
      create: {
        id: `booking-${i + 1}`,
        businessId: business.id,
        contactId: contacts[bd.contactIdx].id,
        opportunityId: bd.opportunityIdx !== null ? opportunities[bd.opportunityIdx].id : null,
        title: bd.title,
        serviceType: bd.serviceType,
        scheduledAt: bd.scheduledAt,
        completedAt: bd.completedAt ?? null,
        revenue: bd.revenue,
        sourceType: bd.sourceType,
        attributionMethod: bd.attributionMethod ?? null,
      },
    });
  }

  // ─── Message Events ────────────────────────────────────────────────────────
  const messageData = [
    { contactIdx: 0, opportunityIdx: 0, contactPhone: "(734) 555-1001", direction: "outbound" as const, body: "Hi Robert, we missed your call at North Shore Heating & Plumbing! We want to help — reply here or call us back.", status: "delivered" as const, createdAt: subDays(new Date(), 5) },
    { contactIdx: 0, opportunityIdx: 0, contactPhone: "(734) 555-1001", direction: "inbound" as const, body: "Hey yes! My AC has been struggling. Can you come Thursday?", status: "delivered" as const, createdAt: subDays(new Date(), 5) },
    { contactIdx: 4, opportunityIdx: 1, contactPhone: "(248) 555-1005", direction: "outbound" as const, body: "Hi David, we missed your call at North Shore Heating & Plumbing! We'd love to help — reply here.", status: "delivered" as const, createdAt: subDays(new Date(), 2) },
    { contactIdx: 4, opportunityIdx: 1, contactPhone: "(248) 555-1005", direction: "inbound" as const, body: "My AC stopped working. Need emergency service if possible", status: "delivered" as const, createdAt: subDays(new Date(), 2) },
    { contactIdx: 8, opportunityIdx: 2, contactPhone: "(734) 555-1009", direction: "outbound" as const, body: "Hi Chris, we saw your missed call after hours. North Shore H&P — we'll be in touch first thing tomorrow!", status: "delivered" as const, createdAt: subHours(new Date(), 3) },
    { contactIdx: 1, opportunityIdx: 4, contactPhone: "(734) 555-1002", direction: "outbound" as const, body: "Hi Linda, following up on your furnace estimate for $4,800. Any questions? We're happy to walk you through it.", status: "delivered" as const, createdAt: subDays(new Date(), 14) },
    { contactIdx: 1, opportunityIdx: 4, contactPhone: "(734) 555-1002", direction: "inbound" as const, body: "Yes please book it! We can do next Monday", status: "delivered" as const, createdAt: subDays(new Date(), 13) },
  ];

  for (let i = 0; i < messageData.length; i++) {
    const md = messageData[i];
    await prisma.messageEvent.upsert({
      where: { id: `msg-${i + 1}` },
      update: {},
      create: {
        id: `msg-${i + 1}`,
        businessId: business.id,
        contactPhone: md.contactPhone,
        opportunityId: opportunities[md.opportunityIdx].id,
        direction: md.direction,
        channel: "sms",
        body: md.body,
        status: md.status,
        externalId: `SM${Math.random().toString(36).slice(2, 18).toUpperCase()}`,
        sentAt: md.createdAt,
        deliveredAt: new Date(md.createdAt.getTime() + 3000),
        createdAt: md.createdAt,
      },
    });
  }

  // ─── Activity Log ─────────────────────────────────────────────────────────
  const activityData = [
    { action: "opportunity_booked", description: "Robert Caldwell booked AC Tune-Up via missed call recovery", contactIdx: 0, opportunityIdx: 0, userId: csr.id, createdAt: subDays(new Date(), 4) },
    { action: "sms_reply", description: "David Kim replied to missed call follow-up", contactIdx: 4, opportunityIdx: 1, userId: null, createdAt: subDays(new Date(), 2) },
    { action: "estimate_rescue_booked", description: "Linda Morrison booked furnace replacement ($4,800)", contactIdx: 1, opportunityIdx: 4, userId: manager.id, createdAt: subDays(new Date(), 11) },
    { action: "reactivation_booked", description: "Linda Morrison booked HVAC repair from reactivation ($2,800)", contactIdx: 1, opportunityIdx: 8, userId: manager.id, createdAt: subDays(new Date(), 12) },
    { action: "opportunity_created", description: "Missed call opportunity created for Chris Delgado", contactIdx: 8, opportunityIdx: 2, userId: null, createdAt: subHours(new Date(), 3) },
    { action: "sms_sent", description: "Reactivation message sent to Patricia Nguyen", contactIdx: 5, opportunityIdx: 11, userId: null, createdAt: subDays(new Date(), 4) },
    { action: "note_added", description: "Note added to Kevin Stern opportunity by Sarah Chen", contactIdx: 6, opportunityIdx: 5, userId: manager.id, createdAt: subDays(new Date(), 7) },
    { action: "estimate_marked_stale", description: "Estimate for 200A Panel Upgrade marked stale (21 days)", contactIdx: 12, opportunityIdx: 6, userId: null, createdAt: subDays(new Date(), 7) },
  ];

  for (let i = 0; i < activityData.length; i++) {
    const ad = activityData[i];
    await prisma.activityLog.upsert({
      where: { id: `activity-${i + 1}` },
      update: {},
      create: {
        id: `activity-${i + 1}`,
        businessId: business.id,
        contactId: contacts[ad.contactIdx].id,
        opportunityId: opportunities[ad.opportunityIdx].id,
        userId: ad.userId,
        action: ad.action,
        description: ad.description,
        createdAt: ad.createdAt,
      },
    });
  }

  // ─── Integration Connections (scaffold) ───────────────────────────────────
  await Promise.all([
    prisma.integrationConnection.upsert({
      where: { businessId_provider: { businessId: business.id, provider: "twilio" } },
      update: {},
      create: {
        businessId: business.id,
        provider: "twilio",
        status: "connected",
        lastSyncAt: subHours(new Date(), 1),
        settings: { fromNumber: "+17345550199", webhookConfigured: true },
      },
    }),
    prisma.integrationConnection.upsert({
      where: { businessId_provider: { businessId: business.id, provider: "jobber" } },
      update: {},
      create: {
        businessId: business.id,
        provider: "jobber",
        status: "connected",
        lastSyncAt: subHours(new Date(), 2),
        settings: { syncEstimates: true, syncBookings: true },
      },
    }),
    prisma.integrationConnection.upsert({
      where: { businessId_provider: { businessId: business.id, provider: "housecall_pro" } },
      update: {},
      create: {
        businessId: business.id,
        provider: "housecall_pro",
        status: "disconnected",
      },
    }),
    prisma.integrationConnection.upsert({
      where: { businessId_provider: { businessId: business.id, provider: "servicetitan" } },
      update: {},
      create: {
        businessId: business.id,
        provider: "servicetitan",
        status: "disconnected",
      },
    }),
    prisma.integrationConnection.upsert({
      where: { businessId_provider: { businessId: business.id, provider: "gmail" } },
      update: {},
      create: {
        businessId: business.id,
        provider: "gmail",
        status: "pending",
      },
    }),
    prisma.integrationConnection.upsert({
      where: { businessId_provider: { businessId: business.id, provider: "csv" } },
      update: {},
      create: {
        businessId: business.id,
        provider: "csv",
        status: "connected",
        lastSyncAt: subDays(new Date(), 7),
      },
    }),
  ]);

  // ─── Report Snapshot ──────────────────────────────────────────────────────
  await prisma.reportSnapshot.upsert({
    where: { id: "report-may" },
    update: {},
    create: {
      id: "report-may",
      businessId: business.id,
      period: "monthly",
      startDate: subDays(new Date(), 60),
      endDate: subDays(new Date(), 30),
      revenueInfluenced: 68400,
      revenueDirect: 41200,
      opportunitiesCreated: 38,
      opportunitiesBooked: 22,
      bookingsCreated: 22,
      avgResponseTimeMin: 4.7,
      estimatesReopened: 9,
      customersReactivated: 8,
    },
  });

  await prisma.reportSnapshot.upsert({
    where: { id: "report-june" },
    update: {},
    create: {
      id: "report-june",
      businessId: business.id,
      period: "monthly",
      startDate: subDays(new Date(), 30),
      endDate: new Date(),
      revenueInfluenced: 74500,
      revenueDirect: 48300,
      opportunitiesCreated: 45,
      opportunitiesBooked: 28,
      bookingsCreated: 28,
      avgResponseTimeMin: 4.2,
      estimatesReopened: 11,
      customersReactivated: 8,
    },
  });

  console.log("✅ Seed complete!");
  console.log("\nDemo credentials:");
  console.log("  Owner:   owner@northshoreht.com / demo1234");
  console.log("  Manager: manager@northshoreht.com / demo1234");
  console.log("  CSR:     csr@northshoreht.com / demo1234");
  console.log(`\nBusiness: North Shore Heating & Plumbing (${business.id})`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
