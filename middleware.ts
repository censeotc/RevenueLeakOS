import { NextRequest, NextResponse } from "next/server";
import {
  APP_BASE_PATH,
  INTERNAL_ROUTE_PATHS,
  isInternalPath,
  stripAppPrefix,
  toAppRoute,
} from "@/lib/app-routes";
import {
  DEMO_SESSION_COOKIE,
  getRoleGuardForPath,
  hasRequiredRole,
  parseSessionToken,
} from "@/lib/auth";

const PUBLIC_PATHS = new Set(["/", "/login", "/onboarding"]);
const AUTH_API_PATHS = new Set([
  "/api/auth/demo-login",
  "/api/auth/logout",
  "/api/auth/session",
]);

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  const nextValue = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  loginUrl.searchParams.set("next", nextValue);
  return NextResponse.redirect(loginUrl);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(DEMO_SESSION_COOKIE)?.value;
  const session = parseSessionToken(sessionToken);

  if (pathname === "/login" && session) {
    const nextTarget = request.nextUrl.searchParams.get("next");
    if (nextTarget && nextTarget.startsWith("/app/")) {
      return NextResponse.redirect(new URL(nextTarget, request.url));
    }
    return NextResponse.redirect(new URL(toAppRoute(INTERNAL_ROUTE_PATHS.dashboard), request.url));
  }

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  if (AUTH_API_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (pathname === APP_BASE_PATH) {
    return NextResponse.redirect(new URL(toAppRoute(INTERNAL_ROUTE_PATHS.dashboard), request.url));
  }

  if (pathname.startsWith(`${APP_BASE_PATH}/`)) {
    if (!session) {
      return redirectToLogin(request);
    }

    const internalPath = stripAppPrefix(pathname);
    const requiredRole = getRoleGuardForPath(internalPath);

    if (
      requiredRole &&
      !hasRequiredRole(session.user.role, requiredRole) &&
      !internalPath.startsWith(INTERNAL_ROUTE_PATHS.unauthorized)
    ) {
      return NextResponse.redirect(
        new URL(toAppRoute(INTERNAL_ROUTE_PATHS.unauthorized), request.url)
      );
    }

    return NextResponse.next();
  }

  if (isInternalPath(pathname)) {
    return NextResponse.redirect(new URL(toAppRoute(pathname), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
