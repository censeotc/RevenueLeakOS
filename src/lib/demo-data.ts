import type {
  ActivityLog,
  AppUser,
  Booking,
  CallDisposition,
  CallEvent,
  Campaign,
  CampaignStatus,
  CampaignStep,
  Contact,
  DemoDataset,
  Estimate,
  IntegrationConnection,
  IntegrationProvider,
  Location,
  MessageEvent,
  Opportunity,
  OpportunityNote,
  OpportunityStatus,
  OpportunityType,
  ReactivationSegmentKey,
  ReportSnapshot,
  Template,
} from "@/types/domain";

const BUSINESS_ID = "biz_north_shore";
const OWNER_ID = "user_owner";
const LOCATION_ID = "loc_north_shore_main";

declare global {
  var revenueLeakStore: DemoDataset | undefined;
  var revenueLeakSequence: number | undefined;
}

const iso = (date: Date) => date.toISOString();
const at = (base: Date, { days = 0, hours = 0, minutes = 0 }) =>
  new Date(base.getTime() + days * 86_400_000 + hours * 3_600_000 + minutes * 60_000);
const nameOf = (contact: Contact) => `${contact.firstName} ${contact.lastName}`;
const newest = <T extends { createdAt?: string; startedAt?: string; snapshotDate?: string }>(rows: T[]) =>
  [...rows].sort((a, b) =>
    (b.createdAt ?? b.startedAt ?? b.snapshotDate ?? "").localeCompare(
      a.createdAt ?? a.startedAt ?? a.snapshotDate ?? "",
    ),
  );

type SeedContact = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  tags: string[];
  notes?: string;
  lifecycleStage?: string;
  lastServiceDays?: number;
  lastEstimateDays?: number;
  dormantDays?: number;
  renewalDays?: number;
  replacementDays?: number;
};

const CONTACTS: SeedContact[] = [
  { id: "contact_001", firstName: "Sarah", lastName: "Johnson", phone: "+13135551001", tags: ["vip", "furnace"], notes: "Prefers text before dispatch confirmation.", lastServiceDays: -28, lastEstimateDays: -11 },
  { id: "contact_002", firstName: "Mark", lastName: "Ellis", phone: "+13135551002", tags: ["after-hours", "boiler"], lastServiceDays: -220, dormantDays: -400, replacementDays: -14 },
  { id: "contact_003", firstName: "Tina", lastName: "Brooks", phone: "+13135551003", tags: ["maintenance-plan"], lastServiceDays: -365, renewalDays: 12 },
  { id: "contact_004", firstName: "Eric", lastName: "Williams", phone: "+13135551004", tags: ["estimate", "install"], lastEstimateDays: -15, lastServiceDays: -210 },
  { id: "contact_005", firstName: "Nina", lastName: "Patel", phone: "+13135551005", tags: ["electrical", "high-value"], lastEstimateDays: -8, lastServiceDays: -95 },
  { id: "contact_006", firstName: "George", lastName: "Miller", phone: "+13135551006", tags: ["plumbing", "reactivation"], dormantDays: -520, lastServiceDays: -520 },
  { id: "contact_007", firstName: "Lisa", lastName: "Nguyen", phone: "+13135551007", tags: ["maintenance-due"], lastServiceDays: -380 },
  { id: "contact_008", firstName: "James", lastName: "Porter", phone: "+13135551008", tags: ["membership", "boiler"], renewalDays: 5, lastServiceDays: -140 },
  { id: "contact_009", firstName: "Maya", lastName: "Rogers", phone: "+13135551009", tags: ["replacement-cycle"], replacementDays: -30, lastServiceDays: -730 },
  { id: "contact_010", firstName: "Ethan", lastName: "Davis", phone: "+13135551010", tags: ["new-customer"], lastServiceDays: -17 },
  { id: "contact_011", firstName: "Olivia", lastName: "Parker", phone: "+13135551011", tags: ["stale-estimate"], lastEstimateDays: -10 },
  { id: "contact_012", firstName: "Noah", lastName: "Howard", phone: "+13135551012", tags: ["stale-estimate", "install"], lastEstimateDays: -13, lastServiceDays: -190 },
  { id: "contact_013", firstName: "Emma", lastName: "Hayes", phone: "+13135551013", tags: ["dormant", "electrical"], dormantDays: -460, lastServiceDays: -460 },
  { id: "contact_014", firstName: "Liam", lastName: "Powell", phone: "+13135551014", tags: ["maintenance-due", "furnace"], lastServiceDays: -390 },
  { id: "contact_015", firstName: "Sophia", lastName: "Long", phone: "+13135551015", tags: ["replacement-cycle", "vip"], replacementDays: -45, lastServiceDays: -810 },
  { id: "contact_016", firstName: "Henry", lastName: "Flores", phone: "+13135551016", tags: ["after-hours"], lastServiceDays: -60 },
  { id: "contact_017", firstName: "Grace", lastName: "Cook", phone: "+13135551017", tags: ["membership", "plumbing"], renewalDays: 18, lastServiceDays: -150 },
  { id: "contact_018", firstName: "Jackson", lastName: "Murphy", phone: "+13135551018", tags: ["dormant"], dormantDays: -430, lastServiceDays: -430 },
  { id: "contact_019", firstName: "Isabella", lastName: "Bell", phone: "+13135551019", tags: ["estimate", "high-value"], notes: "Requested financing options for generator install.", lastEstimateDays: -9 },
  { id: "contact_020", firstName: "Lucas", lastName: "Ward", phone: "+13135551020", tags: ["maintenance-plan"], lastServiceDays: -370 },
  { id: "contact_021", firstName: "Avery", lastName: "Bennett", phone: "+13135551021", tags: ["service-club"], renewalDays: 21, lastServiceDays: -110 },
  { id: "contact_022", firstName: "Mason", lastName: "Cooper", phone: "+13135551022", tags: ["electrical"], lastServiceDays: -34 },
  { id: "contact_023", firstName: "Harper", lastName: "Fisher", phone: "+13135551023", tags: ["reactivation", "maintenance-due"], dormantDays: -405, lastServiceDays: -405 },
  { id: "contact_024", firstName: "Logan", lastName: "Sanders", phone: "+13135551024", tags: ["estimate", "replacement-cycle"], replacementDays: -12, lastEstimateDays: -18, lastServiceDays: -620 },
];

function buildContacts(baseNow: Date): Contact[] {
  return CONTACTS.map((seed) => ({
    id: seed.id,
    businessId: BUSINESS_ID,
    locationId: LOCATION_ID,
    firstName: seed.firstName,
    lastName: seed.lastName,
    email: `${seed.firstName.toLowerCase()}.${seed.lastName.toLowerCase()}@example.com`,
    phone: seed.phone,
    tags: seed.tags,
    notes: seed.notes,
    lifecycleStage: seed.lifecycleStage ?? "customer",
    lastServiceDate: seed.lastServiceDays ? iso(at(baseNow, { days: seed.lastServiceDays })) : undefined,
    lastEstimateDate: seed.lastEstimateDays ? iso(at(baseNow, { days: seed.lastEstimateDays })) : undefined,
    dormantSince: seed.dormantDays ? iso(at(baseNow, { days: seed.dormantDays })) : undefined,
    membershipRenewalDate: seed.renewalDays ? iso(at(baseNow, { days: seed.renewalDays })) : undefined,
    replacementCycleDate: seed.replacementDays ? iso(at(baseNow, { days: seed.replacementDays })) : undefined,
  }));
}

function buildTemplates(baseNow: Date): Template[] {
  return [
    { id: "template_missed_call_sms", businessId: BUSINESS_ID, name: "Missed Call Auto-Reply", channel: "sms", status: "active", body: "Hi {{firstName}}, sorry we missed your call. Reply here and our team will help you book service right away.", variables: ["firstName"], createdAt: iso(at(baseNow, { days: -60 })), updatedAt: iso(at(baseNow, { days: -2 })) },
    { id: "template_estimate_rescue_sms", businessId: BUSINESS_ID, name: "Estimate Rescue Day 7", channel: "sms", status: "active", body: "Hi {{firstName}}, your {{serviceType}} estimate is still open. Want to review options or schedule next steps?", variables: ["firstName", "serviceType"], createdAt: iso(at(baseNow, { days: -45 })), updatedAt: iso(at(baseNow, { days: -3 })) },
    { id: "template_reactivation_email", businessId: BUSINESS_ID, name: "Seasonal Reactivation Email", channel: "email", status: "active", subject: "Keep your system ready before the season changes", body: "Hi {{firstName}}, it has been a while since your last visit. We have a maintenance priority opening this week if you want us to reserve it for you.", variables: ["firstName"], createdAt: iso(at(baseNow, { days: -40 })), updatedAt: iso(at(baseNow, { days: -5 })) },
    { id: "template_membership_sms", businessId: BUSINESS_ID, name: "Membership Renewal Text", channel: "sms", status: "draft", body: "Hi {{firstName}}, your membership renewal is coming up. Want us to secure your renewal savings this week?", variables: ["firstName"], createdAt: iso(at(baseNow, { days: -15 })), updatedAt: iso(at(baseNow, { days: -1 })) },
  ];
}

