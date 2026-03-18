export const DEMO_BUSINESS_ID = "biz_northshore";
export const DEMO_USER_ID = "user_owner";
export const DEMO_BUSINESS_NAME = "North Shore Heating & Plumbing";
export const DEMO_SESSION_COOKIE = "rl_demo_session";

export interface SessionUser {
  userId: string;
  businessId: string;
  role: "owner" | "manager" | "csr" | "readonly";
  isDemo: boolean;
}

export function getDemoSession(): SessionUser {
  return {
    userId: DEMO_USER_ID,
    businessId: DEMO_BUSINESS_ID,
    role: "owner",
    isDemo: true,
  };
}
