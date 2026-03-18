import type { BusinessProfile, CallRecord, CampaignRecord, ContactRecord, EstimateRecord, IntegrationRecord, NotificationPreference, Opportunity, PermissionMatrixRow, ReactivationSegment, TemplateRecord, UserRecord } from "@/types/revenue";

export const businessProfile: BusinessProfile = { name: "Sunrise Comfort Co.", phone: "(512) 555-0192", website: "https://sunrisecomfort.example", timezone: "America/Chicago", staleEstimateDays: 5, attributionWindowDays: 30, highValueThreshold: 120000, duplicateMissedCallWindowHours: 12 };
export const opportunities: Opportunity[] = [
  { id: "opp-101", title: "After-hours plumbing miss", type: "Missed call", status: "open", priority: "High", owner: "Jamie Cruz", contactName: "Morgan Reed", valueCents: 185000, source: "Twilio call event", lastTouched: "12 minutes ago", nextAction: "Send after-hours SMS and schedule callback at 8am.", notes: [{ id: "note-1", author: "Jamie Cruz", createdAt: "Today, 7:12 AM", body: "Customer mentioned a leaking water heater and asked for same-day availability." }] },
  { id: "opp-102", title: "Unanswered estimate follow-up", type: "Estimate rescue", status: "attempted", priority: "Medium", owner: "Avery Lane", contactName: "Daniel Cho", valueCents: 940000, source: "Estimator CSV import", lastTouched: "3 hours ago", nextAction: "Queue owner call if no reply after second SMS.", notes: [{ id: "note-2", author: "Avery Lane", createdAt: "Yesterday, 3:45 PM", body: "Quote is still within budget range; timing appears to be the main objection." }] },
  { id: "opp-103", title: "Dormant maintenance member", type: "Reactivation", status: "responded", priority: "Medium", owner: "Nina Patel", contactName: "Chris Nolan", valueCents: 420000, source: "Reactivation segment", lastTouched: "1 day ago", nextAction: "Offer membership renewal bundle with spring tune-up slot.", notes: [{ id: "note-3", author: "Nina Patel", createdAt: "Monday, 10:22 AM", body: "Customer replied that they moved homes but still own rental properties in service area." }] }
];
export const calls: CallRecord[] = [
  { id: "call-1", caller: "Morgan Reed", phone: "(512) 555-0148", disposition: "Missed", direction: "Inbound", startTime: "Today, 7:06 AM", durationSeconds: 0, summary: "Missed call during after-hours window for plumbing emergency.", thread: [{ id: "msg-1", direction: "outbound", channel: "sms", body: "Thanks for calling Sunrise Comfort. We open at 8am and can text you sooner if urgent.", timestamp: "Today, 7:08 AM" }] },
  { id: "call-2", caller: "Taylor James", phone: "(512) 555-0174", disposition: "Booked", direction: "Inbound", startTime: "Today, 9:33 AM", durationSeconds: 284, summary: "CSR converted a replacement inquiry into an in-home consultation.", thread: [] }
];
export const estimates: EstimateRecord[] = [
  { id: "est-1", number: "EST-2043", customer: "Daniel Cho", serviceType: "Whole-home repipe", amountCents: 940000, status: "stale", sentAt: "4 days ago", staleSince: "Yesterday", enrolledInFollowUp: true },
  { id: "est-2", number: "EST-2048", customer: "Isabella Hart", serviceType: "Heat pump upgrade", amountCents: 1260000, status: "open", sentAt: "1 day ago", enrolledInFollowUp: false }
];
export const reactivationSegments: ReactivationSegment[] = [
  { id: "seg-1", name: "Dormant club members", audienceSize: 184, estimatedValueCents: 5400000, reason: "Members due for maintenance with no booked visit in 14 months.", contacts: [{ name: "Chris Nolan", lastService: "14 months ago", opportunityValueCents: 320000 }, { name: "Emma Rivers", lastService: "16 months ago", opportunityValueCents: 280000 }] },
  { id: "seg-2", name: "Aging water heaters", audienceSize: 73, estimatedValueCents: 8600000, reason: "Install base with replacement cycle approaching 10+ years.", contacts: [{ name: "Sofia Grant", lastService: "22 months ago", opportunityValueCents: 1600000 }, { name: "Leo Austin", lastService: "20 months ago", opportunityValueCents: 1450000 }] }
];
export const campaigns: CampaignRecord[] = [
  { id: "cmp-1", name: "Stale estimate rescue", type: "Estimate rescue", status: "active", audienceLabel: "Quotes > 5 days old", launches: "Daily at 8:30 AM", recoveredRevenueCents: 5200000, steps: [{ id: "step-1", order: 1, channel: "sms", delayHours: 0, bodyPreview: "Quick check-in after your estimate..." }, { id: "step-2", order: 2, channel: "email", delayHours: 24, bodyPreview: "Recap and financing reminder" }] },
  { id: "cmp-2", name: "Maintenance member win-back", type: "Reactivation", status: "draft", audienceLabel: "Dormant members", launches: "Manual review", recoveredRevenueCents: 1800000, steps: [{ id: "step-3", order: 1, channel: "email", delayHours: 0, bodyPreview: "Seasonal tune-up invitation" }] }
];
export const contacts: ContactRecord[] = [
  { id: "ct-1", name: "Morgan Reed", phone: "(512) 555-0148", email: "morgan@example.com", tags: ["Emergency", "Plumbing"], lifecycleStage: "Lead", lastServiceDate: "No prior service", lastOpportunityValueCents: 185000 },
  { id: "ct-2", name: "Daniel Cho", phone: "(512) 555-0182", email: "daniel@example.com", tags: ["Estimate", "High value"], lifecycleStage: "Quoted", lastServiceDate: "3 months ago", lastOpportunityValueCents: 940000 }
];
export const templates: TemplateRecord[] = [
  { id: "tpl-1", name: "After-hours missed call SMS", channel: "sms", status: "active", body: "Hi {{first_name}}, sorry we missed your call. Reply here and we will line up the next available technician.", variables: ["first_name", "service_line"] },
  { id: "tpl-2", name: "Estimate follow-up email", channel: "email", status: "draft", subject: "Quick follow-up on your estimate", body: "We wanted to make sure you had everything you needed to move forward with {{service_type}}.", variables: ["service_type", "technician_name"] }
];
export const integrations: IntegrationRecord[] = [
  { id: "int-1", provider: "Twilio", status: "connected", accountLabel: "Main messaging account", lastSync: "6 minutes ago", summary: "Inbound calls and SMS webhook events are healthy." },
  { id: "int-2", provider: "CSV import", status: "connected", accountLabel: "Estimator exports", lastSync: "Yesterday", summary: "Last quote upload processed 57 rows with no schema errors." },
  { id: "int-3", provider: "ServiceTitan", status: "disconnected", accountLabel: "No account linked", lastSync: "Not connected", summary: "Use for booking attribution and customer lifecycle sync." }
];
export const users: UserRecord[] = [
  { id: "usr-1", name: "Avery Lane", email: "avery@example.com", role: "owner", status: "Active" },
  { id: "usr-2", name: "Jamie Cruz", email: "jamie@example.com", role: "manager", status: "Active" },
  { id: "usr-3", name: "Nina Patel", email: "nina@example.com", role: "csr", status: "Invited" }
];
export const permissionMatrix: PermissionMatrixRow[] = [
  { capability: "View dashboard", owner: true, manager: true, csr: true, readonly: true },
  { capability: "Launch campaigns", owner: true, manager: true, csr: false, readonly: false },
  { capability: "Manage users", owner: true, manager: false, csr: false, readonly: false },
  { capability: "Export reports", owner: true, manager: true, csr: false, readonly: true }
];
export const notificationPreferences: NotificationPreference[] = [
  { id: "notif-1", label: "Critical missed calls", channel: "SMS", enabled: true },
  { id: "notif-2", label: "Daily recovery digest", channel: "Email", enabled: true },
  { id: "notif-3", label: "Estimate SLA breaches", channel: "Slack", enabled: false }
];
