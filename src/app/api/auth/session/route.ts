import { NextRequest, NextResponse } from "next/server";
import { DEMO_SESSION_COOKIE, parseSessionToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(DEMO_SESSION_COOKIE)?.value;
  const session = parseSessionToken(token);
  return NextResponse.json({ session });
}