function buildCampaigns(baseNow: Date): Campaign[] {
  return [
    { id: "campaign_reactivation_spring", businessId: BUSINESS_ID, name: "Spring Tune-Up Winback", type: "reactivation", status: "active", audienceLabel: "No service in 12+ months", segmentKey: "no_service_12_months", description: "Re-engage dormant homeowners ahead of peak cooling demand.", createdAt: iso(at(baseNow, { days: -18 })), updatedAt: iso(at(baseNow, { days: -1 })), launchedAt: iso(at(baseNow, { days: -10 })), metrics: { sent: 42, replies: 7, bookings: 3 } },
    { id: "campaign_estimate_save", businessId: BUSINESS_ID, name: "Estimate Rescue 7-Day Save", type: "estimate_rescue", status: "active", audienceLabel: "Stale estimates 7+ days", segmentKey: "estimate_follow_up", description: "Nudge open estimates before they age out.", createdAt: iso(at(baseNow, { days: -22 })), updatedAt: iso(at(baseNow, { days: -2 })), launchedAt: iso(at(baseNow, { days: -7 })), metrics: { sent: 18, replies: 5, bookings: 2 } },
    { id: "campaign_after_hours_callbacks", businessId: BUSINESS_ID, name: "After-Hours Missed Call Rescue", type: "missed_call", status: "draft", audienceLabel: "After-hours inbound calls", segmentKey: "after_hours_callbacks", description: "Queue overnight missed calls into next-morning callback and text flows.", createdAt: iso(at(baseNow, { days: -6 })), updatedAt: iso(at(baseNow, { days: -1 })), metrics: { sent: 0, replies: 0, bookings: 0 } },
  ];
}

function buildCampaignSteps(): CampaignStep[] {
  return [
    { id: "step_reactivation_1", campaignId: "campaign_reactivation_spring", stepOrder: 1, channel: "email", delayHours: 0, templateId: "template_reactivation_email", bodyPreview: "Maintenance opening this week for dormant customers." },
    { id: "step_reactivation_2", campaignId: "campaign_reactivation_spring", stepOrder: 2, channel: "sms", delayHours: 48, templateId: "template_membership_sms", bodyPreview: "Short SMS follow-up for no-response customers." },
    { id: "step_reactivation_3", campaignId: "campaign_reactivation_spring", stepOrder: 3, channel: "sms", delayHours: 120, templateId: "template_membership_sms", bodyPreview: "Last-call reminder before the offer expires." },
    { id: "step_estimate_1", campaignId: "campaign_estimate_save", stepOrder: 1, channel: "sms", delayHours: 0, templateId: "template_estimate_rescue_sms", bodyPreview: "Initial stale estimate reminder." },
    { id: "step_estimate_2", campaignId: "campaign_estimate_save", stepOrder: 2, channel: "email", delayHours: 24, templateId: "template_reactivation_email", bodyPreview: "Email follow-up with financing mention." },
    { id: "step_estimate_3", campaignId: "campaign_estimate_save", stepOrder: 3, channel: "sms", delayHours: 72, templateId: "template_estimate_rescue_sms", bodyPreview: "Last-touch message before marking lost." },
    { id: "step_calls_1", campaignId: "campaign_after_hours_callbacks", stepOrder: 1, channel: "sms", delayHours: 0, templateId: "template_missed_call_sms", bodyPreview: "Instant acknowledgement to missed callers." },
    { id: "step_calls_2", campaignId: "campaign_after_hours_callbacks", stepOrder: 2, channel: "sms", delayHours: 10, templateId: "template_missed_call_sms", bodyPreview: "Second text if there is no response." },
    { id: "step_calls_3", campaignId: "campaign_after_hours_callbacks", stepOrder: 3, channel: "sms", delayHours: 720, templateId: "template_missed_call_sms", bodyPreview: "Next-morning callback reminder." },
  ];
}

function buildOpportunities(baseNow: Date): Opportunity[] {
  return [
    { id: "opp_mc_001", businessId: BUSINESS_ID, contactId: "contact_001", ownerUserId: OWNER_ID, type: "missed_call", status: "booked", title: "Missed call - Sarah Johnson", description: "Inbound call missed during lunch coverage; text sequence sent.", priority: "high", valueCents: 18500, directRevenueCents: 18500, influencedRevenueCents: 18500, sourceLabel: "Inbound phone", createdAt: iso(at(baseNow, { hours: -36 })), updatedAt: iso(at(baseNow, { hours: -18 })), lastTouchedAt: iso(at(baseNow, { hours: -18 })) },
    { id: "opp_mc_002", businessId: BUSINESS_ID, contactId: "contact_002", ownerUserId: "user_manager", type: "missed_call", status: "responded", title: "After-hours missed call - Mark Ellis", description: "Overnight boiler no-heat call; caller texted back asking for first AM slot.", priority: "high", valueCents: 9400, directRevenueCents: 0, influencedRevenueCents: 9400, sourceLabel: "After-hours phone", createdAt: iso(at(baseNow, { hours: -14 })), updatedAt: iso(at(baseNow, { hours: -6 })), lastTouchedAt: iso(at(baseNow, { hours: -6 })) },
    { id: "opp_mc_003", businessId: BUSINESS_ID, contactId: "contact_016", ownerUserId: "user_csr", type: "missed_call", status: "open", title: "Missed call - Henry Flores", description: "Weekend overflow call still waiting for callback.", priority: "medium", valueCents: 6200, directRevenueCents: 0, influencedRevenueCents: 6200, sourceLabel: "Inbound phone", createdAt: iso(at(baseNow, { hours: -4 })), updatedAt: iso(at(baseNow, { hours: -4 })), lastTouchedAt: iso(at(baseNow, { hours: -4 })) },
    { id: "opp_mc_004", businessId: BUSINESS_ID, contactId: "contact_010", ownerUserId: OWNER_ID, type: "missed_call", status: "lost", title: "Missed call - Ethan Davis", description: "Contact booked elsewhere after no response within 24 hours.", priority: "medium", valueCents: 4800, directRevenueCents: 0, influencedRevenueCents: 0, sourceLabel: "Inbound phone", createdAt: iso(at(baseNow, { days: -6 })), updatedAt: iso(at(baseNow, { days: -5 })), lastTouchedAt: iso(at(baseNow, { days: -5 })), closedAt: iso(at(baseNow, { days: -5 })) },
    { id: "opp_est_001", businessId: BUSINESS_ID, contactId: "contact_004", ownerUserId: "user_manager", campaignId: "campaign_estimate_save", type: "estimate_rescue", status: "responded", title: "Estimate rescue - Ducted heat pump install", description: "Financing questions answered and follow-up sent.", priority: "high", valueCents: 1240000, directRevenueCents: 0, influencedRevenueCents: 1240000, sourceLabel: "Estimate aging 7+ days", createdAt: iso(at(baseNow, { days: -8 })), updatedAt: iso(at(baseNow, { days: -2 })), lastTouchedAt: iso(at(baseNow, { days: -2 })) },
    { id: "opp_est_002", businessId: BUSINESS_ID, contactId: "contact_005", ownerUserId: OWNER_ID, campaignId: "campaign_estimate_save", type: "estimate_rescue", status: "booked", title: "Estimate rescue - Panel upgrade", description: "Follow-up SMS reopened the job and booked install.", priority: "high", valueCents: 720000, directRevenueCents: 720000, influencedRevenueCents: 720000, sourceLabel: "Estimate aging 7+ days", createdAt: iso(at(baseNow, { days: -10 })), updatedAt: iso(at(baseNow, { days: -1 })), lastTouchedAt: iso(at(baseNow, { days: -1 })) },
    { id: "opp_est_003", businessId: BUSINESS_ID, contactId: "contact_011", ownerUserId: "user_csr", campaignId: "campaign_estimate_save", type: "estimate_rescue", status: "open", title: "Estimate rescue - Water heater replacement", description: "Pending first rescue touch.", priority: "medium", valueCents: 410000, directRevenueCents: 0, influencedRevenueCents: 410000, sourceLabel: "Estimate aging 7+ days", createdAt: iso(at(baseNow, { days: -7 })), updatedAt: iso(at(baseNow, { days: -7 })), lastTouchedAt: iso(at(baseNow, { days: -7 })) },
    { id: "opp_est_004", businessId: BUSINESS_ID, contactId: "contact_019", ownerUserId: OWNER_ID, campaignId: "campaign_estimate_save", type: "estimate_rescue", status: "lost", title: "Estimate rescue - Whole-home generator", description: "Customer paused project due to budget timing.", priority: "high", valueCents: 1750000, directRevenueCents: 0, influencedRevenueCents: 0, sourceLabel: "Estimate aging 7+ days", createdAt: iso(at(baseNow, { days: -14 })), updatedAt: iso(at(baseNow, { days: -9 })), lastTouchedAt: iso(at(baseNow, { days: -9 })), closedAt: iso(at(baseNow, { days: -9 })) },
    { id: "opp_re_001", businessId: BUSINESS_ID, contactId: "contact_006", ownerUserId: "user_manager", campaignId: "campaign_reactivation_spring", type: "reactivation", status: "booked", title: "Reactivation - George Miller", description: "Dormant plumbing customer booked annual inspection.", priority: "medium", valueCents: 28900, directRevenueCents: 28900, influencedRevenueCents: 28900, sourceLabel: "No service in 12+ months", createdAt: iso(at(baseNow, { days: -16 })), updatedAt: iso(at(baseNow, { days: -3 })), lastTouchedAt: iso(at(baseNow, { days: -3 })) },
    { id: "opp_re_002", businessId: BUSINESS_ID, contactId: "contact_013", ownerUserId: OWNER_ID, campaignId: "campaign_reactivation_spring", type: "reactivation", status: "responded", title: "Reactivation - Emma Hayes", description: "Electrical tune-up prospect replied asking about availability.", priority: "medium", valueCents: 21900, directRevenueCents: 0, influencedRevenueCents: 21900, sourceLabel: "No service in 12+ months", createdAt: iso(at(baseNow, { days: -12 })), updatedAt: iso(at(baseNow, { days: -4 })), lastTouchedAt: iso(at(baseNow, { days: -4 })) },
    { id: "opp_re_003", businessId: BUSINESS_ID, contactId: "contact_015", ownerUserId: "user_csr", campaignId: "campaign_reactivation_spring", type: "reactivation", status: "open", title: "Reactivation - Sophia Long", description: "Replacement cycle candidate queued for outbound follow-up.", priority: "high", valueCents: 1260000, directRevenueCents: 0, influencedRevenueCents: 1260000, sourceLabel: "Replacement cycle candidates", createdAt: iso(at(baseNow, { days: -2 })), updatedAt: iso(at(baseNow, { days: -2 })), lastTouchedAt: iso(at(baseNow, { days: -2 })) },
    { id: "opp_re_004", businessId: BUSINESS_ID, contactId: "contact_023", ownerUserId: OWNER_ID, campaignId: "campaign_reactivation_spring", type: "reactivation", status: "open", title: "Reactivation - Harper Fisher", description: "Maintenance-due and dormant; ready for campaign launch.", priority: "medium", valueCents: 15800, directRevenueCents: 0, influencedRevenueCents: 15800, sourceLabel: "No service in 12+ months", createdAt: iso(at(baseNow, { hours: -20 })), updatedAt: iso(at(baseNow, { hours: -20 })), lastTouchedAt: iso(at(baseNow, { hours: -20 })) },
    { id: "opp_mc_005", businessId: BUSINESS_ID, contactId: "contact_022", ownerUserId: "user_csr", type: "missed_call", status: "attempted", title: "Abandoned inbound - Mason Cooper", description: "Caller hung up during routing; SMS sent with callback CTA.", priority: "low", valueCents: 5400, directRevenueCents: 0, influencedRevenueCents: 5400, sourceLabel: "Abandoned call", createdAt: iso(at(baseNow, { hours: -30 })), updatedAt: iso(at(baseNow, { hours: -29 })), lastTouchedAt: iso(at(baseNow, { hours: -29 })) },
  ];
}

