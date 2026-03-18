import type {
  Business, User, Contact, Opportunity, CallEvent, Estimate,
  Campaign, Template, MessageEvent, Booking, ActivityLog,
  Integration, ReportSnapshot, DashboardSummary, Alert,
} from "@/types";

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000);
const daysFromNow = (d: number) => new Date(now.getTime() + d * 86400000);

export const demoBusiness: Business = {
  id: "biz_northshore",
  name: "North Shore Heating & Plumbing",
  phone: "+13135550100",
  email: "office@northshoreheating.com",
  timezone: "America/Detroit",
  staleEstimateDays: 7,
  attributionWindowDays: 14,
  highValueThreshold: 2500,
  missedCallSuppressionHours: 4,
  address: "2847 Lakeshore Blvd",
  city: "Grosse Pointe",
  state: "MI",
  zip: "48236",
};

export const demoUsers: User[] = [
  { id: "user_owner", name: "Mike Kowalski", email: "mike@northshoreheating.com", role: "owner", phone: "+13135550101" },
  { id: "user_manager", name: "Sarah Chen", email: "sarah@northshoreheating.com", role: "manager", phone: "+13135550102" },
  { id: "user_csr1", name: "Jen Martinez", email: "jen@northshoreheating.com", role: "csr", phone: "+13135550103" },
  { id: "user_csr2", name: "Dave Thompson", email: "dave@northshoreheating.com", role: "csr", phone: "+13135550104" },
];

