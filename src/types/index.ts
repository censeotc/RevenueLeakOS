export type {
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

export interface KpiCard {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  roles?: string[];
  badge?: number;
}

export interface Alert {
  id: string;
  type: "warning" | "info" | "success" | "error";
  title: string;
  description: string;
  createdAt: Date;
  isRead: boolean;
}

export interface QuickAction {
  label: string;
  href: string;
  icon: string;
  description: string;
}

export interface DashboardData {
  kpis: {
    revenueInfluenced: number;
    opportunitiesRecovered: number;
    bookingsCreated: number;
    avgResponseTime: number;
    estimatesReopened: number;
    customersReactivated: number;
  };
  recentActivity: ActivityItem[];
  alerts: Alert[];
  workflowPerformance: WorkflowPerformanceData[];
  recoveryTrend: RecoveryTrendData[];
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  entityType?: string;
  entityId?: string;
  userName?: string;
}

export interface WorkflowPerformanceData {
  workflow: string;
  opportunities: number;
  recovered: number;
  revenue: number;
}

export interface RecoveryTrendData {
  date: string;
  missedCall: number;
  estimateRescue: number;
  reactivation: number;
}

export interface ReactivationSegment {
  id: string;
  name: string;
  description: string;
  contactCount: number;
  estimatedValue: number;
  criteria: string;
}

export interface IntegrationCard {
  provider: string;
  name: string;
  description: string;
  icon: string;
  status: string;
  lastSyncAt?: Date;
}
