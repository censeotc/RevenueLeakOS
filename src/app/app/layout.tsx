import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { auth } from "@/lib/auth";
import { getStore } from "@/lib/demo-data";

export default async function InternalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const store = getStore();

  return (
    <AppShell businessName={store.business.name} userName={session.user.name ?? "Demo User"} role={session.user.role}>
      {children}
    </AppShell>
  );
}