export const demoContacts: Contact[] = [
  { id: "ct_01", firstName: "Robert", lastName: "Anderson", phone: "+13135551001", email: "randerson@email.com", address: "1234 Maple St", city: "Grosse Pointe", state: "MI", zip: "48236", tags: ["residential", "hvac"], source: "referral", lastServiceDate: daysAgo(45), lifetimeValue: 4200 },
  { id: "ct_02", firstName: "Linda", lastName: "Jacobs", phone: "+13135551002", email: "ljacobs@email.com", address: "567 Oak Ave", city: "St Clair Shores", state: "MI", zip: "48080", tags: ["residential", "plumbing"], source: "google", lastServiceDate: daysAgo(180), lifetimeValue: 2800 },
  { id: "ct_03", firstName: "James", lastName: "Wilson", phone: "+13135551003", email: "jwilson@email.com", address: "890 Elm Dr", city: "Grosse Pointe Park", state: "MI", zip: "48230", tags: ["residential", "hvac", "maintenance"], source: "website", lastServiceDate: daysAgo(400), lifetimeValue: 8500 },
  { id: "ct_04", firstName: "Patricia", lastName: "Moore", phone: "+13135551004", email: "pmoore@email.com", address: "321 Pine Ln", city: "Harper Woods", state: "MI", zip: "48225", tags: ["residential", "electrical"], source: "yelp", lastServiceDate: daysAgo(90), lifetimeValue: 1200 },
  { id: "ct_05", firstName: "Thomas", lastName: "Garcia", phone: "+13135551005", email: "tgarcia@email.com", address: "654 Birch Ct", city: "Eastpointe", state: "MI", zip: "48021", tags: ["commercial", "hvac"], source: "referral", lastServiceDate: daysAgo(30), lifetimeValue: 12000 },
  { id: "ct_06", firstName: "Susan", lastName: "Miller", phone: "+13135551006", email: "smiller@email.com", address: "987 Cedar Rd", city: "Grosse Pointe", state: "MI", zip: "48236", tags: ["residential", "plumbing", "hvac"], source: "google", lastServiceDate: daysAgo(365), lifetimeValue: 6700 },
  { id: "ct_07", firstName: "Charles", lastName: "Davis", phone: "+13135551007", email: "cdavis@email.com", address: "147 Walnut St", city: "Detroit", state: "MI", zip: "48224", tags: ["residential", "hvac"], source: "website", lastServiceDate: daysAgo(500), lifetimeValue: 3400 },
  { id: "ct_08", firstName: "Margaret", lastName: "Taylor", phone: "+13135551008", email: "mtaylor@email.com", address: "258 Spruce Ave", city: "St Clair Shores", state: "MI", zip: "48081", tags: ["residential", "plumbing"], source: "referral", lastServiceDate: daysAgo(60), lifetimeValue: 900 },
  { id: "ct_09", firstName: "Daniel", lastName: "Brown", phone: "+13135551009", email: "dbrown@email.com", address: "369 Ash Blvd", city: "Grosse Pointe Farms", state: "MI", zip: "48236", tags: ["residential", "hvac", "plumbing"], source: "google", lastServiceDate: daysAgo(200), lifetimeValue: 5600 },
  { id: "ct_10", firstName: "Nancy", lastName: "Johnson", phone: "+13135551010", email: "njohnson@email.com", address: "741 Hickory Ln", city: "Grosse Pointe Woods", state: "MI", zip: "48236", tags: ["residential", "hvac"], source: "yelp", lastServiceDate: daysAgo(420), lifetimeValue: 7200 },
  { id: "ct_11", firstName: "Kevin", lastName: "Lee", phone: "+13135551011", email: "klee@email.com", address: "852 Poplar St", city: "Harper Woods", state: "MI", zip: "48225", tags: ["commercial", "plumbing"], source: "referral", lastServiceDate: daysAgo(150), lifetimeValue: 15000 },
  { id: "ct_12", firstName: "Betty", lastName: "White", phone: "+13135551012", email: "bwhite@email.com", address: "963 Magnolia Dr", city: "Eastpointe", state: "MI", zip: "48021", tags: ["residential", "electrical"], source: "website", lastServiceDate: daysAgo(300), lifetimeValue: 2100 },
  { id: "ct_13", firstName: "Steven", lastName: "Clark", phone: "+13135551013", email: "sclark@email.com", address: "159 Sycamore Ct", city: "Grosse Pointe", state: "MI", zip: "48236", tags: ["residential", "hvac"], source: "google", lastServiceDate: daysAgo(75), lifetimeValue: 3800 },
  { id: "ct_14", firstName: "Dorothy", lastName: "Harris", phone: "+13135551014", email: "dharris@email.com", address: "267 Chestnut Ave", city: "St Clair Shores", state: "MI", zip: "48080", tags: ["residential", "plumbing", "hvac"], source: "referral", lastServiceDate: daysAgo(100), lifetimeValue: 4500 },
  { id: "ct_15", firstName: "Paul", lastName: "Martinez", phone: "+13135551015", email: "pmartinez@email.com", address: "378 Willow Rd", city: "Detroit", state: "MI", zip: "48215", tags: ["commercial", "hvac", "plumbing"], source: "website", lastServiceDate: daysAgo(250), lifetimeValue: 22000 },
  { id: "ct_16", firstName: "Karen", lastName: "Robinson", phone: "+13135551016", email: "krobinson@email.com", address: "489 Dogwood St", city: "Grosse Pointe Park", state: "MI", zip: "48230", tags: ["residential", "hvac"], source: "yelp", lastServiceDate: daysAgo(380), lifetimeValue: 6100 },
  { id: "ct_17", firstName: "Brian", lastName: "Hall", phone: "+13135551017", email: "bhall@email.com", address: "591 Redwood Ln", city: "Grosse Pointe", state: "MI", zip: "48236", tags: ["residential", "plumbing"], source: "google", lastServiceDate: daysAgo(50), lifetimeValue: 1800 },
  { id: "ct_18", firstName: "Sandra", lastName: "Young", phone: "+13135551018", email: "syoung@email.com", address: "602 Cypress Ave", city: "Harper Woods", state: "MI", zip: "48225", tags: ["residential", "hvac", "maintenance"], source: "referral", lastServiceDate: daysAgo(450), lifetimeValue: 9200 },
  { id: "ct_19", firstName: "Mark", lastName: "Walker", phone: "+13135551019", email: "mwalker@email.com", address: "713 Juniper Dr", city: "St Clair Shores", state: "MI", zip: "48081", tags: ["residential", "electrical", "hvac"], source: "website", lastServiceDate: daysAgo(120), lifetimeValue: 3200 },
  { id: "ct_20", firstName: "Donna", lastName: "King", phone: "+13135551020", email: "dking@email.com", address: "824 Sequoia Ct", city: "Grosse Pointe Woods", state: "MI", zip: "48236", tags: ["residential", "plumbing", "hvac"], source: "referral", lastServiceDate: daysAgo(330), lifetimeValue: 5400 },
  { id: "ct_21", firstName: "George", lastName: "Wright", phone: "+13135551021", email: "gwright@email.com", address: "935 Fir St", city: "Eastpointe", state: "MI", zip: "48021", tags: ["commercial", "hvac"], source: "google", lastServiceDate: daysAgo(15), lifetimeValue: 18500 },
  { id: "ct_22", firstName: "Carol", lastName: "Lopez", phone: "+13135551022", email: "clopez@email.com", address: "146 Hemlock Rd", city: "Detroit", state: "MI", zip: "48224", tags: ["residential", "hvac"], source: "yelp", lastServiceDate: undefined, lifetimeValue: 0 },
  { id: "ct_23", firstName: "Edward", lastName: "Scott", phone: "+13135551023", email: "escott@email.com", address: "257 Aspen Ave", city: "Grosse Pointe", state: "MI", zip: "48236", tags: ["residential", "plumbing"], source: "referral", lastServiceDate: daysAgo(550), lifetimeValue: 4100 },
  { id: "ct_24", firstName: "Ruth", lastName: "Green", phone: "+13135551024", email: "rgreen@email.com", address: "368 Larch Ln", city: "St Clair Shores", state: "MI", zip: "48080", tags: ["residential", "hvac", "plumbing"], source: "website", lastServiceDate: daysAgo(280), lifetimeValue: 7800 },
];

