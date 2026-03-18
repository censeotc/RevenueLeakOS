import type {
  Opportunity,
  EstimateRecord,
  CallRecord,
  SmsThread,
  Campaign,
  ContactRecord,
  TemplateRecord,
  IntegrationItem,
  ReactivationSegment,
} from "@/types/revenue";

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();

// ─── Contacts ─────────────────────────────────────────────────────────────────

export const demoContacts: ContactRecord[] = [
  {
    id: "c1", firstName: "Robert", lastName: "Davis",
    phone: "+15550002001", email: "robert.davis@example.com",
    city: "Austin", state: "TX", tags: ["hvac", "residential"],
    optedInSms: true, opportunityCount: 2, estimateCount: 1,
    createdAt: daysAgo(90), updatedAt: daysAgo(3),
  },
  {
    id: "c2", firstName: "Jennifer", lastName: "Martinez",
    phone: "+15550002002", email: "jennifer.m@example.com",
    city: "Austin", state: "TX", tags: ["hvac", "commercial"],
    optedInSms: true, opportunityCount: 1, estimateCount: 2,
    createdAt: daysAgo(60), updatedAt: daysAgo(1),
  },
  {
    id: "c3", firstName: "William", lastName: "Brown",
    phone: "+15550002003", email: "wbrown@example.com",
    city: "Round Rock", state: "TX", tags: ["residential", "vip"],
    optedInSms: false, opportunityCount: 1, estimateCount: 1,
    createdAt: daysAgo(120), updatedAt: daysAgo(5),
  },
  {
    id: "c4", firstName: "Amanda", lastName: "Wilson",
    phone: "+15550002004", email: "amandaw@example.com",
    city: "Austin", state: "TX", tags: ["hvac"],
    optedInSms: true, opportunityCount: 0, estimateCount: 1,
    createdAt: daysAgo(45), updatedAt: daysAgo(2),
  },
  {
    id: "c5", firstName: "Christopher", lastName: "Taylor",
    phone: "+15550002005", email: "ctaylor@example.com",
    city: "Cedar Park", state: "TX", tags: ["hvac", "residential"],
    optedInSms: true, opportunityCount: 1, estimateCount: 1,
    createdAt: daysAgo(30), updatedAt: hoursAgo(12),
  },
  {
    id: "c6", firstName: "Jessica", lastName: "Anderson",
    phone: "+15550002006", email: "jessica.a@example.com",
    city: "Austin", state: "TX", tags: ["residential"],
    optedInSms: true, opportunityCount: 1, estimateCount: 1,
    createdAt: daysAgo(80), updatedAt: daysAgo(4),
  },
  {
    id: "c7", firstName: "Daniel", lastName: "Thomas",
    phone: "+15550002007", email: "dthomas@example.com",
    city: "Austin", state: "TX", tags: ["commercial"],
    optedInSms: false, opportunityCount: 1, estimateCount: 1,
    createdAt: daysAgo(15), updatedAt: daysAgo(1),
  },
  {
    id: "c8", firstName: "Ashley", lastName: "Jackson",
    phone: "+15550002008", email: "ajackson@example.com",
    city: "Georgetown", state: "TX", tags: ["hvac", "vip"],
    optedInSms: true, opportunityCount: 0, estimateCount: 1,
    createdAt: daysAgo(200), updatedAt: daysAgo(30),
  },
];

// ─── Estimates ─────────────────────────────────────────────────────────────────

