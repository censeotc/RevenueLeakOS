import { redirect } from "next/navigation";

import { LoginForm } from "@/components/interactive";
import { auth } from "@/lib/auth";
import { getDemoAccountOptions } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const params = (await searchParams) ?? {};
  const callbackUrl = params.callbackUrl?.startsWith("/") ? params.callbackUrl : "/app/dashboard";
  if (session) {
    redirect(callbackUrl);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl bg-zinc-950 p-10 text-white">
          <Badge variant="info" className="mb-4 bg-white/10 text-white">Authenticated internal app first</Badge>
          <h1 className="text-4xl font-semibold tracking-tight">RevenueLeak OS</h1>
          <p className="mt-4 max-w-xl text-zinc-300">
            Recover revenue from missed calls, stale estimates, and dormant customers through a unified Opportunity model.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Missed-call rescue workflow with mock Twilio messaging",
              "Estimate rescue queue with stale-threshold controls",
              "Reactivation segments and launch-ready campaigns",
              "Demo tenant seeded for North Shore Heating & Plumbing",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-200">
                {item}
              </div>
            ))}
          </div>
        </div>
        <Card className="self-center">
          <CardHeader>
            <CardTitle>Enter the demo tenant</CardTitle>
            <CardDescription>
              Use any seeded role to enter the internal operating app. Each role is wired to route protection and internal permission guards.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm demoAccounts={getDemoAccountOptions()} callbackUrl={callbackUrl} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