export const demoOpportunities: Opportunity[] = [
  { id: "opp_01", type: "missed_call", status: "new", title: "Missed call - Robert Anderson", description: "Inbound missed call, no voicemail left", estimatedValue: 350, actualValue: null, source: "phone", contactId: "ct_01", assignedToId: "user_csr1", createdAt: hoursAgo(2), resolvedAt: null },
  { id: "opp_02", type: "missed_call", status: "contacted", title: "Missed call - Carol Lopez", description: "After-hours call, SMS auto-reply sent", estimatedValue: 500, actualValue: null, source: "phone", contactId: "ct_22", assignedToId: "user_csr1", createdAt: hoursAgo(8), resolvedAt: null },
  { id: "opp_03", type: "missed_call", status: "booked", title: "Missed call - Daniel Brown", description: "Responded to SMS, booked furnace tune-up", estimatedValue: 189, actualValue: 189, source: "phone", contactId: "ct_09", assignedToId: "user_csr2", createdAt: daysAgo(2), resolvedAt: daysAgo(1) },
  { id: "opp_04", type: "missed_call", status: "lost", title: "Missed call - Patricia Moore", description: "Called back, went with another provider", estimatedValue: 800, actualValue: null, source: "phone", contactId: "ct_04", assignedToId: "user_csr1", createdAt: daysAgo(5), resolvedAt: daysAgo(3) },
  { id: "opp_05", type: "missed_call", status: "new", title: "Missed call - Mark Walker", description: "Weekend call, not yet contacted", estimatedValue: 275, actualValue: null, source: "phone", contactId: "ct_19", assignedToId: null, createdAt: hoursAgo(1), resolvedAt: null },
  { id: "opp_06", type: "estimate_rescue", status: "new", title: "Stale estimate - Linda Jacobs", description: "Water heater replacement estimate, 12 days old", estimatedValue: 3200, actualValue: null, source: "estimate", contactId: "ct_02", assignedToId: "user_manager", createdAt: daysAgo(5), resolvedAt: null },
  { id: "opp_07", type: "estimate_rescue", status: "in_progress", title: "Stale estimate - Steven Clark", description: "AC unit replacement, follow-up #2 sent", estimatedValue: 5800, actualValue: null, source: "estimate", contactId: "ct_13", assignedToId: "user_csr2", createdAt: daysAgo(10), resolvedAt: null },
  { id: "opp_08", type: "estimate_rescue", status: "responded", title: "Stale estimate - Thomas Garcia", description: "Commercial HVAC maintenance contract, customer interested", estimatedValue: 8500, actualValue: null, source: "estimate", contactId: "ct_05", assignedToId: "user_manager", createdAt: daysAgo(8), resolvedAt: null },
  { id: "opp_09", type: "estimate_rescue", status: "won", title: "Rescued estimate - Dorothy Harris", description: "Boiler replacement, signed after follow-up", estimatedValue: 6200, actualValue: 6200, source: "estimate", contactId: "ct_14", assignedToId: "user_csr1", createdAt: daysAgo(14), resolvedAt: daysAgo(3) },
  { id: "opp_10", type: "reactivation", status: "new", title: "Reactivation - James Wilson", description: "No service in 13 months, previously high-value customer", estimatedValue: 1200, actualValue: null, source: "reactivation", contactId: "ct_03", assignedToId: null, createdAt: daysAgo(3), resolvedAt: null },
  { id: "opp_11", type: "reactivation", status: "contacted", title: "Reactivation - Susan Miller", description: "12 months since last service, maintenance due", estimatedValue: 450, actualValue: null, source: "reactivation", contactId: "ct_06", assignedToId: "user_csr2", createdAt: daysAgo(7), resolvedAt: null },
  { id: "opp_12", type: "reactivation", status: "booked", title: "Reactivation - Nancy Johnson", description: "14 months dormant, booked furnace inspection", estimatedValue: 350, actualValue: 350, source: "reactivation", contactId: "ct_10", assignedToId: "user_csr1", createdAt: daysAgo(10), resolvedAt: daysAgo(2) },
  { id: "opp_13", type: "reactivation", status: "new", title: "Reactivation - Charles Davis", description: "16+ months dormant, replacement cycle candidate", estimatedValue: 4500, actualValue: null, source: "reactivation", contactId: "ct_07", assignedToId: null, createdAt: daysAgo(1), resolvedAt: null },
  { id: "opp_14", type: "reactivation", status: "contacted", title: "Reactivation - Karen Robinson", description: "12+ months dormant, membership renewal opportunity", estimatedValue: 600, actualValue: null, source: "reactivation", contactId: "ct_16", assignedToId: "user_csr2", createdAt: daysAgo(5), resolvedAt: null },
  { id: "opp_15", type: "reactivation", status: "won", title: "Reactivation - Edward Scott", description: "18 months dormant, signed maintenance contract", estimatedValue: 2400, actualValue: 2400, source: "reactivation", contactId: "ct_23", assignedToId: "user_manager", createdAt: daysAgo(20), resolvedAt: daysAgo(5) },
];

