export type UserRole = "owner" | "manager" | "csr" | "readonly";
export type OpportunityType = "missed_call" | "estimate_rescue" | "reactivation";
export type OpportunityStatus = "open" | "attempted" | "responded" | "booked" | "won" | "lost" | "closed";
export type CallDisposition = "missed" | "after_hours" | "abandoned" | "responded" | "booked" | "lost";
export type CallDirection = "inbound" | "outbound";
export type EstimateStatus = "open" | "stale" | "enrolled" | "responded" | "booked" | "lost";
export type CampaignStatus = "draft" | "active" | "paused" | "completed";
export type TemplateStatus = "draft" | "active" | "archived";
export type MessageDirection = "inbound" | "outbound";
export type MessageChannel = "sms" | "email";
export type BookingStatus = "scheduled" | "completed" | "canceled";
export type BookingSource = "missed_call" | "estimate_rescue" | "reactivation" | "manual";
export type ActivityType =
  | "alert"
  | "opportunity_updated"
  | "message_sent"
  | "message_received"
  | "booking_created"
  | "campaign_launched"
  | "note_added"
  | "call_captured"
  | "estimate_enrolled"
  | "integration_tested";
export type IntegrationProvider =
  | "twilio"
  | "jobber"
  | "housecall_pro"
  | "service_titan"
  | "gmail"
  | "outlook"
  | "google_calendar"
  | "csv_import";
export type ConnectionStatus = "connected" | "disconnected" | "error";
export type AlertSeverity = "info" | "warning" | "critical";
export type ReactivationSegmentKey =
  | "no_service_12_months"
  | "maintenance_due"
  | "membership_renewal"
  | "replacement_cycle";

export interface Business {
  id: string;
  name: string;
  timezone: string;
  staleEstimateDays: number;
  attributionWindowDays: number;
  highValueThreshold: number;
  duplicateMissedCallWindowHours: number;
  phone: string;
  website: string;
}

export interface AppUser {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export interface Location {
  id: string;
  businessId: string;
  name: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  isPrimary: boolean;
}

export interface Contact {
  id: string;
  businessId: string;
  locationId?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  tags: string[];
  notes?: string;
  lifecycleStage: string;
  lastServiceDate?: string;
  lastEstimateDate?: string;
  dormantSince?: string;
  membershipRenewalDate?: string;
  replacementCycleDate?: string;
}

export interface Opportunity {
  id: string;
  businessId: string;
  contactId: string;
  ownerUserId?: string;
  campaignId?: string;
  type: OpportunityType;
  status: OpportunityStatus;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  valueCents: number;
  directRevenueCents: number;
  influencedRevenueCents: number;
  sourceLabel?: string;
  createdAt: string;
  updatedAt: string;
  lastTouchedAt: string;
  closedAt?: string;
}

export interface OpportunityNote {
  id: string;
  opportunityId: string;
  authorUserId: string;
  body: string;
  createdAt: string;
}

export interface CallEvent {
  id: string;
  businessId: string;
  contactId?: string;
  opportunityId?: string;
  fromPhone: string;
  toPhone: string;
  direction: CallDirection;
  disposition: CallDisposition;
  durationSeconds: number;
  afterHours: boolean;
  respondedAt?: string;
  bookedAt?: string;
  startedAt: string;
  summary?: string;
  smsPreview?: string;
  bookingLogged: boolean;
}

export interface Estimate {
  id: string;
  businessId: string;
  contactId: string;
  opportunityId?: string;
  number: string;
  serviceType: string;
  amountCents: number;
  status: EstimateStatus;
  createdAt: string;
  sentAt: string;
  staleSince?: string;
  enrolledInFollowUp: boolean;
  respondedAt?: string;
  bookedAt?: string;
  lostAt?: string;
}

export interface Campaign {
  id: string;
  businessId: string;
  name: string;
  type: OpportunityType;
  status: CampaignStatus;
  audienceLabel: string;
  segmentKey: ReactivationSegmentKey | "estimate_follow_up" | "after_hours_callbacks";
  description?: string;
  createdAt: string;
  updatedAt: string;
  launchedAt?: string;
  completedAt?: string;
  metrics?: Record<string, number>;
}

export interface CampaignStep {
  id: string;
  campaignId: string;
  stepOrder: number;
  channel: MessageChannel;
  delayHours: number;
  templateId?: string;
  bodyPreview: string;
}

export interface Template {
  id: string;
  businessId: string;
  name: string;
  channel: MessageChannel;
  status: TemplateStatus;
  subject?: string;
  body: string;
  variables: string[];
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageEvent {
  id: string;
  businessId: string;
  contactId: string;
  opportunityId?: string;
  templateId?: string;
  direction: MessageDirection;
  channel: MessageChannel;
  body: string;
  deliveryStatus: string;
  sentAt?: string;
  receivedAt?: string;
}

export interface Booking {
  id: string;
  businessId: string;
  contactId: string;
  opportunityId?: string;
  bookedAt: string;
  serviceDate: string;
  valueCents: number;
  status: BookingStatus;
  source: BookingSource;
  notes?: string;
}

export interface ActivityLog {
  id: string;
  businessId: string;
  type: ActivityType;
  title: string;
  detail?: string;
  severity?: AlertSeverity;
  entityType?: string;
  entityId?: string;
  createdAt: string;
}

export interface IntegrationConnection {
  id: string;
  businessId: string;
  provider: IntegrationProvider;
  status: ConnectionStatus;
  accountLabel?: string;
  connectedAt?: string;
  lastTestedAt?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface ReportSnapshot {
  id: string;
  businessId: string;
  snapshotDate: string;
  directRevenueCents: number;
  influencedRevenueCents: number;
  recoveredOpportunities: number;
  bookingsCreated: number;
  avgResponseTimeMinutes: number;
  estimatesReopened: number;
  customersReactivated: number;
  workflowBreakdown: Record<OpportunityType, { influencedRevenueCents: number; recoveredOpportunities: number }>;
}

export interface DemoDataset {
  business: Business;
  users: AppUser[];
  locations: Location[];
  contacts: Contact[];
  opportunities: Opportunity[];
  opportunityNotes: OpportunityNote[];
  callEvents: CallEvent[];
  estimates: Estimate[];
  campaigns: Campaign[];
  campaignSteps: CampaignStep[];
  templates: Template[];
  messageEvents: MessageEvent[];
  bookings: Booking[];
  activityLogs: ActivityLog[];
  integrationConnections: IntegrationConnection[];
  reportSnapshots: ReportSnapshot[];
}
