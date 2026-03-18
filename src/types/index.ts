// Local type definitions (mirror Prisma schema for demo mode)

export type UserRole = "owner" | "manager" | "csr" | "readonly";
export type OpportunityType = "missed_call" | "estimate_rescue" | "reactivation";
export type OpportunityStatus = "new" | "contacted" | "in_progress" | "responded" | "booked" | "won" | "lost" | "closed";
export type CallDirection = "inbound" | "outbound";
export type CallStatus = "missed" | "after_hours" | "abandoned" | "responded" | "booked" | "lost";
export type EstimateStatus = "sent" | "viewed" | "stale" | "follow_up" | "responded" | "booked" | "lost" | "expired";
export type CampaignStatus = "draft" | "active" | "paused" | "completed";
export type CampaignStepType = "sms" | "email" | "call" | "wait";
export type MessageChannel = "sms" | "email" | "phone";
export type MessageDirection = "inbound" | "outbound";
export type TemplateType = "sms" | "email";
export type IntegrationProvider = "twilio" | "jobber" | "housecall_pro" | "service_titan" | "gmail" | "outlook" | "google_calendar" | "csv_import";
export type ConnectionStatus = "connected" | "disconnected" | "error" | "pending";

export interface Business {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  timezone: string;
  staleEstimateDays: number;
  attributionWindowDays: number;
  highValueThreshold: number;
  missedCallSuppressionHours: number;
  logoUrl?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string | null;
  phone?: string | null;
  isActive: boolean;
  businessId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  id: string;
  name: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  phone?: string | null;
  businessId: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  tags: string[];
  source?: string | null;
  lastServiceDate?: Date | null;
  lifetimeValue: number;
  businessId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Opportunity {
  id: string;
  type: OpportunityType;
  status: OpportunityStatus;
  title: string;
  description?: string | null;
  estimatedValue: number;
  actualValue?: number | null;
  source?: string | null;
  priority: number;
  contactId: string;
  businessId: string;
  assignedToId?: string | null;
  resolvedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OpportunityNote {
  id: string;
  content: string;
  opportunityId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CallEvent {
  id: string;
  callerNumber: string;
  calledNumber: string;
  direction: CallDirection;
  status: CallStatus;
  duration: number;
  recordingUrl?: string | null;
  callerName?: string | null;
  callTime: Date;
  contactId?: string | null;
  opportunityId?: string | null;
  businessId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Estimate {
  id: string;
  estimateNumber?: string | null;
  amount: number;
  serviceType: string;
  description?: string | null;
  status: EstimateStatus;
  sentAt: Date;
  viewedAt?: Date | null;
  expiresAt?: Date | null;
  followUpCount: number;
  contactId: string;
  opportunityId?: string | null;
  businessId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string | null;
  type: OpportunityType;
  status: CampaignStatus;
  targetCount: number;
  sentCount: number;
  responseCount: number;
  bookedCount: number;
  businessId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignStep {
  id: string;
  campaignId: string;
  stepOrder: number;
  type: CampaignStepType;
  templateId?: string | null;
  delayHours: number;
  subject?: string | null;
  body?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  name: string;
  type: TemplateType;
  subject?: string | null;
  body: string;
  variables: string[];
  isArchived: boolean;
  businessId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageEvent {
  id: string;
  channel: MessageChannel;
  direction: MessageDirection;
  toNumber?: string | null;
  fromNumber?: string | null;
  toEmail?: string | null;
  fromEmail?: string | null;
  subject?: string | null;
  body: string;
  status: string;
  externalId?: string | null;
  contactId?: string | null;
  opportunityId?: string | null;
  businessId: string;
  sentAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  title: string;
  description?: string | null;
  scheduledAt: Date;
  duration: number;
  serviceType?: string | null;
  estimatedValue?: number | null;
  status: string;
  contactId: string;
  opportunityId?: string | null;
  businessId: string;
  bookedById?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown> | null;
  userId?: string | null;
  businessId: string;
  createdAt: Date;
}

export interface IntegrationConnection {
  id: string;
  provider: IntegrationProvider;
  status: ConnectionStatus;
  config?: string | null;
  lastSyncAt?: Date | null;
  businessId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportSnapshot {
  id: string;
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
  metadata?: string | null;
  businessId: string;
  createdAt: Date;
}

// Extended/enriched types

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

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  href: string;
}

export interface ReactivationSegment {
  id: string;
  name: string;
  description: string;
  count: number;
  estimatedValue: number;
  criteria: string;
}

export interface OpportunityWithRelations {
  id: string;
  type: string;
  status: string;
  title: string;
  description: string | null;
  estimatedValue: number;
  actualValue: number | null;
  source: string | null;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt: Date | null;
  contact: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    email: string | null;
  };
  assignedTo: {
    id: string;
    name: string;
    email: string;
  } | null;
  notes: Array<{
    id: string;
    content: string;
    createdAt: Date;
    author: { name: string };
  }>;
}

export interface CallEventWithRelations {
  id: string;
  callerNumber: string;
  calledNumber: string;
  direction: string;
  status: string;
  duration: number;
  callerName: string | null;
  callTime: Date;
  contact: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  opportunity: {
    id: string;
    title: string;
    status: string;
  } | null;
}

export interface EstimateWithRelations {
  id: string;
  estimateNumber: string | null;
  amount: number;
  serviceType: string;
  description: string | null;
  status: string;
  sentAt: Date;
  viewedAt: Date | null;
  followUpCount: number;
  contact: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    email: string | null;
  };
  opportunity: {
    id: string;
    title: string;
    status: string;
  } | null;
}

// Demo session type
export interface DemoSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  businessId: string;
  businessName: string;
}