export const demoCallEvents: CallEvent[] = [
  { id: "call_01", callerNumber: "+13135551001", calledNumber: "+13135550100", direction: "inbound", status: "missed", duration: 0, callerName: "Robert Anderson", callTime: hoursAgo(2), contactId: "ct_01", opportunityId: "opp_01" },
  { id: "call_02", callerNumber: "+13135551022", calledNumber: "+13135550100", direction: "inbound", status: "after_hours", duration: 0, callerName: "Carol Lopez", callTime: hoursAgo(8), contactId: "ct_22", opportunityId: "opp_02" },
  { id: "call_03", callerNumber: "+13135551009", calledNumber: "+13135550100", direction: "inbound", status: "booked", duration: 180, callerName: "Daniel Brown", callTime: daysAgo(2), contactId: "ct_09", opportunityId: "opp_03" },
  { id: "call_04", callerNumber: "+13135551004", calledNumber: "+13135550100", direction: "inbound", status: "lost", duration: 45, callerName: "Patricia Moore", callTime: daysAgo(5), contactId: "ct_04", opportunityId: "opp_04" },
  { id: "call_05", callerNumber: "+13135551019", calledNumber: "+13135550100", direction: "inbound", status: "missed", duration: 0, callerName: "Mark Walker", callTime: hoursAgo(1), contactId: "ct_19", opportunityId: "opp_05" },
  { id: "call_06", callerNumber: "+13135551005", calledNumber: "+13135550100", direction: "inbound", status: "responded", duration: 420, callerName: "Thomas Garcia", callTime: daysAgo(3), contactId: "ct_05", opportunityId: null },
  { id: "call_07", callerNumber: "+13135551017", calledNumber: "+13135550100", direction: "inbound", status: "missed", duration: 0, callerName: "Brian Hall", callTime: daysAgo(1), contactId: "ct_17", opportunityId: null },
  { id: "call_08", callerNumber: "+13135551011", calledNumber: "+13135550100", direction: "inbound", status: "abandoned", duration: 15, callerName: "Kevin Lee", callTime: daysAgo(1), contactId: "ct_11", opportunityId: null },
  { id: "call_09", callerNumber: "+13135550100", calledNumber: "+13135551001", direction: "outbound", status: "responded", duration: 240, callerName: null, callTime: hoursAgo(1), contactId: "ct_01", opportunityId: null },
  { id: "call_10", callerNumber: "+13135551021", calledNumber: "+13135550100", direction: "inbound", status: "booked", duration: 360, callerName: "George Wright", callTime: daysAgo(2), contactId: "ct_21", opportunityId: null },
];