function buildCallEvents(baseNow: Date): CallEvent[] {
  return [
    { id: "call_001", businessId: BUSINESS_ID, contactId: "contact_001", opportunityId: "opp_mc_001", fromPhone: "+13135551001", toPhone: "+13135550100", direction: "inbound", disposition: "booked", durationSeconds: 42, afterHours: false, respondedAt: iso(at(baseNow, { hours: -28 })), bookedAt: iso(at(baseNow, { hours: -18 })), startedAt: iso(at(baseNow, { hours: -36 })), summary: "Customer called for no-cool issue and booked after SMS rescue.", smsPreview: "Replying now - tomorrow morning works.", bookingLogged: true },
    { id: "call_002", businessId: BUSINESS_ID, contactId: "contact_002", opportunityId: "opp_mc_002", fromPhone: "+13135551002", toPhone: "+13135550100", direction: "inbound", disposition: "after_hours", durationSeconds: 18, afterHours: true, respondedAt: iso(at(baseNow, { hours: -6 })), startedAt: iso(at(baseNow, { hours: -14 })), summary: "After-hours boiler call captured and waiting for dispatch.", smsPreview: "We can do first appointment tomorrow?", bookingLogged: false },
    { id: "call_003", businessId: BUSINESS_ID, contactId: "contact_016", opportunityId: "opp_mc_003", fromPhone: "+13135551016", toPhone: "+13135550100", direction: "inbound", disposition: "missed", durationSeconds: 21, afterHours: true, startedAt: iso(at(baseNow, { hours: -4 })), summary: "Weekend missed call requiring manual follow-up.", smsPreview: "Auto-reply sent 2 minutes after call.", bookingLogged: false },
    { id: "call_004", businessId: BUSINESS_ID, contactId: "contact_010", opportunityId: "opp_mc_004", fromPhone: "+13135551010", toPhone: "+13135550100", direction: "inbound", disposition: "lost", durationSeconds: 16, afterHours: false, startedAt: iso(at(baseNow, { days: -6 })), summary: "No response after two texts; customer moved on.", smsPreview: "Thanks, I found someone else.", bookingLogged: false },
    { id: "call_005", businessId: BUSINESS_ID, contactId: "contact_022", opportunityId: "opp_mc_005", fromPhone: "+13135551022", toPhone: "+13135550100", direction: "inbound", disposition: "abandoned", durationSeconds: 7, afterHours: false, startedAt: iso(at(baseNow, { hours: -30 })), summary: "Call abandoned before CSR pickup.", smsPreview: "Text sent with service booking link.", bookingLogged: false },
    { id: "call_006", businessId: BUSINESS_ID, contactId: "contact_018", fromPhone: "+13135551018", toPhone: "+13135550100", direction: "inbound", disposition: "responded", durationSeconds: 64, afterHours: false, respondedAt: iso(at(baseNow, { days: -1 })), startedAt: iso(at(baseNow, { days: -1 })), summary: "Dormant customer asked about water quality options.", smsPreview: "Can someone call about filtration?", bookingLogged: false },
    { id: "call_007", businessId: BUSINESS_ID, contactId: "contact_017", fromPhone: "+13135551017", toPhone: "+13135550100", direction: "inbound", disposition: "missed", durationSeconds: 22, afterHours: false, startedAt: iso(at(baseNow, { hours: -50 })), summary: "Membership renewal question after hours.", smsPreview: "Reply and we will get you scheduled.", bookingLogged: false },
    { id: "call_008", businessId: BUSINESS_ID, contactId: "contact_020", fromPhone: "+13135551020", toPhone: "+13135550100", direction: "inbound", disposition: "booked", durationSeconds: 38, afterHours: false, respondedAt: iso(at(baseNow, { days: -2 })), bookedAt: iso(at(baseNow, { days: -2 })), startedAt: iso(at(baseNow, { days: -2 })), summary: "Maintenance plan customer booked same-day tune-up.", smsPreview: "Booked through SMS link.", bookingLogged: true },
    { id: "call_009", businessId: BUSINESS_ID, contactId: "contact_023", opportunityId: "opp_re_004", fromPhone: "+13135551023", toPhone: "+13135550100", direction: "inbound", disposition: "responded", durationSeconds: 54, afterHours: false, respondedAt: iso(at(baseNow, { hours: -12 })), startedAt: iso(at(baseNow, { hours: -13 })), summary: "Reactivation customer called after seeing campaign text.", smsPreview: "I got your message - can you do next week?", bookingLogged: false },
  ];
}

function buildEstimates(baseNow: Date): Estimate[] {
  return [
    { id: "estimate_001", businessId: BUSINESS_ID, contactId: "contact_004", opportunityId: "opp_est_001", number: "EST-1001", serviceType: "Ducted heat pump install", amountCents: 1240000, status: "responded", createdAt: iso(at(baseNow, { days: -15 })), sentAt: iso(at(baseNow, { days: -14 })), staleSince: iso(at(baseNow, { days: -7 })), enrolledInFollowUp: true, respondedAt: iso(at(baseNow, { days: -2 })) },
    { id: "estimate_002", businessId: BUSINESS_ID, contactId: "contact_005", opportunityId: "opp_est_002", number: "EST-1002", serviceType: "200A panel upgrade", amountCents: 720000, status: "booked", createdAt: iso(at(baseNow, { days: -11 })), sentAt: iso(at(baseNow, { days: -10 })), staleSince: iso(at(baseNow, { days: -3 })), enrolledInFollowUp: true, respondedAt: iso(at(baseNow, { days: -2 })), bookedAt: iso(at(baseNow, { days: -1 })) },
    { id: "estimate_003", businessId: BUSINESS_ID, contactId: "contact_011", opportunityId: "opp_est_003", number: "EST-1003", serviceType: "Water heater replacement", amountCents: 410000, status: "stale", createdAt: iso(at(baseNow, { days: -10 })), sentAt: iso(at(baseNow, { days: -9 })), staleSince: iso(at(baseNow, { days: -2 })), enrolledInFollowUp: false },
    { id: "estimate_004", businessId: BUSINESS_ID, contactId: "contact_012", number: "EST-1004", serviceType: "Mini-split install", amountCents: 690000, status: "stale", createdAt: iso(at(baseNow, { days: -13 })), sentAt: iso(at(baseNow, { days: -12 })), staleSince: iso(at(baseNow, { days: -5 })), enrolledInFollowUp: false },
    { id: "estimate_005", businessId: BUSINESS_ID, contactId: "contact_019", opportunityId: "opp_est_004", number: "EST-1005", serviceType: "Whole-home generator", amountCents: 1750000, status: "lost", createdAt: iso(at(baseNow, { days: -17 })), sentAt: iso(at(baseNow, { days: -16 })), staleSince: iso(at(baseNow, { days: -9 })), enrolledInFollowUp: true, lostAt: iso(at(baseNow, { days: -9 })) },
    { id: "estimate_006", businessId: BUSINESS_ID, contactId: "contact_024", number: "EST-1006", serviceType: "Furnace replacement", amountCents: 980000, status: "stale", createdAt: iso(at(baseNow, { days: -18 })), sentAt: iso(at(baseNow, { days: -17 })), staleSince: iso(at(baseNow, { days: -10 })), enrolledInFollowUp: false },
    { id: "estimate_007", businessId: BUSINESS_ID, contactId: "contact_003", number: "EST-1007", serviceType: "Plumbing membership upgrade", amountCents: 24900, status: "open", createdAt: iso(at(baseNow, { days: -5 })), sentAt: iso(at(baseNow, { days: -4 })), enrolledInFollowUp: false },
    { id: "estimate_008", businessId: BUSINESS_ID, contactId: "contact_014", number: "EST-1008", serviceType: "Furnace tune-up bundle", amountCents: 31500, status: "stale", createdAt: iso(at(baseNow, { days: -9 })), sentAt: iso(at(baseNow, { days: -8 })), staleSince: iso(at(baseNow, { days: -1 })), enrolledInFollowUp: false },
  ];
}

