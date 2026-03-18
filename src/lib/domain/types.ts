export const industries = [
  "hvac",
  "plumbing",
  "electrical",
  "multi_trade",
  "other",
] as const;
export type Industry = (typeof industries)[number];

export const userRoles = ["owner", "manager", "csr", "readonly"] as const;
export type UserRole = (typeof userRoles)[number];

export const contactTypes = ["lead", "customer", "former_customer"] as const;
export type ContactType = (typeof contactTypes)[number];

export const contactStatuses = ["active", "dormant", "archived"] as const;
export type ContactStatus = (typeof contactStatuses)[number];

export const opportunityTypes = [
  "missed_call",
  "estimate_rescue",
  "reactivation",
] as const;
export type OpportunityType = (typeof opportunityTypes)[number];

export const opportunityStatuses = [
  "new",
  "attempted",
  "responded",
  "qualified",
  "booked",
  "lost",
  "paused",
  "closed",
] as const;
export type OpportunityStatus = (typeof opportunityStatuses)[number];

export const estimateStatuses = [
  "open",
  "stale",
  "responded",
  "booked",
  "lost",
] as const;
export type EstimateStatus = (typeof estimateStatuses)[number];

export const campaignTypes = [
  "missed_call_followup",
  "estimate_rescue",
  "reactivation",
] as const;
export type CampaignType = (typeof campaignTypes)[number];

export const campaignStatuses = [
  "draft",
  "scheduled",
  "active",
  "paused",
  "completed",
] as const;
export type CampaignStatus = (typeof campaignStatuses)[number];

export const channelTypes = ["sms", "email"] as const;
export type ChannelType = (typeof channelTypes)[number];

export const messageDirections = ["outbound", "inbound"] as const;
export type MessageDirection = (typeof messageDirections)[number];

export const messageStatuses = [
  "queued",
  "sent",
  "delivered",
  "failed",
  "replied",
] as const;
export type MessageStatus = (typeof messageStatuses)[number];

export const attributionMethods = ["direct", "influenced"] as const;
export type AttributionMethod = (typeof attributionMethods)[number];

export const bookingSourceTypes = [
  "missed_call",
  "estimate_rescue",
  "reactivation",
  "manual",
] as const;
export type BookingSourceType = (typeof bookingSourceTypes)[number];

export const integrationProviders = [
  "twilio",
  "jobber",
  "housecall_pro",
  "servicetitan",
  "gmail",
  "outlook",
  "google_calendar",
  "csv",
] as const;
export type IntegrationProvider = (typeof integrationProviders)[number];

export const integrationStatuses = [
  "connected",
  "disconnected",
  "error",
  "pending",
] as const;
export type IntegrationStatus = (typeof integrationStatuses)[number];

export type DemoBusiness = {
  id: string;
  name: string;
  industry: Industry;
  timezone: string;
  staleEstimateDays: number;
  attributionWindowDays: number;
  highValueThreshold: number;
  duplicateMissedCallSuppressionHours: number;
};

export type DemoUser = {
  id: string;
  businessId: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
};

export type DemoLocation = {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  isPrimary: boolean;
};

export type DemoContact = {
  id: string;
  businessId: string;
  locationId: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  email?: string;
  phone: string;
  type: ContactType;
  status: ContactStatus;
  tags: string[];
  source?: string;
  notesSummary?: string;
  lastServiceAt?: string;
  lastContactedAt?: string;
};

