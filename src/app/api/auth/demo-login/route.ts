import { NextRequest, NextResponse } from "next/server";
import {
  DEMO_SESSION_COOKIE,
  buildSessionForUser,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth";
import { demoUsers } from "@/services/seededDataService";

const DEMO_PASSWORD = "demo1234";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      userId?: string;
    };

    if (body.password && body.password !== DEMO_PASSWORD) {
      return NextResponse.json({ error: "Invalid demo credentials" }, { status: 401 });
    }

    const selectedUser = body.userId
      ? demoUsers.find((user) => user.id === body.userId)
      : demoUsers.find(
          (user) => user.email.toLowerCase() === (body.email ?? "").toLowerCase()
        );

    if (!selectedUser) {
      return NextResponse.json({ error: "Unknown demo user" }, { status: 401 });
    }

    const session = buildSessionForUser(selectedUser.id);
    if (!session) {
      return NextResponse.json({ error: "Session initialization failed" }, { status: 500 });
    }

    const response = NextResponse.json({ session });
    response.cookies.set(DEMO_SESSION_COOKIE, createSessionToken(session), sessionCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