export const demoEstimates: EstimateRecord[] = [
  {
    id: "e1", title: "AC Unit Replacement", amount: 4200, status: "PENDING",
    createdAt: daysAgo(5), updatedAt: daysAgo(5),
    contact: { id: "c1", firstName: "Robert", lastName: "Davis", phone: "+15550002001" },
  },
  {
    id: "e2", title: "Furnace Installation", amount: 3800, status: "VIEWED",
    viewedAt: daysAgo(2), createdAt: daysAgo(7), updatedAt: daysAgo(2),
    contact: { id: "c2", firstName: "Jennifer", lastName: "Martinez", phone: "+15550002002" },
  },
  {
    id: "e3", title: "HVAC System Overhaul", amount: 8500, status: "PENDING",
    createdAt: daysAgo(6), updatedAt: daysAgo(6),
    contact: { id: "c3", firstName: "William", lastName: "Brown", phone: "+15550002003" },
  },
  {
    id: "e4", title: "Duct Cleaning & Repair", amount: 1200, status: "DECLINED",
    respondedAt: daysAgo(1), createdAt: daysAgo(10), updatedAt: daysAgo(1),
    contact: { id: "c4", firstName: "Amanda", lastName: "Wilson", phone: "+15550002004" },
  },
  {
    id: "e5", title: "Mini-Split Installation", amount: 2900, status: "ACCEPTED",
    respondedAt: daysAgo(3), createdAt: daysAgo(8), updatedAt: daysAgo(3),
    contact: { id: "c5", firstName: "Christopher", lastName: "Taylor", phone: "+15550002005" },
  },
  {
    id: "e6", title: "Heat Pump Replacement", amount: 5600, status: "PENDING",
    createdAt: daysAgo(4), updatedAt: daysAgo(4),
    contact: { id: "c6", firstName: "Jessica", lastName: "Anderson", phone: "+15550002006" },
  },
  {
    id: "e7", title: "Commercial HVAC Service", amount: 12000, status: "VIEWED",
    viewedAt: daysAgo(1), createdAt: daysAgo(5), updatedAt: daysAgo(1),
    contact: { id: "c7", firstName: "Daniel", lastName: "Thomas", phone: "+15550002007" },
  },
  {
    id: "e8", title: "Thermostat Upgrade", amount: 450, status: "EXPIRED",
    createdAt: daysAgo(45), updatedAt: daysAgo(30),
    contact: { id: "c8", firstName: "Ashley", lastName: "Jackson", phone: "+15550002008" },
  },
];

// ─── Opportunities ─────────────────────────────────────────────────────────────

export const demoOpportunities: Opportunity[] = [
  {
    id: "o1", type: "UNANSWERED_ESTIMATE", status: "OPEN", value: 4200,
    description: "Estimate for AC unit replacement sent 3 days ago — no response",
    contact: { id: "c1", firstName: "Robert", lastName: "Davis", phone: "+15550002001" },
    estimate: demoEstimates[0],
    notes: [{ id: "n1", content: "Left voicemail, will follow up via SMS", createdAt: daysAgo(2), authorName: "Mike" }],
    createdAt: daysAgo(5), updatedAt: daysAgo(2),
  },
  {
    id: "o2", type: "MISSED_CALL", status: "OPEN", value: 3800,
    description: "Missed inbound call at 2:15 PM — likely service inquiry",
    contact: { id: "c2", firstName: "Jennifer", lastName: "Martinez", phone: "+15550002002" },
    notes: [],
    createdAt: hoursAgo(4), updatedAt: hoursAgo(4),
  },
  {
    id: "o3", type: "UNANSWERED_ESTIMATE", status: "OPEN", value: 8500,
    description: "Large commercial HVAC estimate — no response after 5 days",
    contact: { id: "c3", firstName: "William", lastName: "Brown", phone: "+15550002003" },
    estimate: demoEstimates[2],
    notes: [{ id: "n2", content: "Second follow-up sent", createdAt: daysAgo(1), authorName: "Mike" }],
    createdAt: daysAgo(6), updatedAt: daysAgo(1),
  },
  {
    id: "o4", type: "REACTIVATION", status: "IN_PROGRESS", value: 2200,
    description: "Customer last serviced 14 months ago — seasonal maintenance opportunity",
    contact: { id: "c4", firstName: "Amanda", lastName: "Wilson", phone: "+15550002004" },
    notes: [],
    createdAt: daysAgo(2), updatedAt: hoursAgo(8),
  },
  {
    id: "o5", type: "MISSED_CALL", status: "WON", value: 2900,
    description: "Missed call recovered via follow-up SMS — mini-split installation booked",
    contact: { id: "c5", firstName: "Christopher", lastName: "Taylor", phone: "+15550002005" },
    recoveredAt: daysAgo(3),
    notes: [],
    createdAt: daysAgo(8), updatedAt: daysAgo(3),
  },
  {
    id: "o6", type: "UNANSWERED_ESTIMATE", status: "OPEN", value: 5600,
    description: "Heat pump estimate — viewed but no response in 4 days",
    contact: { id: "c6", firstName: "Jessica", lastName: "Anderson", phone: "+15550002006" },
    estimate: demoEstimates[5],
    notes: [],
    createdAt: daysAgo(4), updatedAt: daysAgo(4),
  },
];

