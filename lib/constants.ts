import {
  CampaignStatus,
  IntegrationProvider,
  OpportunityStatus,
  OpportunityType,
} from "@prisma/client";

export const APP_NAME = "RevenueLeak OS";
export const DEMO_BUSINESS_NAME = "North Shore Heating & Plumbing";

export const DEFAULTS = {
  timezone: "America/Detroit",
  staleEstimateDays: 7,
  attributionWindowDays: 14,
  highValueThreshold: 2500,
  duplicateMissedCallSuppressionHours: 4,
} as const;

export const NAV_ITEMS = [
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/app/opportunities", label: "Opportunities" },
  { href: "/app/calls", label: "Calls" },
  { href: "/app/estimates", label: "Estimates" },
  { href: "/app/reactivation", label: "Reactivation" },
  { href: "/app/campaigns", label: "Campaigns" },
  { href: "/app/contacts", label: "Contacts" },
  { href: "/app/reports", label: "Reports" },
  { href: "/app/templates", label: "Templates" },
  { href: "/app/integrations", label: "Integrations" },
  { href: "/app/settings", label: "Settings" },
] as const;

export const OPPORTUNITY_TYPE_LABELS: Record<OpportunityType, string> = {
  missed_call: "Missed Call",
  estimate_rescue: "Estimate Rescue",
  reactivation: "Reactivation",
};

export const OPPORTUNITY_STATUS_LABELS: Record<OpportunityStatus, string> = {
  open: "Open",
  contacted: "Contacted",
  responded: "Responded",
  booked: "Booked",
  lost: "Lost",
  archived: "Archived",
};

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  draft: "Draft",
  active: "Active",
  paused: "Paused",
  completed: "Completed",
};

export const INTEGRATION_LABELS: Record<IntegrationProvider, string> = {
  twilio: "Twilio",
  jobber: "Jobber",
  housecall_pro: "Housecall Pro",
  servicetitan: "ServiceTitan",
  gmail: "Gmail",
  outlook: "Outlook",
  google_calendar: "Google Calendar",
  csv_import: "CSV Import",
};
