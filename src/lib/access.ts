import type { UserRole } from "@/types/domain";

export type ProtectedHref =
  | "/app/dashboard"
  | "/app/opportunities"
  | "/app/calls"
  | "/app/estimates"
  | "/app/reactivation"
  | "/app/campaigns"
  | "/app/contacts"
  | "/app/reports"
  | "/app/templates"
  | "/app/integrations"
  | "/app/settings"
  | "/app/walkthrough"
  | "/app/forbidden"
  | "/onboarding";

export const routeAccess: Record<ProtectedHref, UserRole[]> = {
  "/app/dashboard": ["owner", "manager", "csr", "readonly"],
  "/app/opportunities": ["owner", "manager", "csr"],
  "/app/calls": ["owner", "manager", "csr"],
  "/app/estimates": ["owner", "manager"],
  "/app/reactivation": ["owner", "manager"],
  "/app/campaigns": ["owner", "manager"],
  "/app/contacts": ["owner", "manager", "csr"],
  "/app/reports": ["owner", "manager", "readonly"],
  "/app/templates": ["owner", "manager", "csr"],
  "/app/integrations": ["owner", "manager"],
  "/app/settings": ["owner", "manager"],
  "/app/walkthrough": ["owner", "manager", "csr", "readonly"],
  "/app/forbidden": ["owner", "manager", "csr", "readonly"],
  "/onboarding": ["owner", "manager"],
};

type DemoActionName =
  | "simulate_missed_call"
  | "simulate_reply"
  | "log_booking"
  | "enroll_estimate_follow_up"
  | "mark_estimate"
  | "launch_reactivation"
  | "assign_owner"
  | "add_note"
  | "duplicate_template"
  | "archive_template"
  | "create_campaign"
  | "update_campaign_status"
  | "toggle_integration"
  | "test_integration"
  | "preview_csv_import";

export const actionAccess: Record<DemoActionName, UserRole[]> = {
  simulate_missed_call: ["owner", "manager", "csr"],
  simulate_reply: ["owner", "manager", "csr"],
  log_booking: ["owner", "manager", "csr"],
  enroll_estimate_follow_up: ["owner", "manager"],
  mark_estimate: ["owner", "manager"],
  launch_reactivation: ["owner", "manager"],
  assign_owner: ["owner", "manager"],
  add_note: ["owner", "manager", "csr"],
  duplicate_template: ["owner", "manager", "csr"],
  archive_template: ["owner", "manager"],
  create_campaign: ["owner", "manager"],
  update_campaign_status: ["owner", "manager"],
  toggle_integration: ["owner", "manager"],
  test_integration: ["owner", "manager"],
  preview_csv_import: ["owner", "manager"],
};

export function canAccessRoute(role: UserRole, href: ProtectedHref) {
  return routeAccess[href].includes(role);
}

export function canRunAction(role: UserRole, action: string) {
  const allowedRoles = actionAccess[action as DemoActionName];
  return allowedRoles ? allowedRoles.includes(role) : false;
}

export function getNavForRole<T extends { href: string }>(items: T[], role: UserRole) {
  return items.filter((item) => {
    if (!(item.href in routeAccess)) {
      return true;
    }

    return canAccessRoute(role, item.href as ProtectedHref);
  });
}