function buildMessages(baseNow: Date): MessageEvent[] {
  return [
    { id: "msg_001", businessId: BUSINESS_ID, contactId: "contact_001", opportunityId: "opp_mc_001", templateId: "template_missed_call_sms", direction: "outbound", channel: "sms", body: "Hi Sarah, sorry we missed your call. Reply here and we can get you booked today.", deliveryStatus: "delivered", sentAt: iso(at(baseNow, { hours: -35 })) },
    { id: "msg_002", businessId: BUSINESS_ID, contactId: "contact_001", opportunityId: "opp_mc_001", direction: "inbound", channel: "sms", body: "Tomorrow morning works great.", deliveryStatus: "received", receivedAt: iso(at(baseNow, { hours: -30 })) },
    { id: "msg_003", businessId: BUSINESS_ID, contactId: "contact_002", opportunityId: "opp_mc_002", templateId: "template_missed_call_sms", direction: "outbound", channel: "sms", body: "Sorry we missed you. Reply with your issue and preferred time.", deliveryStatus: "delivered", sentAt: iso(at(baseNow, { hours: -13 })) },
    { id: "msg_004", businessId: BUSINESS_ID, contactId: "contact_002", opportunityId: "opp_mc_002", direction: "inbound", channel: "sms", body: "No heat. Earliest appointment please.", deliveryStatus: "received", receivedAt: iso(at(baseNow, { hours: -6 })) },
    { id: "msg_005", businessId: BUSINESS_ID, contactId: "contact_004", opportunityId: "opp_est_001", templateId: "template_estimate_rescue_sms", direction: "outbound", channel: "sms", body: "Your heat pump estimate is still open. Want to review financing?", deliveryStatus: "delivered", sentAt: iso(at(baseNow, { days: -3 })) },
    { id: "msg_006", businessId: BUSINESS_ID, contactId: "contact_004", opportunityId: "opp_est_001", direction: "inbound", channel: "sms", body: "Can someone send the monthly payment options?", deliveryStatus: "received", receivedAt: iso(at(baseNow, { days: -2 })) },
    { id: "msg_007", businessId: BUSINESS_ID, contactId: "contact_005", opportunityId: "opp_est_002", templateId: "template_estimate_rescue_sms", direction: "outbound", channel: "sms", body: "Ready to move ahead with the panel upgrade? We can hold an install date.", deliveryStatus: "delivered", sentAt: iso(at(baseNow, { days: -2 })) },
    { id: "msg_008", businessId: BUSINESS_ID, contactId: "contact_006", opportunityId: "opp_re_001", templateId: "template_reactivation_email", direction: "outbound", channel: "email", body: "We have a tune-up opening this week if you want to reserve it.", deliveryStatus: "opened", sentAt: iso(at(baseNow, { days: -12 })) },
    { id: "msg_009", businessId: BUSINESS_ID, contactId: "contact_013", opportunityId: "opp_re_002", templateId: "template_membership_sms", direction: "outbound", channel: "sms", body: "It has been a while since your last electrical safety check. Want us to hold a slot?", deliveryStatus: "delivered", sentAt: iso(at(baseNow, { days: -5 })) },
    { id: "msg_010", businessId: BUSINESS_ID, contactId: "contact_013", opportunityId: "opp_re_002", direction: "inbound", channel: "sms", body: "Yes, please text me next available dates.", deliveryStatus: "received", receivedAt: iso(at(baseNow, { days: -4 })) },
    { id: "msg_011", businessId: BUSINESS_ID, contactId: "contact_016", opportunityId: "opp_mc_003", templateId: "template_missed_call_sms", direction: "outbound", channel: "sms", body: "Sorry we missed your call. Reply here and we can get you scheduled.", deliveryStatus: "delivered", sentAt: iso(at(baseNow, { hours: -4 })) },
    { id: "msg_012", businessId: BUSINESS_ID, contactId: "contact_023", opportunityId: "opp_re_004", direction: "inbound", channel: "sms", body: "I got your message. Can someone call me next week?", deliveryStatus: "received", receivedAt: iso(at(baseNow, { hours: -12 })) },
  ];
}

function buildBookings(baseNow: Date): Booking[] {
  return [
    { id: "booking_001", businessId: BUSINESS_ID, contactId: "contact_001", opportunityId: "opp_mc_001", bookedAt: iso(at(baseNow, { hours: -18 })), serviceDate: iso(at(baseNow, { hours: 24 })), valueCents: 18500, status: "scheduled", source: "missed_call", notes: "No-cool service call." },
    { id: "booking_002", businessId: BUSINESS_ID, contactId: "contact_005", opportunityId: "opp_est_002", bookedAt: iso(at(baseNow, { days: -1 })), serviceDate: iso(at(baseNow, { days: 9 })), valueCents: 720000, status: "scheduled", source: "estimate_rescue", notes: "Panel upgrade install reserved." },
    { id: "booking_003", businessId: BUSINESS_ID, contactId: "contact_006", opportunityId: "opp_re_001", bookedAt: iso(at(baseNow, { days: -3 })), serviceDate: iso(at(baseNow, { days: 6 })), valueCents: 28900, status: "scheduled", source: "reactivation", notes: "Annual plumbing inspection." },
    { id: "booking_004", businessId: BUSINESS_ID, contactId: "contact_020", bookedAt: iso(at(baseNow, { days: -2 })), serviceDate: iso(at(baseNow, { days: 2 })), valueCents: 20900, status: "scheduled", source: "manual", notes: "Tune-up bundle booked through call center." },
    { id: "booking_005", businessId: BUSINESS_ID, contactId: "contact_003", bookedAt: iso(at(baseNow, { days: -8 })), serviceDate: iso(at(baseNow, { days: -1 })), valueCents: 24900, status: "completed", source: "manual", notes: "Membership visit completed." },
    { id: "booking_006", businessId: BUSINESS_ID, contactId: "contact_014", bookedAt: iso(at(baseNow, { days: -11 })), serviceDate: iso(at(baseNow, { days: -5 })), valueCents: 31500, status: "completed", source: "manual", notes: "Tune-up add-on conversion." },
  ];
}

function buildNotes(baseNow: Date): OpportunityNote[] {
  return [
    { id: "note_001", opportunityId: "opp_mc_001", authorUserId: OWNER_ID, body: "Customer responded within 20 minutes of the auto-text and requested a morning slot.", createdAt: iso(at(baseNow, { hours: -29 })) },
    { id: "note_002", opportunityId: "opp_mc_002", authorUserId: "user_manager", body: "Dispatch should prioritize this first thing due to no-heat after hours.", createdAt: iso(at(baseNow, { hours: -7 })) },
    { id: "note_003", opportunityId: "opp_est_001", authorUserId: OWNER_ID, body: "Sent financing matrix and monthly payment example.", createdAt: iso(at(baseNow, { days: -2 })) },
    { id: "note_004", opportunityId: "opp_est_002", authorUserId: "user_manager", body: "Install coordinator has the signed proposal.", createdAt: iso(at(baseNow, { days: -1 })) },
    { id: "note_005", opportunityId: "opp_re_001", authorUserId: OWNER_ID, body: "Win-back offer converted without discounting.", createdAt: iso(at(baseNow, { days: -3 })) },
    { id: "note_006", opportunityId: "opp_re_002", authorUserId: "user_csr", body: "Asked for late-afternoon availability next week.", createdAt: iso(at(baseNow, { days: -4 })) },
    { id: "note_007", opportunityId: "opp_re_003", authorUserId: OWNER_ID, body: "High-value replacement candidate; prioritize call instead of text-only follow-up.", createdAt: iso(at(baseNow, { days: -2 })) },
    { id: "note_008", opportunityId: "opp_mc_005", authorUserId: "user_csr", body: "Abandoned call likely due to IVR delay. Keep an eye on repeat attempts.", createdAt: iso(at(baseNow, { hours: -28 })) },
  ];
}

