"use client";

import { hasAccess } from "@/lib/permissions";
import type { UserRole } from "@/types/revenue";

export function useRoleAccess(role: UserRole) {
  return { canViewDashboard: hasAccess(role, "dashboard"), canManageCampaigns: hasAccess(role, "campaigns"), canManageSettings: hasAccess(role, "settings") };
}