// ─── Calls ────────────────────────────────────────────────────────────────────

export const demoCalls: CallRecord[] = [
  {
    id: "cl1", type: "SMS", direction: "OUTBOUND", status: "DELIVERED",
    body: "Hi Robert, sorry we missed your call! We're here to help — reply or call us back.",
    createdAt: hoursAgo(4), contactName: "Robert Davis", phone: "+15550002001",
  },
  {
    id: "cl2", type: "VOICE", direction: "INBOUND", status: "NO_ANSWER",
    duration: undefined, createdAt: hoursAgo(4), contactName: "Robert Davis", phone: "+15550002001",
  },
  {
    id: "cl3", type: "SMS", direction: "INBOUND", status: "DELIVERED",
    body: "Hey! Yes, I need someone to look at my AC. Can you come Wednesday?",
    createdAt: hoursAgo(3), contactName: "Robert Davis", phone: "+15550002001",
  },
  {
    id: "cl4", type: "SMS", direction: "OUTBOUND", status: "DELIVERED",
    body: "Hi Jennifer, just following up on your estimate for the Furnace Installation ($3,800). Any questions?",
    createdAt: daysAgo(2), contactName: "Jennifer Martinez", phone: "+15550002002",
  },
  {
    id: "cl5", type: "VOICE", direction: "OUTBOUND", status: "COMPLETED",
    duration: 187, createdAt: daysAgo(1), contactName: "William Brown", phone: "+15550002003",
  },
];

// ─── SMS Threads ───────────────────────────────────────────────────────────────

export const demoSmsThreads: SmsThread[] = [
  {
    id: "t1", contactName: "Robert Davis", phone: "+15550002001",
    lastMessage: "Hey! Yes, I need someone to look at my AC.",
    lastMessageAt: hoursAgo(3), unreadCount: 1,
  },
  {
    id: "t2", contactName: "Jennifer Martinez", phone: "+15550002002",
    lastMessage: "Hi Jennifer, following up on your estimate...",
    lastMessageAt: daysAgo(2), unreadCount: 0,
  },
  {
    id: "t3", contactName: "Christopher Taylor", phone: "+15550002005",
    lastMessage: "Sounds great, Wednesday at 2 PM works!",
    lastMessageAt: daysAgo(3), unreadCount: 0,
  },
];

// ─── Campaigns ────────────────────────────────────────────────────────────────

export const demoCampaigns: Campaign[] = [
  {
    id: "camp1", name: "Estimate Follow-Up Sequence", type: "ESTIMATE_FOLLOWUP",
    status: "ACTIVE", description: "Automatically follows up on unanswered estimates over 7 days",
    launchedAt: daysAgo(30), enrolledCount: 47, convertedCount: 13,
    createdAt: daysAgo(30), updatedAt: daysAgo(1),
  },
  {
    id: "camp2", name: "12-Month Reactivation", type: "REACTIVATION",
    status: "ACTIVE", description: "Re-engages customers who haven't booked in 12+ months",
    launchedAt: daysAgo(60), enrolledCount: 124, convertedCount: 26,
    createdAt: daysAgo(60), updatedAt: daysAgo(3),
  },
  {
    id: "camp3", name: "Missed Call Recovery", type: "MISSED_CALL",
    status: "ACTIVE", description: "Text-back within 60 seconds of a missed call",
    launchedAt: daysAgo(90), enrolledCount: 48, convertedCount: 12,
    createdAt: daysAgo(90), updatedAt: daysAgo(0),
  },
  {
    id: "camp4", name: "Review Request", type: "REVIEW_REQUEST",
    status: "PAUSED", description: "Request a Google review after job completion",
    launchedAt: daysAgo(14), enrolledCount: 22, convertedCount: 9,
    createdAt: daysAgo(14), updatedAt: daysAgo(7),
  },
];

// ─── Templates ────────────────────────────────────────────────────────────────

