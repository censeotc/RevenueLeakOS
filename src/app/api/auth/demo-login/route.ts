import { NextResponse } from "next/server";
import { DEMO_USER_ID, DEMO_BUSINESS_ID } from "@/lib/demo-session";

const COOKIE_NAME = "rl_demo_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST() {
  const sessionPayload = JSON.stringify({
    userId: DEMO_USER_ID,
    businessId: DEMO_BUSINESS_ID,
    role: "owner",
    isDemo: true,
    createdAt: new Date().toISOString(),
  });

  const encoded = Buffer.from(sessionPayload).toString("base64");

  const response = NextResponse.json({ ok: true, redirectTo: "/app/dashboard" });
  response.cookies.set(COOKIE_NAME, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return response;
}
