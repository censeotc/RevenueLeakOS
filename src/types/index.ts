export type {
  Business,
  User,
  Location,
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

export type {
  UserRole,
  OpportunityType,
  OpportunityStatus,
  CallDirection,
  CallStatus,
  EstimateStatus,
  CampaignStatus,
  CampaignStepType,
  MessageChannel,
  MessageDirection,
  TemplateType,
  IntegrationProvider,
  ConnectionStatus,
} from "@prisma/client";

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
