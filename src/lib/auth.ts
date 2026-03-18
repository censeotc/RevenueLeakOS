import type { UserRole } from "@/types/revenue";

export type AppSession = { user: { name: string; email: string; role: UserRole }; businessId: string };

const mockSession: AppSession = {
  user: { name: "Avery Lane", email: "avery@example.com", role: "owner" },
  businessId: "biz_sunrise"
};

export async function auth(): Promise<AppSession | null> {
  return mockSession;
}