export const demoEstimates: Estimate[] = [
  { id: "est_01", estimateNumber: "EST-2026-001", amount: 3200, serviceType: "Water Heater Replacement", description: "50-gal tankless water heater install", status: "stale", sentAt: daysAgo(12), viewedAt: null, followUpCount: 0, contactId: "ct_02", opportunityId: "opp_06" },
  { id: "est_02", estimateNumber: "EST-2026-002", amount: 5800, serviceType: "AC Unit Replacement", description: "3-ton central AC unit replacement", status: "follow_up", sentAt: daysAgo(15), viewedAt: null, followUpCount: 2, contactId: "ct_13", opportunityId: "opp_07" },
  { id: "est_03", estimateNumber: "EST-2026-003", amount: 8500, serviceType: "Commercial HVAC Maintenance", description: "Annual commercial HVAC service contract", status: "viewed", sentAt: daysAgo(10), viewedAt: daysAgo(8), followUpCount: 0, contactId: "ct_05", opportunityId: "opp_08" },
  { id: "est_04", estimateNumber: "EST-2026-004", amount: 6200, serviceType: "Boiler Replacement", description: "High-efficiency boiler install", status: "booked", sentAt: daysAgo(18), viewedAt: null, followUpCount: 0, contactId: "ct_14", opportunityId: "opp_09" },
  { id: "est_05", estimateNumber: "EST-2026-005", amount: 450, serviceType: "Drain Cleaning", description: "Main sewer line cleaning", status: "sent", sentAt: daysAgo(3), viewedAt: null, followUpCount: 0, contactId: "ct_08", opportunityId: null },
  { id: "est_06", estimateNumber: "EST-2026-006", amount: 1800, serviceType: "Furnace Repair", description: "Heat exchanger diagnostic and repair", status: "stale", sentAt: daysAgo(9), viewedAt: null, followUpCount: 0, contactId: "ct_12", opportunityId: null },
  { id: "est_07", estimateNumber: "EST-2026-007", amount: 2400, serviceType: "Ductwork", description: "Full duct cleaning and sealing", status: "sent", sentAt: daysAgo(2), viewedAt: null, followUpCount: 0, contactId: "ct_17", opportunityId: null },
  { id: "est_08", estimateNumber: "EST-2026-008", amount: 12500, serviceType: "Full HVAC System", description: "Complete HVAC system replacement", status: "stale", sentAt: daysAgo(11), viewedAt: daysAgo(9), followUpCount: 0, contactId: "ct_15", opportunityId: null },
  { id: "est_09", estimateNumber: "EST-2026-009", amount: 750, serviceType: "Water Line Repair", description: "Kitchen water line replacement", status: "expired", sentAt: daysAgo(35), viewedAt: null, followUpCount: 0, contactId: "ct_20", opportunityId: null },
  { id: "est_10", estimateNumber: "EST-2026-010", amount: 950, serviceType: "Garbage Disposal", description: "InSinkErator install + plumbing", status: "viewed", sentAt: daysAgo(5), viewedAt: daysAgo(4), followUpCount: 0, contactId: "ct_24", opportunityId: null },
];

export const demoTemplates: Template[] = [
  { id: "tpl_01", name: "Missed Call Auto-Reply", type: "sms", subject: null, body: "Hi {{firstName}}, we missed your call at {{businessName}}! We're sorry we couldn't pick up. How can we help? Reply here or call us back at {{businessPhone}}.", variables: ["firstName", "businessName", "businessPhone"], isArchived: false },
  { id: "tpl_02", name: "Estimate Follow-Up", type: "sms", subject: null, body: "Hi {{firstName}}, just checking in on the {{serviceType}} estimate we sent on {{estimateDate}}. Do you have any questions? We'd love to help get this scheduled for you.", variables: ["firstName", "serviceType", "estimateDate"], isArchived: false },
  { id: "tpl_03", name: "Reactivation Outreach", type: "sms", subject: null, body: "Hi {{firstName}}, it's been a while since your last service with {{businessName}}! We'd love to have you back. Book a tune-up this month and save 15%. Reply YES to schedule.", variables: ["firstName", "businessName"], isArchived: false },
  { id: "tpl_04", name: "Booking Confirmation", type: "sms", subject: null, body: "Hi {{firstName}}, your {{serviceType}} appointment is confirmed for {{appointmentDate}} at {{appointmentTime}}. See you then! - {{businessName}}", variables: ["firstName", "serviceType", "appointmentDate", "appointmentTime", "businessName"], isArchived: false },
  { id: "tpl_05", name: "Estimate Follow-Up Email", type: "email", subject: "Your {{serviceType}} Estimate from {{businessName}}", body: "Hi {{firstName}},\n\nWe wanted to follow up on the estimate we sent for {{serviceType}} on {{estimateDate}}.\n\nYour estimate total: {{estimateAmount}}\n\nIf you have any questions or would like to move forward, just reply to this email or call us at {{businessPhone}}.\n\nBest regards,\n{{businessName}}", variables: ["firstName", "serviceType", "estimateDate", "estimateAmount", "businessPhone", "businessName"], isArchived: false },
  { id: "tpl_06", name: "Maintenance Reminder", type: "email", subject: "Time for Your Annual {{serviceType}} Maintenance", body: "Hi {{firstName}},\n\nIt's been {{monthsSinceService}} months since your last {{serviceType}} service. Regular maintenance helps prevent costly breakdowns and keeps your system running efficiently.\n\nSchedule your maintenance visit today and we'll include a complimentary system inspection.\n\nCall us: {{businessPhone}}\n\n{{businessName}}", variables: ["firstName", "serviceType", "monthsSinceService", "businessPhone", "businessName"], isArchived: false },
];

