"use client";

import { useRoleAccess } from "@/hooks/useRoleAccess";
import type { UserRole } from "@/types/revenue";

interface RoleGuardProps {
  requiredRole: UserRole;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ requiredRole, children, fallback = null }: RoleGuardProps) {
  const { hasRole } = useRoleAccess();

  if (!hasRole(requiredRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
