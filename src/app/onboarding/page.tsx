import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getStore } from "@/lib/demo-data";
import { requireRouteAccess } from "@/lib/guards";

export default async function OnboardingPage() {
  const session = await requireRouteAccess("/onboarding");
  const store = getStore();
  const steps = [
    ["Connect Twilio", `Twilio is already ${store.integrationConnections.find((connection) => connection.provider === "twilio")?.status ?? "pending"} in demo mode so the messaging flow can be exercised end to end.`],
    ["Import contacts", `Bring over historical customers and estimate records. Seeded contacts available today: ${store.contacts.length}.`],
    ["Tune attribution", `Current demo defaults: ${store.business.attributionWindowDays}-day attribution window and ${store.business.staleEstimateDays}-day stale estimate threshold.`],
    ["Launch first campaign", `There are ${store.campaigns.length} seeded campaigns ready to use as reference before the pilot goes live.`],
  ];

  return (
    <AppShell businessName={store.business.name} userName={session.user.name ?? "Demo User"} role={session.user.role}>
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-2">
        <div>
          <Badge variant="info">Onboarding</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Go-live checklist for RevenueLeak OS</h1>
          <p className="mt-2 text-sm text-zinc-500">This page intentionally follows the internal app and focuses on operational setup rather than public marketing.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {steps.map(([title, description], index) => (
            <Card key={title}><CardHeader><CardDescription>Step {index + 1}</CardDescription><CardTitle>{title}</CardTitle></CardHeader><CardContent><p className="text-sm text-zinc-500">{description}</p></CardContent></Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