function buildActivity(baseNow: Date): ActivityLog[] {
  return [
    { id: "activity_001", businessId: BUSINESS_ID, type: "booking_created", title: "Booking created from missed-call rescue", detail: "Sarah Johnson booked a no-cool service call worth $185.", entityType: "booking", entityId: "booking_001", createdAt: iso(at(baseNow, { hours: -18 })) },
    { id: "activity_002", businessId: BUSINESS_ID, type: "message_received", title: "Mark Ellis replied to missed-call SMS", detail: "Asked for the earliest appointment after an after-hours missed call.", entityType: "opportunity", entityId: "opp_mc_002", createdAt: iso(at(baseNow, { hours: -6 })) },
    { id: "activity_003", businessId: BUSINESS_ID, type: "estimate_enrolled", title: "Estimate rescue workflow enrolled", detail: "Panel upgrade quote re-entered follow-up automation.", entityType: "estimate", entityId: "estimate_002", createdAt: iso(at(baseNow, { days: -2 })) },
    { id: "activity_004", businessId: BUSINESS_ID, type: "booking_created", title: "Estimate rescue converted to booking", detail: "Panel upgrade install reserved for Nina Patel.", entityType: "booking", entityId: "booking_002", createdAt: iso(at(baseNow, { days: -1 })) },
    { id: "activity_005", businessId: BUSINESS_ID, type: "campaign_launched", title: "Spring Tune-Up Winback is active", detail: "Dormant segment launched with 3-step cadence.", entityType: "campaign", entityId: "campaign_reactivation_spring", createdAt: iso(at(baseNow, { days: -10 })) },
    { id: "activity_006", businessId: BUSINESS_ID, type: "booking_created", title: "Reactivation booking created", detail: "George Miller booked an annual plumbing inspection.", entityType: "booking", entityId: "booking_003", createdAt: iso(at(baseNow, { days: -3 })) },
    { id: "activity_007", businessId: BUSINESS_ID, type: "alert", title: "3 stale estimates are past the 7-day threshold", detail: "Enroll them in follow-up to create estimate_rescue opportunities.", severity: "warning", entityType: "estimate", createdAt: iso(at(baseNow, { hours: -5 })) },
    { id: "activity_008", businessId: BUSINESS_ID, type: "alert", title: "After-hours missed call still unassigned", detail: "Henry Flores has not been called back since the weekend overflow.", severity: "critical", entityType: "opportunity", entityId: "opp_mc_003", createdAt: iso(at(baseNow, { hours: -4 })) },
    { id: "activity_009", businessId: BUSINESS_ID, type: "call_captured", title: "Abandoned inbound call captured", detail: "Mason Cooper was added to the missed-call queue.", entityType: "call_event", entityId: "call_005", createdAt: iso(at(baseNow, { hours: -30 })) },
    { id: "activity_010", businessId: BUSINESS_ID, type: "integration_tested", title: "Twilio connection tested successfully", detail: "Mock delivery confirmed against the Twilio service layer.", entityType: "integration", entityId: "integration_twilio", createdAt: iso(at(baseNow, { days: -1 })) },
    { id: "activity_011", businessId: BUSINESS_ID, type: "message_sent", title: "Estimate rescue follow-up sent", detail: "Water heater estimate nudged with financing CTA.", entityType: "estimate", entityId: "estimate_003", createdAt: iso(at(baseNow, { hours: -8 })) },
    { id: "activity_012", businessId: BUSINESS_ID, type: "opportunity_updated", title: "Replacement-cycle opportunity created", detail: "Sophia Long moved into reactivation outreach based on system age.", entityType: "opportunity", entityId: "opp_re_003", createdAt: iso(at(baseNow, { days: -2 })) },
  ];
}

function buildIntegrations(baseNow: Date): IntegrationConnection[] {
  return [
    { id: "integration_twilio", businessId: BUSINESS_ID, provider: "twilio", status: "connected", accountLabel: "North Shore Messaging", connectedAt: iso(at(baseNow, { days: -45 })), lastTestedAt: iso(at(baseNow, { days: -1 })), metadata: { mode: "mock" } },
    { id: "integration_jobber", businessId: BUSINESS_ID, provider: "jobber", status: "connected", accountLabel: "North Shore Jobber", connectedAt: iso(at(baseNow, { days: -33 })), lastTestedAt: iso(at(baseNow, { days: -6 })) },
    { id: "integration_housecall_pro", businessId: BUSINESS_ID, provider: "housecall_pro", status: "disconnected" },
    { id: "integration_service_titan", businessId: BUSINESS_ID, provider: "service_titan", status: "error", lastTestedAt: iso(at(baseNow, { days: -3 })), metadata: { reason: "Invalid API credentials" } },
    { id: "integration_gmail", businessId: BUSINESS_ID, provider: "gmail", status: "connected", accountLabel: "dispatch@northshore.demo", connectedAt: iso(at(baseNow, { days: -21 })), lastTestedAt: iso(at(baseNow, { days: -2 })) },
    { id: "integration_outlook", businessId: BUSINESS_ID, provider: "outlook", status: "disconnected" },
    { id: "integration_google_calendar", businessId: BUSINESS_ID, provider: "google_calendar", status: "connected", accountLabel: "Dispatch Calendar", connectedAt: iso(at(baseNow, { days: -17 })), lastTestedAt: iso(at(baseNow, { days: -1 })) },
    { id: "integration_csv_import", businessId: BUSINESS_ID, provider: "csv_import", status: "connected", accountLabel: "Nightly CSV Loader", connectedAt: iso(at(baseNow, { days: -12 })), lastTestedAt: iso(at(baseNow, { days: -1 })) },
  ];
}

function buildSnapshots(baseNow: Date): ReportSnapshot[] {
  return Array.from({ length: 7 }, (_, index) => ({
    id: `report_${index + 1}`,
    businessId: BUSINESS_ID,
    snapshotDate: iso(at(baseNow, { days: -(6 - index) })),
    directRevenueCents: 410000 + index * 33000,
    influencedRevenueCents: 1260000 + index * 88000,
    recoveredOpportunities: 8 + index,
    bookingsCreated: 4 + Math.floor(index / 2),
    avgResponseTimeMinutes: 7 - Math.min(index, 3),
    estimatesReopened: 2 + Math.floor(index / 2),
    customersReactivated: 1 + Math.floor(index / 3),
    workflowBreakdown: {
      missed_call: { influencedRevenueCents: 214000 + index * 12000, recoveredOpportunities: 2 + Math.floor(index / 3) },
      estimate_rescue: { influencedRevenueCents: 734000 + index * 50000, recoveredOpportunities: 3 + Math.floor(index / 2) },
      reactivation: { influencedRevenueCents: 312000 + index * 26000, recoveredOpportunities: 3 + Math.floor(index / 3) },
    },
  }));
}

export function createDemoDataset(baseNow: Date = new Date()): DemoDataset {
  return {
    business: {
      id: BUSINESS_ID,
      name: "North Shore Heating & Plumbing",
      timezone: "America/Detroit",
      staleEstimateDays: 7,
      attributionWindowDays: 14,
      highValueThreshold: 2500,
      duplicateMissedCallWindowHours: 4,
      phone: "(313) 555-0100",
      website: "https://northshore.demo",
    },
    users: [
      { id: OWNER_ID, businessId: BUSINESS_ID, name: "Ava Martinez", email: process.env.DEMO_USER_EMAIL ?? "owner@northshore.demo", phone: "+13135550100", role: "owner" },
      { id: "user_manager", businessId: BUSINESS_ID, name: "Ben Carter", email: "ben.carter@northshore.demo", phone: "+13135550101", role: "manager" },
      { id: "user_csr", businessId: BUSINESS_ID, name: "Chloe Reed", email: "chloe.reed@northshore.demo", phone: "+13135550102", role: "csr" },
      { id: "user_readonly", businessId: BUSINESS_ID, name: "Daniel Kim", email: "daniel.kim@northshore.demo", phone: "+13135550103", role: "readonly" },
    ],
    locations: [{ id: LOCATION_ID, businessId: BUSINESS_ID, name: "Main Dispatch", address1: "1847 Lakeshore Blvd", city: "Detroit", state: "MI", postalCode: "48236", isPrimary: true }],
    contacts: buildContacts(baseNow),
    opportunities: buildOpportunities(baseNow),
    opportunityNotes: buildNotes(baseNow),
    callEvents: buildCallEvents(baseNow),
    estimates: buildEstimates(baseNow),
    campaigns: buildCampaigns(baseNow),
    campaignSteps: buildCampaignSteps(),
    templates: buildTemplates(baseNow),
    messageEvents: buildMessages(baseNow),
    bookings: buildBookings(baseNow),
    activityLogs: buildActivity(baseNow),
    integrationConnections: buildIntegrations(baseNow),
    reportSnapshots: buildSnapshots(baseNow),
  };
}

export function getStore() {
  if (!globalThis.revenueLeakStore) {
    globalThis.revenueLeakStore = createDemoDataset();
    globalThis.revenueLeakSequence = 500;
  }
  return globalThis.revenueLeakStore;
}

const nextId = (prefix: string) => {
  globalThis.revenueLeakSequence = (globalThis.revenueLeakSequence ?? 500) + 1;
  return `${prefix}_${globalThis.revenueLeakSequence}`;
};

const getUser = (id: string) => getStore().users.find((row) => row.id === id);
const getContact = (id: string) => getStore().contacts.find((row) => row.id === id);
const getOpportunity = (id: string) => getStore().opportunities.find((row) => row.id === id);

