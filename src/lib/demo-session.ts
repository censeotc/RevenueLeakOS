import { demoBusiness, demoUsers } from "@/services/seededDataService";

export const DEMO_BUSINESS_ID = demoBusiness.id;
export const DEMO_USER_ID = demoUsers[0].id;
export const DEMO_BUSINESS_NAME = demoBusiness.name;

export function getDemoSession(userId = DEMO_USER_ID) {
  const user = demoUsers.find((candidate) => candidate.id === userId) ?? demoUsers[0];

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    businessId: DEMO_BUSINESS_ID,
    businessName: DEMO_BUSINESS_NAME,
  };
}
