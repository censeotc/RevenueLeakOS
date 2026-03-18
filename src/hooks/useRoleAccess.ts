"use client";

import { useMemo } from "react";
import type { Role } from "@/types/revenue";
import { type Permission, hasPermission, getPermissions } from "@/lib/permissions";

export function useRoleAccess(role: Role) {
  const permissions = useMemo(() => getPermissions(role), [role]);

  const can = useMemo(
    () => (permission: Permission) => hasPermission(role, permission),
    [role]
  );

  return { permissions, can };
}
