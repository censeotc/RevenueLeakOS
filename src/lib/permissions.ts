import type { UserRole } from "@/types/revenue";

const rolePermissions: Record<UserRole, string[]> = {
  owner: ["all"],
  manager: ["dashboard", "opportunities", "calls", "estimates", "campaigns", "reports", "contacts", "settings"],
  csr: ["dashboard", "opportunities", "calls", "estimates", "contacts"],
  readonly: ["dashboard", "reports"]
};

export function hasAccess(role: UserRole, area: string) {
  const permissions = rolePermissions[role];
  return permissions.includes("all") || permissions.includes(area);
}