function addActivity(row: Omit<ActivityLog, "id" | "businessId" | "createdAt"> & { createdAt?: string }) {
  getStore().activityLogs.unshift({
    id: nextId("activity"),
    businessId: BUSINESS_ID,
    createdAt: row.createdAt ?? iso(new Date()),
    ...row,
  });
}

export interface TwilioSmsInput {
  contactId: string;
  opportunityId?: string;
  templateId?: string;
  body: string;
}

export const mockTwilioService = {
  sendSms(input: TwilioSmsInput) {
    const message: MessageEvent = {
      id: nextId("msg"),
      businessId: BUSINESS_ID,
      contactId: input.contactId,
      opportunityId: input.opportunityId,
      templateId: input.templateId,
      direction: "outbound",
      channel: "sms",
      body: input.body,
      deliveryStatus: "delivered",
      sentAt: iso(new Date()),
    };
    getStore().messageEvents.unshift(message);
    addActivity({ type: "message_sent", title: "Mock Twilio SMS sent", detail: input.body, entityType: "message", entityId: message.id });
    return message;
  },
};

function determineSegment(contact: Contact): ReactivationSegmentKey | null {
  const now = new Date();
  if (contact.dormantSince && new Date(contact.dormantSince) <= at(now, { days: -365 })) return "no_service_12_months";
  if (contact.lastServiceDate && new Date(contact.lastServiceDate) <= at(now, { days: -365 })) return "maintenance_due";
  if (contact.membershipRenewalDate && new Date(contact.membershipRenewalDate) <= at(now, { days: 30 })) return "membership_renewal";
  if (contact.replacementCycleDate && new Date(contact.replacementCycleDate) <= now) return "replacement_cycle";
  return null;
}

const setOpportunityStatus = (opportunity: Opportunity, status: OpportunityStatus, closed = false) => {
  const now = iso(new Date());
  opportunity.status = status;
  opportunity.updatedAt = now;
  opportunity.lastTouchedAt = now;
  opportunity.closedAt = closed ? now : undefined;
};

function ensureEstimateOpportunity(estimate: Estimate) {
  const store = getStore();
  const existing = estimate.opportunityId ? store.opportunities.find((row) => row.id === estimate.opportunityId) : undefined;
  if (existing) return existing;
  const created: Opportunity = {
    id: nextId("opp_est"),
    businessId: BUSINESS_ID,
    contactId: estimate.contactId,
    ownerUserId: OWNER_ID,
    campaignId: "campaign_estimate_save",
    type: "estimate_rescue",
    status: "open",
    title: `Estimate rescue - ${estimate.serviceType}`,
    description: `Auto-created from stale estimate ${estimate.number}.`,
    priority: estimate.amountCents / 100 >= 2500 ? "high" : "medium",
    valueCents: estimate.amountCents,
    directRevenueCents: 0,
    influencedRevenueCents: estimate.amountCents,
    sourceLabel: "Estimate aging 7+ days",
    createdAt: iso(new Date()),
    updatedAt: iso(new Date()),
    lastTouchedAt: iso(new Date()),
  };
  store.opportunities.unshift(created);
  estimate.opportunityId = created.id;
  addActivity({ type: "opportunity_updated", title: `Estimate rescue opportunity created for ${estimate.number}`, detail: created.title, entityType: "opportunity", entityId: created.id });
  return created;
}

export function addOpportunityNote(opportunityId: string, body: string, authorUserId = OWNER_ID) {
  const note: OpportunityNote = { id: nextId("note"), opportunityId, authorUserId, body, createdAt: iso(new Date()) };
  getStore().opportunityNotes.unshift(note);
  addActivity({ type: "note_added", title: "Opportunity note added", detail: body, entityType: "opportunity", entityId: opportunityId });
  return note;
}

export function simulateMissedInboundCall() {
  const store = getStore();
  const now = new Date();
  const scenarios = ["+13135551007", "+13135551018", "+13135551999", "+13135551024", "+13135551003"];
  const phone = scenarios[(globalThis.revenueLeakSequence ?? 500) % scenarios.length];
  let contact = store.contacts.find((row) => row.phone === phone);
  if (!contact) {
    contact = {
      id: nextId("contact"),
      businessId: BUSINESS_ID,
      locationId: LOCATION_ID,
      firstName: "New",
      lastName: `Caller ${(globalThis.revenueLeakSequence ?? 500) - 499}`,
      phone,
      tags: ["new-lead", "missed-call"],
      lifecycleStage: "lead",
      notes: "Created from missed inbound call workflow.",
    };
    store.contacts.unshift(contact);
  }
  const recent = store.opportunities.find((row) => {
    if (row.type !== "missed_call" || row.contactId !== contact.id) return false;
    const ageHours = (now.getTime() - new Date(row.createdAt).getTime()) / 3_600_000;
    return ageHours <= store.business.duplicateMissedCallWindowHours && ["open", "attempted", "responded"].includes(row.status);
  });
  const opportunity =
    recent ??
    (() => {
      const created: Opportunity = {
        id: nextId("opp_mc"),
        businessId: BUSINESS_ID,
        contactId: contact.id,
        ownerUserId: "user_csr",
        type: "missed_call",
        status: "open",
        title: `Missed call - ${nameOf(contact)}`,
        description: "Generated by mocked inbound missed-call workflow.",
        priority: "medium",
        valueCents: 15800,
        directRevenueCents: 0,
        influencedRevenueCents: 15800,
        sourceLabel: "Inbound phone",
        createdAt: iso(now),
        updatedAt: iso(now),
        lastTouchedAt: iso(now),
      };
      store.opportunities.unshift(created);
      return created;
    })();
  opportunity.updatedAt = iso(now);
  opportunity.lastTouchedAt = iso(now);
  if (opportunity.status === "lost") opportunity.status = "open";
  const callEvent: CallEvent = {
    id: nextId("call"),
    businessId: BUSINESS_ID,
    contactId: contact.id,
    opportunityId: opportunity.id,
    fromPhone: contact.phone,
    toPhone: "+13135550100",
    direction: "inbound",
    disposition: now.getHours() < 8 || now.getHours() > 17 ? "after_hours" : "missed",
    durationSeconds: 19,
    afterHours: now.getHours() < 8 || now.getHours() > 17,
    startedAt: iso(now),
    summary: "Mock inbound call arrived and was routed into the missed-call workflow.",
    smsPreview: "Auto-reply dispatched with booking CTA.",
    bookingLogged: false,
  };
  store.callEvents.unshift(callEvent);
  mockTwilioService.sendSms({ contactId: contact.id, opportunityId: opportunity.id, templateId: "template_missed_call_sms", body: `Hi ${contact.firstName}, sorry we missed your call. Reply here and our team can help you book service right away.` });
  addActivity({
    type: "call_captured",
    title: `Missed inbound call captured for ${nameOf(contact)}`,
    detail: recent ? "Existing opportunity updated inside the suppression window." : "New missed-call opportunity created and initial SMS sent.",
    entityType: "opportunity",
    entityId: opportunity.id,
  });
  return { contact, opportunity, callEvent };
}

const replyBodies = ["Tomorrow morning is perfect.", "Do you have an afternoon slot?", "Can you text me the first available appointment?", "Yes, I still need help with this."];

export function simulateReply() {
  const store = getStore();
  const opportunity = store.opportunities.find(
    (row) =>
      row.type === "missed_call" &&
      ["open", "attempted", "responded"].includes(row.status) &&
      store.messageEvents.some((message) => message.opportunityId === row.id && message.direction === "outbound"),
  );
  if (!opportunity) return null;
  const contact = getContact(opportunity.contactId);
  if (!contact) return null;
  const body = replyBodies[(globalThis.revenueLeakSequence ?? 500) % replyBodies.length];
  const message: MessageEvent = {
    id: nextId("msg"),
    businessId: BUSINESS_ID,
    contactId: contact.id,
    opportunityId: opportunity.id,
    direction: "inbound",
    channel: "sms",
    body,
    deliveryStatus: "received",
    receivedAt: iso(new Date()),
  };
  store.messageEvents.unshift(message);
  setOpportunityStatus(opportunity, "responded");
  const call = store.callEvents.find((row) => row.opportunityId === opportunity.id);
  if (call) {
    call.disposition = "responded";
    call.respondedAt = iso(new Date());
    call.smsPreview = body;
  }
  addActivity({ type: "message_received", title: `${nameOf(contact)} replied to the missed-call SMS`, detail: body, entityType: "message", entityId: message.id });
  return { contact, opportunity, message };
}

export function logBooking(opportunityId?: string) {
  const store = getStore();
  const opportunity = (opportunityId ? getOpportunity(opportunityId) : undefined) ?? store.opportunities.find((row) => ["responded", "open", "attempted"].includes(row.status));
  if (!opportunity) return null;
  const contact = getContact(opportunity.contactId);
  if (!contact) return null;
  const booking: Booking = {
    id: nextId("booking"),
    businessId: BUSINESS_ID,
    contactId: contact.id,
    opportunityId: opportunity.id,
    bookedAt: iso(new Date()),
    serviceDate: iso(at(new Date(), { days: 5 })),
    valueCents: opportunity.valueCents,
    status: "scheduled",
    source: opportunity.type,
    notes: `Created from ${opportunity.type} workflow.`,
  };
  store.bookings.unshift(booking);
  opportunity.directRevenueCents = opportunity.valueCents;
  opportunity.influencedRevenueCents = Math.max(opportunity.influencedRevenueCents, opportunity.valueCents);
  setOpportunityStatus(opportunity, "booked");
  const call = store.callEvents.find((row) => row.opportunityId === opportunity.id);
  if (call) {
    call.disposition = "booked";
    call.bookedAt = booking.bookedAt;
    call.bookingLogged = true;
  }
  const estimate = store.estimates.find((row) => row.opportunityId === opportunity.id);
  if (estimate) {
    estimate.status = "booked";
    estimate.bookedAt = booking.bookedAt;
    estimate.enrolledInFollowUp = true;
  }
  addActivity({ type: "booking_created", title: `Booking created from ${opportunity.type.replace("_", " ")}`, detail: `${nameOf(contact)} booked for ${Math.round(opportunity.valueCents / 100)} dollars in influenced value.`, entityType: "booking", entityId: booking.id });
  return { contact, opportunity, booking };
}