export const demoCampaigns: Campaign[] = [
  { id: "camp_01", name: "Winter Furnace Check-Up", description: "Reactivation campaign targeting customers who haven't had furnace service in 12+ months", type: "reactivation", status: "active", targetCount: 45, sentCount: 38, responseCount: 12, bookedCount: 6, steps: [
    { id: "step_01", stepOrder: 1, type: "sms", templateId: "tpl_03", delayHours: 0 },
    { id: "step_02", stepOrder: 2, type: "wait", delayHours: 48 },
    { id: "step_03", stepOrder: 3, type: "email", templateId: "tpl_06", delayHours: 0 },
    { id: "step_04", stepOrder: 4, type: "wait", delayHours: 72 },
    { id: "step_05", stepOrder: 5, type: "sms", delayHours: 0 },
  ]},
  { id: "camp_02", name: "Stale Estimate Recovery", description: "Follow up on estimates older than 7 days", type: "estimate_rescue", status: "active", targetCount: 22, sentCount: 18, responseCount: 7, bookedCount: 3, steps: [
    { id: "step_06", stepOrder: 1, type: "sms", templateId: "tpl_02", delayHours: 0 },
    { id: "step_07", stepOrder: 2, type: "wait", delayHours: 72 },
    { id: "step_08", stepOrder: 3, type: "email", templateId: "tpl_05", delayHours: 0 },
  ]},
  { id: "camp_03", name: "Missed Call Weekend Recovery", description: "Auto-outreach for weekend missed calls", type: "missed_call", status: "active", targetCount: 15, sentCount: 15, responseCount: 9, bookedCount: 5, steps: [
    { id: "step_09", stepOrder: 1, type: "sms", templateId: "tpl_01", delayHours: 0 },
    { id: "step_10", stepOrder: 2, type: "wait", delayHours: 24 },
    { id: "step_11", stepOrder: 3, type: "call", delayHours: 0 },
  ]},
  { id: "camp_04", name: "Spring AC Prep", description: "Draft campaign for spring AC maintenance push", type: "reactivation", status: "draft", targetCount: 0, sentCount: 0, responseCount: 0, bookedCount: 0, steps: [
    { id: "step_12", stepOrder: 1, type: "sms", delayHours: 0 },
  ]},
];

export const demoMessages: MessageEvent[] = [
  { id: "msg_01", channel: "sms", direction: "outbound", toNumber: "+13135551001", fromNumber: "+13135550100", body: "Hi Robert, we missed your call at North Shore Heating & Plumbing! How can we help? Reply here or call us back at (313) 555-0100.", contactId: "ct_01", opportunityId: "opp_01", sentAt: hoursAgo(2) },
  { id: "msg_02", channel: "sms", direction: "outbound", toNumber: "+13135551022", fromNumber: "+13135550100", body: "Hi Carol, we missed your call at North Shore Heating & Plumbing! We're sorry we couldn't pick up. How can we help?", contactId: "ct_22", opportunityId: "opp_02", sentAt: hoursAgo(7) },
  { id: "msg_03", channel: "sms", direction: "inbound", toNumber: "+13135550100", fromNumber: "+13135551022", body: "Hi, I need someone to look at my furnace. It's making a weird noise.", contactId: "ct_22", opportunityId: "opp_02", sentAt: hoursAgo(6) },
  { id: "msg_04", channel: "sms", direction: "outbound", toNumber: "+13135551022", fromNumber: "+13135550100", body: "We can definitely help with that! When would be a good time for a technician to come out?", contactId: "ct_22", opportunityId: "opp_02", sentAt: hoursAgo(5) },
  { id: "msg_05", channel: "sms", direction: "outbound", toNumber: "+13135551009", fromNumber: "+13135550100", body: "Hi Daniel, your furnace tune-up is confirmed for Thursday 2-4pm. See you then! - North Shore Heating & Plumbing", contactId: "ct_09", opportunityId: "opp_03", sentAt: daysAgo(1) },
  { id: "msg_06", channel: "sms", direction: "outbound", toNumber: "+13135551002", fromNumber: "+13135550100", body: "Hi Linda, just checking in on the Water Heater Replacement estimate we sent. Do you have any questions?", contactId: "ct_02", opportunityId: "opp_06", sentAt: daysAgo(5) },
  { id: "msg_07", channel: "email", direction: "outbound", toNumber: null, fromNumber: null, body: "Hi Thomas, we wanted to follow up on the Commercial HVAC Maintenance estimate we sent...", contactId: "ct_05", opportunityId: "opp_08", sentAt: daysAgo(3) },
  { id: "msg_08", channel: "sms", direction: "outbound", toNumber: "+13135551006", fromNumber: "+13135550100", body: "Hi Susan, it's been a while since your last service with North Shore Heating & Plumbing! Book a tune-up this month and save 15%.", contactId: "ct_06", opportunityId: "opp_11", sentAt: daysAgo(7) },
];

