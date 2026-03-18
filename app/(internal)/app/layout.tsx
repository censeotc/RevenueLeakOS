import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/app-shell";
import { canAccessPath } from "@/lib/auth/permissions";

export default async function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  if (!canAccessPath("/app/dashboard", session.user.role)) {
    redirect("/login");
  }

  return (
    <AppShell role={session.user.role} userName={session.user.name ?? session.user.email ?? ""}>
      {children}
    </AppShell>
  );
}
