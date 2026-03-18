import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/pricing",
  "/demo",
  "/about",
  "/contact",
  "/revenue-leakage-audit",
  "/login",
  "/signup",
  "/forgot-password",
];

const API_PUBLIC_PATHS = ["/api/webhooks", "/api/demo"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public marketing and auth paths
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // Allow public API paths
  if (API_PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/public") ||
    pathname.match(/\.(svg|png|jpg|ico|css|js|woff|woff2)$/)
  ) {
    return NextResponse.next();
  }

  // For demo mode, allow /app paths without auth
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  if (isDemoMode && pathname.startsWith("/app")) {
    return NextResponse.next();
  }

  // Check for session token in cookies
  const sessionToken = request.cookies.get("session")?.value;
  if (!sessionToken && pathname.startsWith("/app")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check for session on onboarding paths
  if (!sessionToken && (
    pathname.startsWith("/business-profile") ||
    pathname.startsWith("/connect-data") ||
    pathname.startsWith("/choose-workflows") ||
    pathname.startsWith("/launch")
  )) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
