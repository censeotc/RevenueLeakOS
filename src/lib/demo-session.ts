import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { demoUsers } from "@/lib/demo-data";

export const DEMO_BUSINESS_ID = "biz_northshore";
export const DEMO_USER_ID = "user_owner";
export const DEMO_BUSINESS_NAME = "North Shore Heating & Plumbing";
export const DEMO_SESSION_COOKIE = "revenueleak_demo_session";

export interface DemoSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: "owner" | "manager" | "csr" | "readonly";
  };
  businessId: string;
  businessName: string;
  isDemo: true;
}

export function createDemoSession(userId = DEMO_USER_ID): DemoSession {
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
    isDemo: true,
  };
}

export function encodeDemoSession(session: DemoSession) {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

export function decodeDemoSession(value?: string | null): DemoSession | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as DemoSession;
  } catch (error) {
    console.warn("Unable to decode demo session cookie", error);
    return null;
  }
}

export function getDemoSession() {
  return createDemoSession();
}

export async function getPilotSession() {
  const cookieStore = await cookies();
  return decodeDemoSession(cookieStore.get(DEMO_SESSION_COOKIE)?.value);
}

export async function requirePilotSession() {
  const session = await getPilotSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
