import { NextRequest, NextResponse } from "next/server";
import {
  DEMO_SESSION_COOKIE,
  createDemoSession,
  encodeDemoSession,
} from "@/lib/demo-session";

export async function GET(request: NextRequest) {
  const next = request.nextUrl.searchParams.get("next") || "/dashboard";
  const userId = request.nextUrl.searchParams.get("user") || undefined;
  const destination = new URL(next, request.url);
  const response = NextResponse.redirect(destination);

  response.cookies.set({
    name: DEMO_SESSION_COOKIE,
    value: encodeDemoSession(createDemoSession(userId)),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
