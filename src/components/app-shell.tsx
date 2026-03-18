"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

import { appNav } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function AppShell({
  businessName,
  userName,
  role,
  children,
}: {
  businessName: string;
  userName: string;
  role: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
        <aside className="hidden w-72 shrink-0 rounded-2xl border border-zinc-200 bg-white p-5 lg:block">
          <div className="mb-8 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">RevenueLeak OS</p>
            <h1 className="text-lg font-semibold">{businessName}</h1>
            <p className="text-sm text-zinc-500">Revenue recovery cockpit for phone, estimates, and dormant demand.</p>
          </div>
          <nav className="space-y-1">
            {appNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950",
                  pathname === item.href && "bg-zinc-950 text-white hover:bg-zinc-900 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/onboarding"
              className={cn(
                "mt-4 block rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950",
                pathname === "/onboarding" && "bg-zinc-950 text-white hover:bg-zinc-900 hover:text-white",
              )}
            >
              Onboarding
            </Link>
          </nav>
        </aside>

        <div className="flex-1 space-y-6">
          <header className="rounded-2xl border border-zinc-200 bg-white px-5 py-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Authenticated demo tenant</p>
                <h2 className="text-xl font-semibold">North Shore command center</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{role}</p>
                </div>
                <Avatar>{userName.slice(0, 2).toUpperCase()}</Avatar>
                <Button variant="outline" onClick={() => signOut({ callbackUrl: "/login" })}>
                  Sign out
                </Button>
              </div>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
