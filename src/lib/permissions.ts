import type { UserRole } from "@/types/revenue";
import { hasMinimumRole } from "./auth";

export type Permission =
  | "view:dashboard"
  | "view:reports"
  | "manage:opportunities"
  | "manage:campaigns"
  | "manage:templates"
  | "manage:contacts"
  | "manage:integrations"
  | "manage:settings"
  | "manage:users"
  | "send:sms"
  | "send:email"
  | "manage:billing";

const permissionRoles: Record<Permission, UserRole> = {
  "view:dashboard": "READ_ONLY",
  "view:reports": "READ_ONLY",
  "manage:opportunities": "MEMBER",
  "manage:contacts": "MANAGER",
  "manage:campaigns": "MANAGER",
  "manage:templates": "ADMIN",
  "manage:integrations": "ADMIN",
  "manage:settings": "ADMIN",
  "manage:users": "OWNER",
  "manage:billing": "OWNER",
  "send:sms": "MANAGER",
  "send:email": "MANAGER",
};

export function can(userRole: UserRole, permission: Permission): boolean {
  const requiredRole = permissionRoles[permission];
  if (!requiredRole) return false;
  return hasMinimumRole(userRole, requiredRole);
}

export function canAll(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every((p) => can(userRole, p));
}

export function canAny(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some((p) => can(userRole, p));
}
