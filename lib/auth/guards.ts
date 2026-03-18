import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { canAccessPath } from "@/lib/auth/permissions";

export async function requireAppPath(pathname: string) {
  const session = await requireSession();
  if (!canAccessPath(pathname, session.user.role)) {
    redirect("/app/dashboard");
  }
  return session;
}
