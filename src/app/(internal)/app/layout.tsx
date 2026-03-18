import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { SidebarNav } from "@/components/app-shell/sidebar-nav";
import { TopBar } from "@/components/app-shell/top-bar";
import { auth } from "@/lib/auth";

export default async function InternalAppLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarNav role={session.user.role} />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar name={session.user.name ?? "Demo User"} role={session.user.role} />
        <main className="flex-1 p-4 lg:p-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
