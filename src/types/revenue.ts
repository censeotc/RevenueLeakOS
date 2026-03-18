export type OpportunityType =
  | "UNSOLD_ESTIMATE"
  | "MISSED_CALL"
  | "LAPSED_CUSTOMER"
  | "MANUAL";

export type OpportunityStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "WON"
  | "LOST"
  | "DISMISSED";

export type EstimateStatus =
  | "PENDING"
  | "APPROVED"
  | "DECLINED"
  | "EXPIRED"
  | "FOLLOW_UP";

export type CallDirection = "INBOUND" | "OUTBOUND";
export type CallStatus = "COMPLETED" | "MISSED" | "VOICEMAIL" | "BUSY";

export type CampaignType =
  | "ESTIMATE_FOLLOWUP"
  | "REACTIVATION"
  | "MISSED_CALL"
  | "CUSTOM";

export type CampaignStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED";

export type IntegrationStatus = "CONNECTED" | "DISCONNECTED" | "ERROR";

export type Role = "OWNER" | "MANAGER" | "STAFF";

export interface KpiSnapshot {
  totalRecoverable: number;
  recovered: number;
  recoveryRate: number;
  openOpportunities: number;
  avgResponseTime: number;
}

export interface RecoveryTrendPoint {
  date: string;
  recovered: number;
  missed: number;
}

export interface WorkflowPerformance {
  workflow: string;
  sent: number;
  converted: number;
  revenue: number;
}

export interface RecentActivity {
  id: string;
  type: "opportunity" | "call" | "campaign" | "estimate";
  description: string;
  timestamp: string;
}

export interface Alert {
  id: string;
  severity: "info" | "warning" | "critical";
  message: string;
  createdAt: string;
}

export interface DashboardData {
  kpis: KpiSnapshot;
  recoveryTrend: RecoveryTrendPoint[];
  workflowPerformance: WorkflowPerformance[];
  recentActivity: RecentActivity[];
  alerts: Alert[];
}

export interface ContactRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  tags: string[];
  source: string | null;
  lastJobAt: string | null;
}

export interface OpportunityRow {
  id: string;
  type: OpportunityType;
  status: OpportunityStatus;
  value: number;
  description: string | null;
  contactName: string;
  createdAt: string;
}

export interface EstimateRow {
  id: string;
  number: string;
  amount: number;
  status: EstimateStatus;
  issuedAt: string;
  contactName: string;
}

export interface CallRow {
  id: string;
  direction: CallDirection;
  status: CallStatus;
  from: string;
  to: string;
  duration: number;
  contactName: string | null;
  createdAt: string;
}

export interface CampaignRow {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  stepsCount: number;
  createdAt: string;
}

export interface TemplateRow {
  id: string;
  name: string;
  channel: string;
  subject: string | null;
  body: string;
  variables: string[];
}

export interface IntegrationRow {
  id: string;
  provider: string;
  status: IntegrationStatus;
}

export interface ReactivationSegment {
  id: string;
  label: string;
  count: number;
  estimatedValue: number;
  criteria: string;
}

export interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  target: string;
}
