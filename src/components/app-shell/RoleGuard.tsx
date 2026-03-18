"use client";

import type { Role } from "@/types/revenue";
import type { Permission } from "@/lib/permissions";
import { useRoleAccess } from "@/hooks/useRoleAccess";

interface RoleGuardProps {
  role: Role;
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ role, permission, children, fallback }: RoleGuardProps) {
  const { can } = useRoleAccess(role);

  if (!can(permission)) {
    return fallback ?? null;
  }

  return <>{children}</>;
}
