import Link from "next/link";
import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SignOutButton } from "@/components/sign-out-button";
import { getSessionUser } from "@/lib/session";
import { getBusinessProfile } from "@/lib/services/reportingService";

export default async function InternalAppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getSessionUser();
  const business = await getBusinessProfile(user.businessId);

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Tenant</p>
            <p className="text-sm font-semibold text-slate-900">{business?.name ?? "Unknown tenant"}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/app/onboarding" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Onboarding
            </Link>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{user.name}</p>
              <p className="text-xs uppercase text-slate-500">{user.role}</p>
            </div>
            <SignOutButton />
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
