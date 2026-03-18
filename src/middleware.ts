import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEMO_SESSION_COOKIE = "rl_demo_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/app")) {
    const session = request.cookies.get(DEMO_SESSION_COOKIE);
    if (!session?.value) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from login
  if (pathname === "/auth/login") {
    const session = request.cookies.get(DEMO_SESSION_COOKIE);
    if (session?.value) {
      return NextResponse.redirect(new URL("/app/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/auth/login"],
};
