/**
 * Authentication configuration for NextAuth v5.
 * Extend this with your auth providers (credentials, OAuth, etc.)
 */

import type { UserRole } from "@/types/revenue";

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
  businessId: string;
  businessName: string;
  isDemo: boolean;
}

/**
 * Verify a session token and return the associated user.
 * Replace with actual NextAuth session lookup in production.
 */
export async function getSessionUser(token: string): Promise<SessionUser | null> {
  // TODO: implement with NextAuth or custom JWT verification
  return null;
}

/**
 * Check whether a user's role satisfies a minimum required role.
 */
const roleHierarchy: UserRole[] = ["READ_ONLY", "MEMBER", "MANAGER", "ADMIN", "OWNER"];

export function hasMinimumRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return roleHierarchy.indexOf(userRole) >= roleHierarchy.indexOf(requiredRole);
}

/**
 * Generate a secure random session token.
 */
export function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
