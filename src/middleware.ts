import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = [
  "/",
  "/login",
  "/signup",
  "/pricing",
  "/demo",
  "/revenue-leakage-audit",
  "/about",
  "/contact",
  "/api/webhooks",
];

function isPublicPath(pathname: string): boolean {
  return publicPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname) || pathname.startsWith("/_next") || pathname.startsWith("/api/demo")) {
    return NextResponse.next();
  }

  const isDemoMode = process.env.DEMO_MODE === "true";
  if (isDemoMode) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.svg|icons|demo).*)"],
};
