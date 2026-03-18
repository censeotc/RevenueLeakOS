"use client";

import { useState, useEffect } from "react";
import type { UserRole } from "@/types/revenue";
import { hasMinimumRole } from "@/lib/auth";
import type { Permission } from "@/lib/permissions";
import { can, canAll, canAny } from "@/lib/permissions";

const DEMO_ROLE: UserRole = "OWNER";

export function useRoleAccess() {
  const [role, setRole] = useState<UserRole>(DEMO_ROLE);

  useEffect(() => {
    // TODO: fetch from session
    setRole(DEMO_ROLE);
  }, []);

  return {
    role,
    hasRole: (required: UserRole) => hasMinimumRole(role, required),
    can: (permission: Permission) => can(role, permission),
    canAll: (permissions: Permission[]) => canAll(role, permissions),
    canAny: (permissions: Permission[]) => canAny(role, permissions),
  };
}
