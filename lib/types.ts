import { OpportunityType, UserRole } from "@prisma/client";

export type OpportunityFilter = "all" | OpportunityType;

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  businessId: string;
};

export type DashboardKpi = {
  label: string;
  value: string;
  subtext?: string;
};

export type ReactivationSegmentKey =
  | "no_service_12_months"
  | "maintenance_due"
  | "membership_renewal"
  | "replacement_cycle";

export type ReactivationSegment = {
  key: ReactivationSegmentKey;
  label: string;
  description: string;
};
