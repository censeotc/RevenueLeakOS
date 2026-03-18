import type {
  OpportunityRow,
  EstimateRow,
  CallRow,
  ContactRow,
  CampaignRow,
  TemplateRow,
  IntegrationRow,
  ReactivationSegment,
} from "@/types/revenue";

export const demoContacts: ContactRow[] = [
  { id: "c1", firstName: "Alice", lastName: "Chen", email: "alice@example.com", phone: "+15559001001", tags: ["residential"], source: "website", lastJobAt: "2024-08-15" },
  { id: "c2", firstName: "Bob", lastName: "Martinez", email: "bob@example.com", phone: "+15559001002", tags: ["commercial"], source: "referral", lastJobAt: "2024-11-02" },
  { id: "c3", firstName: "Carol", lastName: "Johnson", email: "carol@example.com", phone: "+15559001003", tags: ["residential", "repeat"], source: "google_ads", lastJobAt: "2023-10-20" },
  { id: "c4", firstName: "Dave", lastName: "Kim", email: "dave@example.com", phone: "+15559001004", tags: ["residential"], source: "yelp", lastJobAt: "2024-12-01" },
  { id: "c5", firstName: "Eve", lastName: "Patel", email: "eve@example.com", phone: "+15559001005", tags: ["commercial", "priority"], source: "website", lastJobAt: null },
];

export const demoOpportunities: OpportunityRow[] = [
  { id: "o1", type: "UNSOLD_ESTIMATE", status: "OPEN", value: 4200, description: "AC replacement estimate — no response in 3 weeks", contactName: "Alice Chen", createdAt: "2025-01-05T10:00:00Z" },
  { id: "o2", type: "MISSED_CALL", status: "IN_PROGRESS", value: 350, description: "Missed call during lunch — callback scheduled", contactName: "Bob Martinez", createdAt: "2025-01-12T14:30:00Z" },
  { id: "o3", type: "LAPSED_CUSTOMER", status: "OPEN", value: 1800, description: "Last service 14 months ago — due for maintenance", contactName: "Carol Johnson", createdAt: "2025-01-08T09:15:00Z" },
  { id: "o4", type: "UNSOLD_ESTIMATE", status: "WON", value: 6500, description: "Furnace install — approved after follow-up", contactName: "Dave Kim", createdAt: "2024-12-20T11:00:00Z" },
];

export const demoEstimates: EstimateRow[] = [
  { id: "e1", number: "EST-1001", amount: 4200, status: "PENDING", issuedAt: "2025-01-05T10:00:00Z", contactName: "Alice Chen" },
  { id: "e2", number: "EST-1002", amount: 6500, status: "APPROVED", issuedAt: "2024-12-20T11:00:00Z", contactName: "Dave Kim" },
  { id: "e3", number: "EST-1003", amount: 980, status: "EXPIRED", issuedAt: "2024-11-01T09:00:00Z", contactName: "Eve Patel" },
];

export const demoCalls: CallRow[] = [
  { id: "cl1", direction: "INBOUND", status: "MISSED", from: "+15559001002", to: "+15551234567", duration: 0, contactName: "Bob Martinez", createdAt: "2025-01-12T14:30:00Z" },
  { id: "cl2", direction: "OUTBOUND", status: "COMPLETED", from: "+15551234567", to: "+15559001001", duration: 245, contactName: "Alice Chen", createdAt: "2025-01-10T16:00:00Z" },
];

export const demoCampaigns: CampaignRow[] = [
  { id: "cp1", name: "Unsold Estimate — 3-Touch Follow-Up", type: "ESTIMATE_FOLLOWUP", status: "ACTIVE", stepsCount: 3, createdAt: "2025-01-02T08:00:00Z" },
  { id: "cp2", name: "Winter Reactivation Blast", type: "REACTIVATION", status: "DRAFT", stepsCount: 2, createdAt: "2025-01-10T12:00:00Z" },
];

export const demoTemplates: TemplateRow[] = [
  { id: "t1", name: "Estimate Follow-Up SMS", channel: "sms", subject: null, body: "Hi {{firstName}}, just checking in on your {{service}} estimate (#{{estimateNumber}}). Have any questions?", variables: ["firstName", "service", "estimateNumber"] },
  { id: "t2", name: "Reactivation Email", channel: "email", subject: "We miss you, {{firstName}}!", body: "Hi {{firstName}},\n\nIt's been a while since your last visit...", variables: ["firstName", "equipmentType", "discountPercent", "businessName"] },
];

export const demoIntegrations: IntegrationRow[] = [
  { id: "i1", provider: "twilio", status: "CONNECTED" },
  { id: "i2", provider: "servicetitan", status: "DISCONNECTED" },
  { id: "i3", provider: "quickbooks", status: "DISCONNECTED" },
];

export const demoReactivationSegments: ReactivationSegment[] = [
  { id: "seg1", label: "Lapsed 6–12 months", count: 42, estimatedValue: 37800, criteria: "Last service 6–12 months ago" },
  { id: "seg2", label: "Lapsed 12–24 months", count: 28, estimatedValue: 22400, criteria: "Last service 12–24 months ago" },
  { id: "seg3", label: "Declined estimates", count: 15, estimatedValue: 18500, criteria: "Estimate declined or expired in last 6 months" },
];