export const demoTemplates: TemplateRecord[] = [
  {
    id: "t1", name: "Estimate Follow-Up #1", type: "SMS",
    body: "Hi {{firstName}}, this is {{businessName}}. I wanted to follow up on the estimate we sent for {{estimateTitle}}. Any questions? Reply or call {{businessPhone}}.",
    variables: ["firstName", "businessName", "estimateTitle", "businessPhone"],
    isSystem: true, createdAt: daysAgo(30), updatedAt: daysAgo(30),
  },
  {
    id: "t2", name: "Estimate Follow-Up #2", type: "SMS",
    body: "Hi {{firstName}}, just one more follow-up on your estimate for {{estimateTitle}} (${{estimateAmount}}). We'd love to get this scheduled — just reply or give us a call!",
    variables: ["firstName", "estimateTitle", "estimateAmount"],
    isSystem: true, createdAt: daysAgo(30), updatedAt: daysAgo(30),
  },
  {
    id: "t3", name: "Missed Call Recovery", type: "SMS",
    body: "Hi {{firstName}}, sorry we missed your call! This is {{businessName}}. We're available now — reply here or call us at {{businessPhone}}.",
    variables: ["firstName", "businessName", "businessPhone"],
    isSystem: true, createdAt: daysAgo(90), updatedAt: daysAgo(90),
  },
  {
    id: "t4", name: "Win-Back Reactivation", type: "SMS",
    body: "Hi {{firstName}}, it's been a while since we've seen you at {{businessName}}! We're offering existing customers a special seasonal tune-up. Interested? Reply YES or call {{businessPhone}}.",
    variables: ["firstName", "businessName", "businessPhone"],
    isSystem: true, createdAt: daysAgo(60), updatedAt: daysAgo(60),
  },
  {
    id: "t5", name: "Review Request", type: "SMS",
    body: "Hi {{firstName}}, thank you for choosing {{businessName}}! Could you leave us a quick review? It really helps: {{reviewLink}}",
    variables: ["firstName", "businessName", "reviewLink"],
    isSystem: true, createdAt: daysAgo(14), updatedAt: daysAgo(14),
  },
];

// ─── Integrations ─────────────────────────────────────────────────────────────

export const integrationsList: IntegrationItem[] = [
  {
    id: "int1", name: "ServiceTitan", provider: "ServiceTitan",
    description: "Sync contacts, jobs, and estimates from ServiceTitan",
    logoText: "ST", status: "CONNECTED", connectedAt: daysAgo(30),
  },
  {
    id: "int2", name: "Twilio", provider: "Twilio",
    description: "Send and receive SMS and voice calls",
    logoText: "TW", status: "CONNECTED", connectedAt: daysAgo(30),
  },
  {
    id: "int3", name: "Jobber", provider: "Jobber",
    description: "Import clients, quotes, and invoices from Jobber",
    logoText: "JB", status: "DISCONNECTED",
  },
  {
    id: "int4", name: "Housecall Pro", provider: "Housecall Pro",
    description: "Sync customers and jobs from Housecall Pro",
    logoText: "HC", status: "DISCONNECTED",
  },
  {
    id: "int5", name: "Google", provider: "Google",
    description: "Google Business Profile reviews and Calendar sync",
    logoText: "G", status: "DISCONNECTED",
  },
  {
    id: "int6", name: "Stripe", provider: "Stripe",
    description: "Track payments and invoice-level attribution",
    logoText: "$", status: "DISCONNECTED",
  },
];

// ─── Reactivation Segments ────────────────────────────────────────────────────

export const reactivationSegments = [
  {
    id: "seg1", name: "6–12 Month Dormant", filterLabel: "6–12 months ago",
    description: "Customers who haven't booked in 6–12 months. High reactivation potential.",
    contactCount: 67, estimatedValue: 80400,
  },
  {
    id: "seg2", name: "12–18 Month Lapsed", filterLabel: "12–18 months ago",
    description: "Customers who booked 12–18 months ago. Likely due for seasonal service.",
    contactCount: 89, estimatedValue: 106800,
  },
  {
    id: "seg3", name: "18+ Month Win-Back", filterLabel: "18+ months ago",
    description: "Long-inactive customers. Targeted win-back campaign with special offer.",
    contactCount: 124, estimatedValue: 148800,
  },
];
