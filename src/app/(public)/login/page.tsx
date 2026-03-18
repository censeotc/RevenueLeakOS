import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { demoUsers } from "@/lib/demo/build-demo-tenant";

import { LoginForm } from "./_components/login-form";

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect("/app/dashboard");
  }

  return (
    <main className="grid min-h-screen bg-slate-950 px-6 py-12 text-white lg:grid-cols-[1.15fr,0.85fr]">
      <section className="hidden rounded-3xl border border-white/10 bg-white/5 p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-300">
              RevenueLeak OS
            </p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight">
              Recover revenue from missed calls, stale estimates, and dormant customers.
            </h1>
          </div>
          <p className="max-w-xl text-lg text-slate-300">
            This demo drops you directly into the internal product for North Shore Heating &
            Plumbing, with seeded opportunities, bookings, campaigns, and reports.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Unified inbox", value: "12 active opportunities" },
            { label: "Mock workflow", value: "Missed call -> SMS -> booking" },
            { label: "Reporting", value: "$16.3k influenced revenue" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-2 text-xl font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-center lg:px-16">
        <Card className="w-full max-w-lg border-white/10 bg-white text-slate-950 shadow-2xl">
          <CardHeader>
            <CardTitle>Sign in to the demo tenant</CardTitle>
            <CardDescription>
              Use a seeded user below to enter the internal product.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <LoginForm />
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">Demo credentials</p>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                {demoUsers.map((user) => (
                  <div key={user.id} className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="font-medium text-slate-900">
                      {user.name} · <span className="capitalize">{user.role}</span>
                    </div>
                    <div>{user.email}</div>
                    <div>{user.password}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
