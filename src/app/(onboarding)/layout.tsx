import type { ReactNode } from "react";

import Link from "next/link";

import { ONBOARDING_STEPS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-brand-100">Onboarding</p>
          <h1 className="text-3xl font-semibold">Configure your revenue recovery workspace</h1>
        </div>
        <nav className="grid gap-3 md:grid-cols-4">
          {ONBOARDING_STEPS.map((step, index) => (
            <Link className={cn('rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200', index === 0 && 'ring-2 ring-brand-500')} href={step.href} key={step.href}>
              {index + 1}. {step.label}
            </Link>
          ))}
        </nav>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">{children}</div>
      </div>
    </div>
  );
}