export type DemoOpportunity = {
  id: string;
  businessId: string;
  contactId: string;
  locationId: string;
  ownerId?: string;
  campaignId?: string;
  type: OpportunityType;
  status: OpportunityStatus;
  title: string;
  description?: string;
  serviceType: string;
  value: number;
  sourceLabel?: string;
  intakeSummary?: string;
  nextActionAt?: string;
  lastContactAt?: string;
  bookedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type DemoOpportunityNote = {
  id: string;
  opportunityId: string;
  authorId: string;
  body: string;
  createdAt: string;
};

export type DemoCallEvent = {
  id: string;
  businessId: string;
  opportunityId?: string;
  contactId: string;
  locationId: string;
  phoneNumber: string;
  direction: string;
  classification: string;
  ringDurationSeconds?: number;
  isAfterHours: boolean;
  wasAnswered: boolean;
  wasBooked: boolean;
  summary?: string;
  startedAt: string;
  endedAt?: string;
};

export type DemoEstimate = {
  id: string;
  businessId: string;
  opportunityId?: string;
  contactId: string;
  locationId: string;
  estimateNumber?: string;
  serviceType: string;
  amount: number;
  status: EstimateStatus;
  sentAt: string;
  staleAt?: string;
  respondedAt?: string;
  bookedAt?: string;
  lostAt?: string;
};

export type DemoCampaign = {
  id: string;
  businessId: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  segmentName?: string;
  channel: ChannelType;
  goal?: string;
  launchedAt?: string;
  completedAt?: string;
};

export type DemoCampaignStep = {
  id: string;
  campaignId: string;
  templateId?: string;
  position: number;
  title: string;
  channel: ChannelType;
  delayHours: number;
  stopOnReply: boolean;
  stopOnBooking: boolean;
  bodyOverride?: string;
};

export type DemoTemplate = {
  id: string;
  businessId: string;
  name: string;
  category: string;
  channel: ChannelType;
  subject?: string;
  body: string;
  variables: string[];
  isArchived: boolean;
};

export type DemoMessageEvent = {
  id: string;
  businessId: string;
  opportunityId?: string;
  contactId?: string;
  campaignId?: string;
  templateId?: string;
  channel: ChannelType;
  direction: MessageDirection;
  status: MessageStatus;
  body: string;
  sentAt?: string;
  deliveredAt?: string;
  repliedAt?: string;
  createdAt: string;
};

export type DemoBooking = {
  id: string;
  businessId: string;
  opportunityId?: string;
  contactId: string;
  locationId: string;
  sourceType: BookingSourceType;
  attributionMethod: AttributionMethod;
  title: string;
  scheduledFor: string;
  revenue: number;
  notes?: string;
};

export type DemoActivityLog = {
  id: string;
  businessId: string;
  opportunityId?: string;
  contactId?: string;
  campaignId?: string;
  actorUserId?: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
};

export type DemoIntegrationConnection = {
  id: string;
  businessId: string;
  provider: IntegrationProvider;
  status: IntegrationStatus;
  externalAccountId?: string;
  lastSyncAt?: string;
  errorMessage?: string;
  config?: Record<string, unknown>;
};

export type DemoReportSnapshot = {
  id: string;
  businessId: string;
  label: string;
  periodStart: string;
  periodEnd: string;
  revenueDirect: number;
  revenueInfluenced: number;
  opportunitiesRecovered: number;
  bookingsCreated: number;
  avgResponseMinutes: number;
  estimatesReopened: number;
  customersReactivated: number;
  workflowBreakdown: Array<{
    type: OpportunityType;
    recoveredRevenue: number;
    bookings: number;
    conversionRate: number;
  }>;
  trend: Array<{
    date: string;
    direct: number;
    influenced: number;
    opportunities: number;
  }>;
};

export type DemoAlert = {
  id: string;
  severity: "high" | "medium" | "low";
  title: string;
  message: string;
  actionLabel: string;
  href: string;
};

export type NavItem = {
  title: string;
  href: string;
  roles: UserRole[];
};

export type OpportunityWithRelations = DemoOpportunity & {
  contact: DemoContact;
  owner?: DemoUser;
  notes: DemoOpportunityNote[];
  callEvents: DemoCallEvent[];
  estimates: DemoEstimate[];
  messages: DemoMessageEvent[];
  bookings: DemoBooking[];
  activities: DemoActivityLog[];
};

export type DashboardMetrics = {
  revenueInfluenced: number;
  opportunitiesRecovered: number;
  bookingsCreated: number;
  avgResponseMinutes: number;
  estimatesReopened: number;
  customersReactivated: number;
};

export type DemoTenantData = {
  business: DemoBusiness;
  users: DemoUser[];
  locations: DemoLocation[];
  contacts: DemoContact[];
  opportunities: DemoOpportunity[];
  opportunityNotes: DemoOpportunityNote[];
  callEvents: DemoCallEvent[];
  estimates: DemoEstimate[];
  campaigns: DemoCampaign[];
  campaignSteps: DemoCampaignStep[];
  templates: DemoTemplate[];
  messageEvents: DemoMessageEvent[];
  bookings: DemoBooking[];
  activityLogs: DemoActivityLog[];
  integrationConnections: DemoIntegrationConnection[];
  reportSnapshots: DemoReportSnapshot[];
  alerts: DemoAlert[];
};
