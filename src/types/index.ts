export type UserRole = "owner" | "manager" | "csr";

export interface Business {
  id: string;
  name: string;
  phone: string;
  email: string;
  timezone: string;
  staleEstimateDays: number;
  attributionWindowDays: number;
  highValueThreshold: number;
  missedCallSuppressionHours: number;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  tags: string[];
  source: string;
  lastServiceDate: Date | undefined;
  lifetimeValue: number;
}

export type OpportunityType = "missed_call" | "estimate_rescue" | "reactivation";
export type OpportunityStatus =
  | "new"
  | "contacted"
  | "in_progress"
  | "responded"
  | "booked"
  | "won"
  | "lost";

export interface Opportunity {
  id: string;
  type: OpportunityType;
  status: OpportunityStatus;
  title: string;
  description: string | null;
  estimatedValue: number;
  actualValue: number | null;
  source: string;
  contactId: string;
  assignedToId: string | null;
  createdAt: Date;
  resolvedAt: Date | null;
}

export type CallDirection = "inbound" | "outbound";
export type CallStatus =
  | "missed"
  | "after_hours"
  | "responded"
  | "booked"
  | "lost"
  | "abandoned";

export interface CallEvent {
  id: string;
  callerNumber: string;
  calledNumber: string;
  direction: CallDirection;
  status: CallStatus;
  duration: number;
  callerName: string | null;
  callTime: Date;
  contactId: string;
  opportunityId: string | null;
}

export type EstimateStatus =
  | "sent"
  | "viewed"
  | "stale"
  | "follow_up"
  | "booked"
  | "expired";

export interface Estimate {
  id: string;
  estimateNumber: string;
  amount: number;
  serviceType: string;
  description: string | null;
  status: EstimateStatus;
  sentAt: Date;
  viewedAt: Date | null;
  followUpCount: number;
  contactId: string;
  opportunityId: string | null;
}

export type CampaignStatus = "draft" | "active" | "paused" | "completed";
export type CampaignStepType = "sms" | "email" | "call" | "wait";

export interface CampaignStep {
  id: string;
  stepOrder: number;
  type: CampaignStepType;
  templateId?: string;
  delayHours: number;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  type: string;
  status: CampaignStatus;
  targetCount: number;
  sentCount: number;
  responseCount: number;
  bookedCount: number;
  steps: CampaignStep[];
}

export type TemplateType = "sms" | "email";

export interface Template {
  id: string;
  name: string;
  type: TemplateType;
  subject: string | null;
  body: string;
  variables: string[];
  isArchived: boolean;
}

export type MessageChannel = "sms" | "email";
export type MessageDirection = "inbound" | "outbound";

export interface MessageEvent {
  id: string;
  channel: MessageChannel;
  direction: MessageDirection;
  toNumber: string | null;
  fromNumber: string | null;
  body: string;
  contactId: string;
  opportunityId: string | null;
  sentAt: Date;
}

export interface Booking {
  id: string;
  title: string;
  description: string;
  scheduledAt: Date;
  duration: number;
  serviceType: string;
  estimatedValue: number;
  status: "scheduled" | "completed" | "cancelled";
  contactId: string;
  opportunityId?: string;
  bookedById: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export type IntegrationStatus = "connected" | "disconnected" | "pending";

export interface Integration {
  provider: string;
  status: IntegrationStatus;
  lastSyncAt: Date | null;
  name: string;
  description: string;
  icon: string;
}

export interface ReportSnapshot {
  periodStart: Date;
  periodEnd: Date;
  revenueInfluenced: number;
  revenueRecovered: number;
  opportunitiesCreated: number;
  opportunitiesRecovered: number;
  bookingsCreated: number;
  avgResponseMinutes: number;
  estimatesReopened: number;
  customersReactivated: number;
  missedCallsHandled: number;
  conversionRate: number;
}

export interface DashboardSummary {
  revenueInfluenced: number;
  opportunitiesRecovered: number;
  bookingsCreated: number;
  avgResponseMinutes: number;
  estimatesReopened: number;
  customersReactivated: number;
}

export interface Alert {
  id: string;
  type: "missed_call" | "stale_estimate" | "campaign_complete" | "high_value";
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  linkTo?: string;
}
