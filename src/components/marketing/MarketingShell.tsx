import type { ReactNode } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { APP_NAME, MARKETING_NAV } from "@/lib/constants";

type MarketingShellProps = { eyebrow?: string; title: string; description: string; children: ReactNode };

export function MarketingShell({ eyebrow, title, description, children }: MarketingShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link className="text-lg font-semibold text-white" href="/">{APP_NAME}</Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">{MARKETING_NAV.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}</nav>
          <div className="flex items-center gap-3">
            <Link href="/login"><Button className="border-white/10 bg-white/5 text-white hover:bg-white/10" variant="ghost">Log in</Button></Link>
            <Link href="/signup"><Button>Start free audit</Button></Link>
          </div>
        </div>
      </header>
      <main className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-16">
        <section className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-end">
          <div className="space-y-5">
            {eyebrow ? <p className="text-sm font-medium uppercase tracking-[0.22em] text-brand-100">{eyebrow}</p> : null}
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-6xl">{title}</h1>
            <p className="max-w-2xl text-base text-slate-300 md:text-lg">{description}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200 shadow-panel">
            <p className="font-medium text-white">Built for operators who need proof, not just activity.</p>
            <p className="mt-3">RevenueLeak OS unifies call capture, estimate rescue, reactivation campaigns, and influenced revenue reporting in one application shell.</p>
          </div>
        </section>
        <div className="space-y-8">{children}</div>
      </main>
    </div>
  );
}
