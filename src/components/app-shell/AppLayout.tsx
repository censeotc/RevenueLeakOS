"use client";

import { AppSidebar } from "./AppSidebar";
import { AppTopbar } from "./AppTopbar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r bg-muted/20 lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <span className="text-lg font-bold">RevenueLeak OS</span>
          </div>
          <AppSidebar />
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b px-6">
          <AppTopbar />
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
