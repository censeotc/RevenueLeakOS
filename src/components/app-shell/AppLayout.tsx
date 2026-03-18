import type { ReactNode } from "react";

import { AppSidebar } from "@/components/app-shell/AppSidebar";
import { AppTopbar } from "@/components/app-shell/AppTopbar";
import type { UserRole } from "@/types/revenue";

type AppLayoutProps = {
  children: ReactNode;
  role: UserRole;
  userName: string;
};

export function AppLayout({ children, role, userName }: AppLayoutProps) {
  return (
    <div className="grid min-h-screen bg-slate-50 lg:grid-cols-[290px_1fr]">
      <AppSidebar role={role} />
      <div className="flex min-h-screen flex-col">
        <AppTopbar userName={userName} />
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