export function enrollEstimateFollowUp(estimateId?: string) {
  const store = getStore();
  const estimate = (estimateId ? store.estimates.find((row) => row.id === estimateId) : undefined) ?? store.estimates.find((row) => row.status === "stale" || (row.status === "open" && row.staleSince));
  if (!estimate) return null;
  const contact = getContact(estimate.contactId);
  const opportunity = ensureEstimateOpportunity(estimate);
  estimate.enrolledInFollowUp = true;
  estimate.status = "enrolled";
  mockTwilioService.sendSms({
    contactId: estimate.contactId,
    opportunityId: opportunity.id,
    templateId: "template_estimate_rescue_sms",
    body: `Hi ${contact?.firstName ?? "there"}, your ${estimate.serviceType} estimate is still open. Want help comparing options or booking next steps?`,
  });
  setOpportunityStatus(opportunity, "attempted");
  addActivity({ type: "estimate_enrolled", title: `Estimate ${estimate.number} enrolled in follow-up`, detail: `${estimate.serviceType} created or updated an estimate_rescue opportunity.`, entityType: "estimate", entityId: estimate.id });
  return { estimate, opportunity };
}

export function markEstimateOutcome(estimateId: string, outcome: "responded" | "booked" | "lost") {
  const estimate = getStore().estimates.find((row) => row.id === estimateId);
  if (!estimate) return null;
  const opportunity = ensureEstimateOpportunity(estimate);
  const now = iso(new Date());
  if (outcome === "responded") {
    estimate.status = "responded";
    estimate.respondedAt = now;
    setOpportunityStatus(opportunity, "responded");
  }
  if (outcome === "booked") {
    estimate.status = "booked";
    estimate.bookedAt = now;
    logBooking(opportunity.id);
  }
  if (outcome === "lost") {
    estimate.status = "lost";
    estimate.lostAt = now;
    setOpportunityStatus(opportunity, "lost", true);
  }
  addActivity({ type: "opportunity_updated", title: `Estimate ${estimate.number} marked ${outcome}`, detail: `Opportunity ${opportunity.id} moved to ${outcome}.`, entityType: "estimate", entityId: estimate.id });
  return { estimate, opportunity };
}

export function launchReactivationCampaign(segmentKey: ReactivationSegmentKey) {
  const store = getStore();
  const now = new Date();
  const campaign =
    store.campaigns.find((row) => row.segmentKey === segmentKey) ??
    (() => {
      const created: Campaign = {
        id: nextId("campaign"),
        businessId: BUSINESS_ID,
        name: `Reactivation - ${segmentKey.replaceAll("_", " ")}`,
        type: "reactivation",
        status: "draft",
        audienceLabel: segmentKey.replaceAll("_", " "),
        segmentKey,
        createdAt: iso(now),
        updatedAt: iso(now),
      };
      store.campaigns.unshift(created);
      store.campaignSteps.push({ id: nextId("step"), campaignId: created.id, stepOrder: 1, channel: "sms", delayHours: 0, templateId: "template_membership_sms", bodyPreview: "Initial reactivation outreach." });
      return created;
    })();
  campaign.status = "active";
  campaign.launchedAt = campaign.launchedAt ?? iso(now);
  campaign.updatedAt = iso(now);
  let createdCount = 0;
  for (const contact of store.contacts.filter((row) => determineSegment(row) === segmentKey)) {
    const existing = store.opportunities.find((row) => row.type === "reactivation" && row.contactId === contact.id && ["open", "attempted", "responded", "booked"].includes(row.status));
    if (existing) continue;
    createdCount += 1;
    const opportunity: Opportunity = {
      id: nextId("opp_re"),
      businessId: BUSINESS_ID,
      contactId: contact.id,
      ownerUserId: OWNER_ID,
      campaignId: campaign.id,
      type: "reactivation",
      status: "open",
      title: `Reactivation - ${nameOf(contact)}`,
      description: `Created from ${segmentKey.replaceAll("_", " ")} segment.`,
      priority: contact.tags.includes("vip") ? "high" : "medium",
      valueCents: contact.tags.includes("replacement-cycle") ? 1150000 : 26900,
      directRevenueCents: 0,
      influencedRevenueCents: contact.tags.includes("replacement-cycle") ? 1150000 : 26900,
      sourceLabel: segmentKey.replaceAll("_", " "),
      createdAt: iso(now),
      updatedAt: iso(now),
      lastTouchedAt: iso(now),
    };
    store.opportunities.unshift(opportunity);
    mockTwilioService.sendSms({ contactId: contact.id, opportunityId: opportunity.id, templateId: "template_membership_sms", body: `Hi ${contact.firstName}, we have a priority service opening this week and wanted to see if you would like us to hold it for you.` });
  }
  addActivity({ type: "campaign_launched", title: `Reactivation campaign launched for ${segmentKey.replaceAll("_", " ")}`, detail: `${createdCount} opportunities created or refreshed from the selected segment.`, entityType: "campaign", entityId: campaign.id });
  return { campaign, createdCount };
}

export function assignOpportunityOwner(opportunityId: string, ownerUserId: string) {
  const opportunity = getOpportunity(opportunityId);
  if (!opportunity) return null;
  opportunity.ownerUserId = ownerUserId;
  opportunity.updatedAt = iso(new Date());
  addActivity({ type: "opportunity_updated", title: "Opportunity owner changed", detail: `Assigned to ${getUser(ownerUserId)?.name ?? ownerUserId}.`, entityType: "opportunity", entityId: opportunity.id });
  return opportunity;
}

export function duplicateTemplate(templateId: string) {
  const template = getStore().templates.find((row) => row.id === templateId);
  if (!template) return null;
  const duplicate: Template = { ...template, id: nextId("template"), name: `${template.name} Copy`, createdAt: iso(new Date()), updatedAt: iso(new Date()), status: "draft", archivedAt: undefined };
  getStore().templates.unshift(duplicate);
  addActivity({ type: "opportunity_updated", title: "Template duplicated", detail: `${template.name} copied into a new draft template.`, entityType: "template", entityId: duplicate.id });
  return duplicate;
}

export function archiveTemplate(templateId: string) {
  const template = getStore().templates.find((row) => row.id === templateId);
  if (!template) return null;
  template.status = "archived";
  template.archivedAt = iso(new Date());
  template.updatedAt = iso(new Date());
  addActivity({ type: "opportunity_updated", title: "Template archived", detail: `${template.name} moved out of active rotation.`, entityType: "template", entityId: template.id });
  return template;
}

export function createCampaign(input: { name: string; type: OpportunityType; segmentKey: Campaign["segmentKey"]; audienceLabel: string }) {
  const now = iso(new Date());
  const campaign: Campaign = {
    id: nextId("campaign"),
    businessId: BUSINESS_ID,
    name: input.name,
    type: input.type,
    status: "draft",
    audienceLabel: input.audienceLabel,
    segmentKey: input.segmentKey,
    description: "Created from the in-app campaign editor.",
    createdAt: now,
    updatedAt: now,
    metrics: { sent: 0, replies: 0, bookings: 0 },
  };
  getStore().campaigns.unshift(campaign);
  getStore().campaignSteps.push({ id: nextId("step"), campaignId: campaign.id, stepOrder: 1, channel: "sms", delayHours: 0, templateId: "template_missed_call_sms", bodyPreview: "Draft step - edit the template before launch." });
  addActivity({ type: "opportunity_updated", title: "Campaign draft created", detail: `${campaign.name} is ready for editing.`, entityType: "campaign", entityId: campaign.id });
  return campaign;
}

export function updateCampaignStatus(campaignId: string, status: CampaignStatus) {
  const campaign = getStore().campaigns.find((row) => row.id === campaignId);
  if (!campaign) return null;
  campaign.status = status;
  campaign.updatedAt = iso(new Date());
  if (status === "active") campaign.launchedAt = campaign.launchedAt ?? iso(new Date());
  if (status === "completed") campaign.completedAt = iso(new Date());
  addActivity({ type: "opportunity_updated", title: "Campaign status updated", detail: `${campaign.name} is now ${status}.`, entityType: "campaign", entityId: campaign.id });
  return campaign;
}

export function connectOrDisconnectIntegration(provider: IntegrationProvider) {
  const connection = getStore().integrationConnections.find((row) => row.provider === provider);
  if (!connection) return null;
  const status = connection.status === "connected" ? "disconnected" : "connected";
  connection.status = status;
  connection.connectedAt = status === "connected" ? iso(new Date()) : connection.connectedAt;
  addActivity({ type: "opportunity_updated", title: `Integration ${status}`, detail: `${provider.replaceAll("_", " ")} is now ${status}.`, entityType: "integration", entityId: connection.id });
  return connection;
}

