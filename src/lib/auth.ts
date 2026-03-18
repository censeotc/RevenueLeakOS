import type { Role } from "@/types/revenue";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  businessId: string;
}

export function getDemoUser(): SessionUser {
  return {
    id: "demo-user",
    email: "owner@comfortair.example.com",
    name: "Jordan Rivera",
    role: "OWNER",
    businessId: "demo-business",
  };
}

export function isDemoMode(): boolean {
  return process.env.DEMO_MODE === "true";
}

export async function getSession(): Promise<SessionUser | null> {
  if (isDemoMode()) {
    return getDemoUser();
  }
  return null;
}
