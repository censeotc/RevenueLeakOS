// Re-export Prisma enums and types for use across the app
export type {
  Business,
  User,
  UserMembership,
  Contact,
  Opportunity,
  OpportunityNote,
  CallEvent,
  Estimate,
  Campaign,
  CampaignStep,
  Template,
  MessageEvent,
  Booking,
  ActivityLog,
  IntegrationConnection,
  ReportSnapshot,
} from "@prisma/client";

export {
  Industry,
  UserRole,
  ContactType,
  ContactStatus,
  OpportunityType,
  OpportunityStatus,
  EstimateStatus,
  CampaignType,
  CampaignStatus,
  ChannelType,
  MessageDirection,
  MessageStatus,
  AttributionMethod,
  BookingSourceType,
  IntegrationProvider,
  IntegrationStatus,
} from "@prisma/client";

// ─── Extended / composite types ───────────────────────────────────────────────

export interface OpportunityWithRelations {
  id: string;
  businessId: string;
  contactId: string;
  assignedToId: string | null;
  type: string;
  status: string;
  title: string;
  description: string | null;
  serviceType: string | null;
  estimatedValue: number | null;
  actualValue: number | null;
  attributionMethod: string | null;
  source: string | null;
  followUpCount: number;
  lastContactAt: Date | null;
  resolvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  contact: {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string;
    type: string;
    status: string;
  };
  assignedTo?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  notes?: OpportunityNoteWithAuthor[];
  _count?: {
    notes: number;
    callEvents: number;
    messageEvents: number;
    bookings: number;
  };
}

export interface OpportunityNoteWithAuthor {
  id: string;
  opportunityId: string;
  authorId: string | null;
  authorName: string;
  content: string;
  createdAt: Date;
}

export interface ContactWithStats {
  id: string;
  businessId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string;
  type: string;
  status: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  tags: string[];
  notes: string | null;
  lastServiceAt: Date | null;
  totalSpend: number;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    opportunities: number;
    bookings: number;
  };
}

export interface DashboardKPIs {
  revenueInfluenced: number;
  opportunitiesRecovered: number;
  bookingsCreated: number;
  avgResponseTimeMin: number;
  estimatesReopened: number;
  customersReactivated: number;
  revenueInfluencedDelta: number;
  opportunitiesDelta: number;
  bookingsDelta: number;
}

export interface WorkflowPerformance {
  name: string;
  sent: number;
  replied: number;
  booked: number;
  revenue: number;
}

export interface RecoveryTrendPoint {
  date: string;
  missedCall: number;
  estimateRescue: number;
  reactivation: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  description: string;
  createdAt: Date;
  contactName?: string;
  opportunityTitle?: string;
}

export interface Alert {
  id: string;
  type: "warning" | "info" | "success" | "error";
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  createdAt: Date;
}

// ─── Service layer types ───────────────────────────────────────────────────────

export interface CreateOpportunityInput {
  businessId: string;
  contactId: string;
  type: string;
  title: string;
  description?: string;
  serviceType?: string;
  estimatedValue?: number;
  source?: string;
  assignedToId?: string;
}

export interface UpdateOpportunityInput {
  status?: string;
  assignedToId?: string;
  estimatedValue?: number;
  actualValue?: number;
  serviceType?: string;
  description?: string;
  resolvedAt?: Date;
}

export interface SendSMSInput {
  to: string;
  body: string;
  opportunityId?: string;
  businessId: string;
}

export interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface ImportRow {
  [key: string]: string;
}

export interface ImportResult {
  total: number;
  imported: number;
  skipped: number;
  errors: { row: number; message: string }[];
}

// ─── UI helper types ──────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  roles?: string[];
}

export interface TabItem {
  label: string;
  value: string;
  count?: number;
}

export type SortDirection = "asc" | "desc";

export interface TableFilter {
  field: string;
  value: string | string[];
  operator?: "eq" | "in" | "contains" | "gte" | "lte";
}
