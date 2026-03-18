import { redirect } from "next/navigation";

import { LoginForm } from "@/components/interactive";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect("/app/dashboard");
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
              Use the seeded owner credentials to enter the internal operating app. The default login is prefilled.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
