import type { Role } from "@/types/revenue";

export type Permission =
  | "dashboard:view"
  | "opportunities:view"
  | "opportunities:edit"
  | "calls:view"
  | "estimates:view"
  | "estimates:enroll"
  | "reactivation:view"
  | "reactivation:launch"
  | "campaigns:view"
  | "campaigns:edit"
  | "contacts:view"
  | "contacts:import"
  | "reports:view"
  | "templates:view"
  | "templates:edit"
  | "integrations:view"
  | "integrations:manage"
  | "settings:view"
  | "settings:edit";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  OWNER: [
    "dashboard:view",
    "opportunities:view",
    "opportunities:edit",
    "calls:view",
    "estimates:view",
    "estimates:enroll",
    "reactivation:view",
    "reactivation:launch",
    "campaigns:view",
    "campaigns:edit",
    "contacts:view",
    "contacts:import",
    "reports:view",
    "templates:view",
    "templates:edit",
    "integrations:view",
    "integrations:manage",
    "settings:view",
    "settings:edit",
  ],
  MANAGER: [
    "dashboard:view",
    "opportunities:view",
    "opportunities:edit",
    "calls:view",
    "estimates:view",
    "estimates:enroll",
    "reactivation:view",
    "campaigns:view",
    "contacts:view",
    "reports:view",
    "templates:view",
    "templates:edit",
    "settings:view",
  ],
  STAFF: [
    "dashboard:view",
    "opportunities:view",
    "calls:view",
    "estimates:view",
    "contacts:view",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getPermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}
