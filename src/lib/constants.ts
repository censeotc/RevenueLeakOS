export const APP_NAME = "RevenueLeakOS";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const ATTRIBUTION_WINDOW_DAYS_DEFAULT = 30;

export const OPPORTUNITY_TYPES = {
  MISSED_CALL: "Missed Call",
  UNANSWERED_ESTIMATE: "Unanswered Estimate",
  LOST_JOB: "Lost Job",
  REACTIVATION: "Reactivation",
  FOLLOW_UP: "Follow Up",
} as const;

export const OPPORTUNITY_STATUSES = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  WON: "Won",
  LOST: "Lost",
  DISMISSED: "Dismissed",
} as const;

export const CAMPAIGN_TYPES = {
  ESTIMATE_FOLLOWUP: "Estimate Follow-Up",
  MISSED_CALL: "Missed Call",
  REACTIVATION: "Reactivation",
  WIN_BACK: "Win Back",
  REVIEW_REQUEST: "Review Request",
  CUSTOM: "Custom",
} as const;

export const USER_ROLES = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MANAGER: "Manager",
  MEMBER: "Member",
  READ_ONLY: "Read Only",
} as const;

export const availableTemplateVariables = [
  { key: "firstName", description: "Contact's first name" },
  { key: "lastName", description: "Contact's last name" },
  { key: "businessName", description: "Your business name" },
  { key: "businessPhone", description: "Your business phone number" },
  { key: "estimateTitle", description: "Title of the related estimate" },
  { key: "estimateAmount", description: "Dollar amount of the estimate" },
  { key: "reviewLink", description: "Google review link" },
  { key: "appointmentDate", description: "Scheduled appointment date" },
  { key: "technicianName", description: "Assigned technician name" },
] as const;

export const SMS_MAX_LENGTH = 160;
export const SMS_MAX_SEGMENTS = 3;

export const DEFAULT_FOLLOW_UP_DELAYS = {
  FIRST: { days: 2, hours: 0 },
  SECOND: { days: 5, hours: 0 },
  THIRD: { days: 7, hours: 0 },
};