export const demoBookings: Booking[] = [
  { id: "bk_01", title: "Furnace Tune-Up", description: "Annual furnace maintenance", scheduledAt: daysFromNow(2), duration: 120, serviceType: "HVAC Maintenance", estimatedValue: 189, status: "scheduled", contactId: "ct_09", opportunityId: "opp_03", bookedById: "user_csr2" },
  { id: "bk_02", title: "Boiler Replacement", description: "High-efficiency boiler installation", scheduledAt: daysFromNow(5), duration: 480, serviceType: "Boiler Install", estimatedValue: 6200, status: "scheduled", contactId: "ct_14", opportunityId: "opp_09", bookedById: "user_csr1" },
  { id: "bk_03", title: "Furnace Inspection", description: "Reactivation - customer returning after 14 months", scheduledAt: daysFromNow(3), duration: 90, serviceType: "HVAC Inspection", estimatedValue: 350, status: "scheduled", contactId: "ct_10", opportunityId: "opp_12", bookedById: "user_csr1" },
  { id: "bk_04", title: "HVAC Maintenance Contract", description: "Annual maintenance agreement setup", scheduledAt: daysFromNow(7), duration: 120, serviceType: "Maintenance Agreement", estimatedValue: 2400, status: "scheduled", contactId: "ct_23", opportunityId: "opp_15", bookedById: "user_manager" },
  { id: "bk_05", title: "Commercial HVAC Checkup", description: "Quarterly commercial HVAC inspection", scheduledAt: daysFromNow(1), duration: 240, serviceType: "Commercial HVAC", estimatedValue: 1500, status: "scheduled", contactId: "ct_21", bookedById: "user_manager" },
  { id: "bk_06", title: "Drain Cleaning", description: "Main line snaking", scheduledAt: daysAgo(1), duration: 60, serviceType: "Plumbing", estimatedValue: 275, status: "completed", contactId: "ct_17", bookedById: "user_csr2" },
  { id: "bk_07", title: "Thermostat Install", description: "Smart thermostat installation", scheduledAt: daysAgo(3), duration: 60, serviceType: "HVAC", estimatedValue: 350, status: "completed", contactId: "ct_01", bookedById: "user_csr1" },
  { id: "bk_08", title: "Water Heater Flush", description: "Annual water heater maintenance", scheduledAt: daysFromNow(4), duration: 60, serviceType: "Plumbing", estimatedValue: 150, status: "scheduled", contactId: "ct_08", bookedById: "user_csr2" },
];

export const demoActivityLogs: ActivityLog[] = [
  { id: "act_01", action: "opportunity.created", entityType: "opportunity", entityId: "opp_05", metadata: { type: "missed_call", contact: "Mark Walker" }, createdAt: hoursAgo(1) },
  { id: "act_02", action: "sms.sent", entityType: "opportunity", entityId: "opp_01", metadata: { template: "Missed Call Auto-Reply" }, createdAt: hoursAgo(2) },
  { id: "act_03", action: "opportunity.created", entityType: "opportunity", entityId: "opp_01", metadata: { type: "missed_call", contact: "Robert Anderson" }, createdAt: hoursAgo(2) },
  { id: "act_04", action: "call.outbound", entityType: "contact", entityId: "ct_01", metadata: { duration: 240 }, createdAt: hoursAgo(1) },
  { id: "act_05", action: "sms.received", entityType: "opportunity", entityId: "opp_02", metadata: { from: "Carol Lopez" }, createdAt: hoursAgo(6) },
  { id: "act_06", action: "booking.created", entityType: "booking", entityId: "bk_01", metadata: { contact: "Daniel Brown", service: "Furnace Tune-Up" }, createdAt: daysAgo(1) },
  { id: "act_07", action: "opportunity.won", entityType: "opportunity", entityId: "opp_09", metadata: { value: 6200, type: "estimate_rescue" }, createdAt: daysAgo(3) },
  { id: "act_08", action: "estimate.stale", entityType: "estimate", entityId: "est_01", metadata: { amount: 3200, days: 12 }, createdAt: daysAgo(5) },
  { id: "act_09", action: "campaign.launched", entityType: "campaign", entityId: "camp_01", metadata: { name: "Winter Furnace Check-Up", targets: 45 }, createdAt: daysAgo(14) },
  { id: "act_10", action: "opportunity.won", entityType: "opportunity", entityId: "opp_15", metadata: { value: 2400, type: "reactivation" }, createdAt: daysAgo(5) },
  { id: "act_11", action: "booking.created", entityType: "booking", entityId: "bk_06", metadata: { contact: "Brian Hall", service: "Drain Cleaning" }, createdAt: daysAgo(2) },
  { id: "act_12", action: "estimate.sent", entityType: "estimate", entityId: "est_07", metadata: { amount: 2400, contact: "Brian Hall" }, createdAt: daysAgo(2) },
];