export function testIntegration(provider: IntegrationProvider) {
  const connection = getStore().integrationConnections.find((row) => row.provider === provider);
  if (!connection) return null;
  connection.lastTestedAt = iso(new Date());
  if (connection.status === "disconnected") {
    connection.status = "connected";
    connection.connectedAt = connection.connectedAt ?? iso(new Date());
  }
  addActivity({ type: "integration_tested", title: `${provider.replaceAll("_", " ")} test completed`, detail: "Connection verified through the mock integration service layer.", entityType: "integration", entityId: connection.id });
  return connection;
}

export const appNav = [
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/app/opportunities", label: "Opportunities" },
  { href: "/app/calls", label: "Calls" },
  { href: "/app/estimates", label: "Estimates" },
  { href: "/app/reactivation", label: "Reactivation" },
  { href: "/app/campaigns", label: "Campaigns" },
  { href: "/app/contacts", label: "Contacts" },
  { href: "/app/reports", label: "Reports" },
  { href: "/app/templates", label: "Templates" },
  { href: "/app/integrations", label: "Integrations" },
  { href: "/app/settings", label: "Settings" },
] as const;

export function getDashboardData() {
  const store = getStore();
  const latest = newest(store.reportSnapshots)[0];
  return {
    business: store.business,
    summary: {
      revenueInfluenced: latest.influencedRevenueCents,
      opportunitiesRecovered: latest.recoveredOpportunities,
      bookingsCreated: latest.bookingsCreated,
      avgResponseTimeMinutes: latest.avgResponseTimeMinutes,
      estimatesReopened: latest.estimatesReopened,
      customersReactivated: latest.customersReactivated,
    },
    recentActivity: newest(store.activityLogs).slice(0, 8),
    alerts: newest(store.activityLogs.filter((row) => row.type === "alert")).slice(0, 4),
    quickActionCounts: {
      missedCallsOpen: store.opportunities.filter((row) => row.type === "missed_call" && ["open", "attempted", "responded"].includes(row.status)).length,
      staleEstimates: store.estimates.filter((row) => ["stale", "open"].includes(row.status) && row.staleSince).length,
      dormantContacts: store.contacts.filter((row) => determineSegment(row) !== null).length,
    },
  };
}

export function getOpportunitiesView(filter: OpportunityType | "all" = "all") {
  const store = getStore();
  const opportunities = newest(
    store.opportunities
      .filter((row) => filter === "all" || row.type === filter)
      .map((row) => ({
        ...row,
        contact: getContact(row.contactId),
        owner: row.ownerUserId ? getUser(row.ownerUserId) : undefined,
        notes: store.opportunityNotes.filter((note) => note.opportunityId === row.id),
        estimate: store.estimates.find((estimate) => estimate.opportunityId === row.id),
        latestMessage: store.messageEvents.find((message) => message.opportunityId === row.id),
      })),
  );
  return { opportunities, selectedOpportunity: opportunities[0], users: store.users };
}

export function getCallsView(tab: CallDisposition = "missed") {
  const store = getStore();
  const calls = newest(
    store.callEvents
      .filter((row) => row.disposition === tab)
      .map((row) => ({
        ...row,
        contact: row.contactId ? getContact(row.contactId) : undefined,
        opportunity: row.opportunityId ? getOpportunity(row.opportunityId) : undefined,
        messages: store.messageEvents.filter((message) => message.opportunityId === row.opportunityId).slice(0, 4),
      })),
  );
  return { calls, tabs: ["missed", "after_hours", "abandoned", "responded", "booked", "lost"] as const };
}

export function getEstimatesView() {
  const store = getStore();
  return {
    staleEstimateDays: store.business.staleEstimateDays,
    estimates: newest(
      store.estimates.map((row) => ({
        ...row,
        contact: getContact(row.contactId),
        opportunity: row.opportunityId ? getOpportunity(row.opportunityId) : undefined,
        ageInDays: Math.max(1, Math.ceil((Date.now() - new Date(row.sentAt).getTime()) / 86_400_000)),
      })),
    ),
  };
}

export function getReactivationView(selectedSegment: ReactivationSegmentKey = "no_service_12_months") {
  const store = getStore();
  const segments = [
    { key: "no_service_12_months", title: "No service in 12+ months" },
    { key: "maintenance_due", title: "Maintenance due" },
    { key: "membership_renewal", title: "Membership renewal" },
    { key: "replacement_cycle", title: "Replacement cycle candidates" },
  ].map((segment) => {
    const contacts = store.contacts.filter((row) => determineSegment(row) === segment.key);
    return {
      ...segment,
      count: contacts.length,
      contacts,
      estimatedValue: contacts.reduce((sum, row) => sum + (row.tags.includes("replacement-cycle") ? 1150000 : 26900), 0),
    };
  });
  const activeSegment = segments.find((row) => row.key === selectedSegment) ?? segments[0];
  return { segments, activeSegment };
}

export function getReportsView() {
  const store = getStore();
  const summary = newest(store.reportSnapshots)[0];
  const workflowComparison = (["missed_call", "estimate_rescue", "reactivation"] as OpportunityType[]).map((type) => ({
    type,
    recovered: store.opportunities.filter((row) => row.type === type && ["booked", "won", "responded"].includes(row.status)).length,
    directRevenue: store.opportunities.filter((row) => row.type === type).reduce((sum, row) => sum + row.directRevenueCents, 0),
    influencedRevenue: store.opportunities.filter((row) => row.type === type).reduce((sum, row) => sum + row.influencedRevenueCents, 0),
  }));
  const conversionSummary = (["missed_call", "estimate_rescue", "reactivation"] as OpportunityType[]).map((type) => {
    const rows = store.opportunities.filter((row) => row.type === type);
    const converted = rows.filter((row) => ["booked", "won"].includes(row.status)).length;
    return { type, converted, total: rows.length, rate: rows.length ? Math.round((converted / rows.length) * 100) : 0 };
  });
  return { summary, workflowComparison, conversionSummary, reportSnapshots: newest(store.reportSnapshots) };
}

export function getContactsView() {
  return getStore().contacts.map((contact) => ({
    ...contact,
    opportunities: getStore().opportunities.filter((row) => row.contactId === contact.id),
  }));
}

export function getCampaignsView() {
  const store = getStore();
  return store.campaigns.map((campaign) => ({
    ...campaign,
    steps: store.campaignSteps.filter((row) => row.campaignId === campaign.id).sort((a, b) => a.stepOrder - b.stepOrder),
  }));
}

export const getTemplatesView = () => getStore().templates;
export const getIntegrationsView = () => getStore().integrationConnections;

export function getSettingsView() {
  const store = getStore();
  return {
    business: store.business,
    users: store.users,
    defaults: {
      timezone: store.business.timezone,
      staleEstimateDays: store.business.staleEstimateDays,
      attributionWindowDays: store.business.attributionWindowDays,
      highValueThreshold: store.business.highValueThreshold,
      duplicateMissedCallWindowHours: store.business.duplicateMissedCallWindowHours,
    },
  };
}

export type DemoActionInput =
  | { action: "simulate_missed_call" }
  | { action: "simulate_reply" }
  | { action: "log_booking"; opportunityId?: string }
  | { action: "enroll_estimate_follow_up"; estimateId?: string }
  | { action: "mark_estimate"; estimateId: string; outcome: "responded" | "booked" | "lost" }
  | { action: "launch_reactivation"; segmentKey: ReactivationSegmentKey }
  | { action: "assign_owner"; opportunityId: string; ownerUserId: string }
  | { action: "add_note"; opportunityId: string; body: string; authorUserId?: string }
  | { action: "duplicate_template"; templateId: string }
  | { action: "archive_template"; templateId: string }
  | { action: "create_campaign"; name: string; type: OpportunityType; segmentKey: Campaign["segmentKey"]; audienceLabel: string }
  | { action: "update_campaign_status"; campaignId: string; status: CampaignStatus }
  | { action: "toggle_integration"; provider: IntegrationProvider }
  | { action: "test_integration"; provider: IntegrationProvider };

export function performDemoAction(input: DemoActionInput) {
  switch (input.action) {
    case "simulate_missed_call":
      return simulateMissedInboundCall();
    case "simulate_reply":
      return simulateReply();
    case "log_booking":
      return logBooking(input.opportunityId);
    case "enroll_estimate_follow_up":
      return enrollEstimateFollowUp(input.estimateId);
    case "mark_estimate":
      return markEstimateOutcome(input.estimateId, input.outcome);
    case "launch_reactivation":
      return launchReactivationCampaign(input.segmentKey);
    case "assign_owner":
      return assignOpportunityOwner(input.opportunityId, input.ownerUserId);
    case "add_note":
      return addOpportunityNote(input.opportunityId, input.body, input.authorUserId);
    case "duplicate_template":
      return duplicateTemplate(input.templateId);
    case "archive_template":
      return archiveTemplate(input.templateId);
    case "create_campaign":
      return createCampaign(input);
    case "update_campaign_status":
      return updateCampaignStatus(input.campaignId, input.status);
    case "toggle_integration":
      return connectOrDisconnectIntegration(input.provider);
    case "test_integration":
      return testIntegration(input.provider);
  }
}
