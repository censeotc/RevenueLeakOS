// ─── Shared Enums ─────────────────────────────────────────────────────────────

export type UserRole = "OWNER" | "ADMIN" | "MANAGER" | "MEMBER" | "READ_ONLY";

export type OpportunityType =
  | "MISSED_CALL"
  | "UNANSWERED_ESTIMATE"
  | "LOST_JOB"
  | "REACTIVATION"
  | "FOLLOW_UP";

export type OpportunityStatus = "OPEN" | "IN_PROGRESS" | "WON" | "LOST" | "DISMISSED";

export type EstimateStatus = "PENDING" | "VIEWED" | "ACCEPTED" | "DECLINED" | "EXPIRED";

export type CampaignType =
  | "ESTIMATE_FOLLOWUP"
  | "MISSED_CALL"
  | "REACTIVATION"
  | "WIN_BACK"
  | "REVIEW_REQUEST"
  | "CUSTOM";

export type CampaignStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED";

export type CampaignStepTypeEnum = "SMS" | "EMAIL" | "WAIT" | "CONDITION";

export type TemplateType = "SMS" | "EMAIL";

export type IntegrationStatusType = "CONNECTED" | "DISCONNECTED" | "ERROR" | "PENDING";

// ─── Domain Objects ───────────────────────────────────────────────────────────

export interface ContactBasic {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  email?: string | null;
}

export interface ContactRecord extends ContactBasic {
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  tags?: string[];
  optedInSms?: boolean;
  optedInEmail?: boolean;
  source?: string | null;
  opportunityCount?: number;
  estimateCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OpportunityNote {
  id: string;
  content: string;
  createdAt: string;
  authorId?: string | null;
  authorName?: string | null;
}

export interface Opportunity {
  id: string;
  type: OpportunityType;
  status: OpportunityStatus;
  value: number;
  description?: string | null;
  sourceRef?: string | null;
  recoveredAt?: string | null;
  dueAt?: string | null;
  createdAt: string;
  updatedAt: string;
  contact?: ContactBasic | null;
  estimate?: EstimateRecord | null;
  notes?: OpportunityNote[];
}

export interface EstimateRecord {
  id: string;
  externalId?: string | null;
  title?: string | null;
  amount: number;
  status: EstimateStatus;
  sentAt?: string | null;
  viewedAt?: string | null;
  respondedAt?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  contact?: ContactBasic | null;
}

export interface CallRecord {
  id: string;
  type: "VOICE" | "SMS";
  direction: "INBOUND" | "OUTBOUND";
  status: string;
  duration?: number | null;
  recordingUrl?: string | null;
  transcript?: string | null;
  body?: string | null;
  twilioSid?: string | null;
  createdAt: string;
  contactName?: string | null;
  phone?: string | null;
}

export interface SmsThread {
  id: string;
  contactName: string;
  phone: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface CampaignStep {
  id: string;
  order: number;
  type: CampaignStepTypeEnum;
  delayDays: number;
  delayHours: number;
  subject?: string | null;
  body: string;
  templateId?: string | null;
}

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  description?: string | null;
  goal?: string | null;
  launchedAt?: string | null;
  completedAt?: string | null;
  steps?: CampaignStep[];
  enrolledCount?: number;
  convertedCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateRecord {
  id: string;
  name: string;
  type: TemplateType;
  subject?: string | null;
  body: string;
  variables?: string[];
  isSystem?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationItem {
  id: string;
  name: string;
  description: string;
  logoText: string;
  status: IntegrationStatusType;
  provider: string;
  connectedAt?: string | null;
  lastSyncAt?: string | null;
}

export interface ReactivationSegment {
  id: string;
  name: string;
  description: string;
  filterLabel: string;
  contactCount: number;
  estimatedValue: number;
}

export interface ContactPreview {
  id: string;
  name: string;
  phone?: string;
  lastJobDate?: string;
  lifetimeValue?: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  contactName?: string;
  createdAt: string;
}

export interface AlertItem {
  id: string;
  title: string;
  description?: string;
  severity: "warning" | "info" | "success";
}

export interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  duration?: number;
  visualization?: "opportunity" | "sms" | "won" | null;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface DashboardReport {
  revenueRecovered: number;
  openOpportunities: number;
  totalOpportunities: number;
  estimatesCount: number;
  wonCount: number;
  period: string;
}

export interface KpiData {
  label: string;
  value: string;
  change: string;
  changeDirection: "up" | "down" | "neutral";
  subtext?: string;
}