export const demoIntegrations: Integration[] = [
  { provider: "twilio", status: "connected", lastSyncAt: hoursAgo(1), name: "Twilio", description: "SMS and voice communication", icon: "phone" },
  { provider: "google_calendar", status: "connected", lastSyncAt: hoursAgo(2), name: "Google Calendar", description: "Appointment scheduling", icon: "calendar" },
  { provider: "jobber", status: "disconnected", lastSyncAt: null, name: "Jobber", description: "Field service management", icon: "briefcase" },
  { provider: "housecall_pro", status: "disconnected", lastSyncAt: null, name: "Housecall Pro", description: "Home service business management", icon: "home" },
  { provider: "service_titan", status: "disconnected", lastSyncAt: null, name: "ServiceTitan", description: "Trades business management", icon: "wrench" },
  { provider: "gmail", status: "pending", lastSyncAt: null, name: "Gmail", description: "Email communication", icon: "mail" },
  { provider: "outlook", status: "disconnected", lastSyncAt: null, name: "Outlook", description: "Email and calendar", icon: "mail" },
  { provider: "csv_import", status: "connected", lastSyncAt: null, name: "CSV Import", description: "Bulk data import", icon: "upload" },
];

export const demoReportSnapshots: ReportSnapshot[] = [
  { periodStart: daysAgo(30), periodEnd: now, revenueInfluenced: 34750, revenueRecovered: 9139, opportunitiesCreated: 15, opportunitiesRecovered: 4, bookingsCreated: 8, avgResponseMinutes: 18, estimatesReopened: 3, customersReactivated: 3, missedCallsHandled: 5, conversionRate: 26.7 },
  { periodStart: daysAgo(60), periodEnd: daysAgo(30), revenueInfluenced: 28400, revenueRecovered: 7200, opportunitiesCreated: 12, opportunitiesRecovered: 3, bookingsCreated: 6, avgResponseMinutes: 24, estimatesReopened: 2, customersReactivated: 2, missedCallsHandled: 4, conversionRate: 25.0 },
  { periodStart: daysAgo(90), periodEnd: daysAgo(60), revenueInfluenced: 22100, revenueRecovered: 5800, opportunitiesCreated: 10, opportunitiesRecovered: 2, bookingsCreated: 5, avgResponseMinutes: 32, estimatesReopened: 1, customersReactivated: 1, missedCallsHandled: 3, conversionRate: 20.0 },
];

export const dashboardSummary: DashboardSummary = {
  revenueInfluenced: 34750,
  opportunitiesRecovered: 4,
  bookingsCreated: 8,
  avgResponseMinutes: 18,
  estimatesReopened: 3,
  customersReactivated: 3,
};

export const demoAlerts: Alert[] = [
  { id: "alert_01", type: "missed_call", title: "New missed call", description: "Mark Walker called 1 hour ago - no response yet", timestamp: hoursAgo(1), read: false, linkTo: "/app/opportunities" },
  { id: "alert_02", type: "missed_call", title: "New missed call", description: "Robert Anderson called 2 hours ago", timestamp: hoursAgo(2), read: false, linkTo: "/app/opportunities" },
  { id: "alert_03", type: "stale_estimate", title: "Estimate going stale", description: "EST-2026-008 for Paul Martinez ($12,500) - 11 days old", timestamp: daysAgo(1), read: false, linkTo: "/app/estimates" },
  { id: "alert_04", type: "high_value", title: "High-value opportunity", description: "Thomas Garcia responded to $8,500 HVAC maintenance estimate", timestamp: daysAgo(2), read: true, linkTo: "/app/opportunities" },
  { id: "alert_05", type: "campaign_complete", title: "Campaign milestone", description: "Winter Furnace Check-Up: 6 bookings from 45 targets", timestamp: daysAgo(3), read: true, linkTo: "/app/campaigns" },
];

export function getContactById(id: string) {
  return demoContacts.find((c) => c.id === id);
}

export function getUserById(id: string) {
  return demoUsers.find((u) => u.id === id);
}

export function getOpportunitiesForContact(contactId: string) {
  return demoOpportunities.filter((o) => o.contactId === contactId);
}

export function getMessagesForOpportunity(opportunityId: string) {
  return demoMessages.filter((m) => m.opportunityId === opportunityId);
}

export function getEstimatesForContact(contactId: string) {
  return demoEstimates.filter((e) => e.contactId === contactId);
}

export function getCallsForContact(contactId: string) {
  return demoCallEvents.filter((c) => c.contactId === contactId);
}

export function getBookingsForContact(contactId: string) {
  return demoBookings.filter((b) => b.contactId === contactId);
}
