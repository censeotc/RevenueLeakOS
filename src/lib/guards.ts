import { redirect } from "next/navigation";

import { canAccessRoute, type ProtectedHref } from "@/lib/access";
import { auth } from "@/lib/auth";

function buildLoginRedirect(pathname: string) {
  const params = new URLSearchParams({ callbackUrl: pathname });
  return `/login?${params.toString()}`;
}

export async function requireRouteAccess(pathname: ProtectedHref) {
  const session = await auth();

  if (!session?.user) {
    redirect(buildLoginRedirect(pathname));
  }

  if (!canAccessRoute(session.user.role, pathname)) {
    const params = new URLSearchParams({
      from: pathname,
      required: pathname,
    });
    redirect(`/app/forbidden?${params.toString()}`);
  }

  return session;
}

export async function requireAuthenticatedSession(pathname: string) {
  const session = await auth();

  if (!session?.user) {
    redirect(buildLoginRedirect(pathname));
  }

  return session;
}
