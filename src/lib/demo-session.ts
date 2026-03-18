export const DEMO_BUSINESS_ID = "biz_northshore";
export const DEMO_USER_ID = "user_owner";
export const DEMO_BUSINESS_NAME = "North Shore Heating & Plumbing";

export function getDemoSession() {
  return {
    user: {
      id: DEMO_USER_ID,
      name: "Mike Kowalski",
      email: "mike@northshoreheating.com",
      role: "owner" as const,
    },
    businessId: DEMO_BUSINESS_ID,
    businessName: DEMO_BUSINESS_NAME,
  };
}
