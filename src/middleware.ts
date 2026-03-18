import { NextRequest, NextResponse } from "next/server";
import { DEMO_SESSION_COOKIE } from "@/lib/demo-session";

const protectedPagePrefixes = [
  "/dashboard",
  "/opportunities",
  "/calls",
  "/estimates",
  "/reactivation",
  "/reports",
  "/contacts",
  "/campaigns",
  "/templates",
  "/integrations",
  "/settings",
  "/walkthrough",
  "/imports",
];

const protectedApiPrefixes = ["/api/workflows", "/api/imports"];

function matchesProtectedPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasDemoSession = Boolean(request.cookies.get(DEMO_SESSION_COOKIE)?.value);
  const isProtectedPage = matchesProtectedPrefix(pathname, protectedPagePrefixes);
  const isProtectedApi = matchesProtectedPrefix(pathname, protectedApiPrefixes);

  if (!hasDemoSession && isProtectedApi) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (!hasDemoSession && isProtectedPage) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (hasDemoSession && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/opportunities/:path*",
    "/calls/:path*",
    "/estimates/:path*",
    "/reactivation/:path*",
    "/reports/:path*",
    "/contacts/:path*",
    "/campaigns/:path*",
    "/templates/:path*",
    "/integrations/:path*",
    "/settings/:path*",
    "/walkthrough/:path*",
    "/imports/:path*",
    "/api/workflows/:path*",
    "/api/imports/:path*",
  ],
};
