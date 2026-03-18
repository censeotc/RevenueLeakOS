import { demoBusiness, demoUsers } from "@/services/seededDataService";
import { INTERNAL_ROUTE_PATHS } from "@/lib/app-routes";

export const DEMO_SESSION_COOKIE = "rlo_demo_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;

export type DemoUserRole = (typeof demoUsers)[number]["role"];

export interface DemoSessionPayload {
  user: {
    id: string;
    name: string;
    email: string;
    role: DemoUserRole;
  };
  business: {
    id: string;
    name: string;
  };
  issuedAt: number;
  expiresAt: number;
}

const ROLE_ORDER: Record<DemoUserRole, number> = {
  readonly: 0,
  csr: 1,
  manager: 2,
  owner: 3,
};

const ROLE_GUARDS: Array<{ prefix: string; minimumRole: DemoUserRole }> = [
  { prefix: INTERNAL_ROUTE_PATHS.reports, minimumRole: "manager" },
  { prefix: INTERNAL_ROUTE_PATHS.settings, minimumRole: "owner" },
];

function encodeBase64(input: string) {
  if (typeof btoa === "function") {
    return btoa(input);
  }

  return Buffer.from(input, "utf-8").toString("base64");
}

function decodeBase64(input: string) {
  if (typeof atob === "function") {
    return atob(input);
  }

  return Buffer.from(input, "base64").toString("utf-8");
}

function toBase64Url(base64Value: string) {
  return base64Value.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(base64UrlValue: string) {
  const base64 = base64UrlValue.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (base64.length % 4)) % 4;
  return `${base64}${"=".repeat(padLength)}`;
}

export function buildSessionForUser(userId: string): DemoSessionPayload | null {
  const user = demoUsers.find((candidate) => candidate.id === userId);
  if (!user) {
    return null;
  }

  const now = Date.now();
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    business: {
      id: demoBusiness.id,
      name: demoBusiness.name,
    },
    issuedAt: now,
    expiresAt: now + SESSION_MAX_AGE_SECONDS * 1000,
  };
}

export function createSessionToken(session: DemoSessionPayload) {
  return toBase64Url(encodeBase64(JSON.stringify(session)));
}

export function parseSessionToken(rawToken?: string | null): DemoSessionPayload | null {
  if (!rawToken) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64(fromBase64Url(rawToken))) as DemoSessionPayload;
    if (!payload?.user?.id || !payload?.business?.id || !payload.expiresAt) {
      return null;
    }

    if (Date.now() > payload.expiresAt) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getRoleGuardForPath(pathname: string): DemoUserRole | null {
  for (const guard of ROLE_GUARDS) {
    if (pathname === guard.prefix || pathname.startsWith(`${guard.prefix}/`)) {
      return guard.minimumRole;
    }
  }

  return null;
}

export function hasRequiredRole(role: DemoUserRole, minimumRole: DemoUserRole) {
  return ROLE_ORDER[role] >= ROLE_ORDER[minimumRole];
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
