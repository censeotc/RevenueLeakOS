import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingPage() {
  const steps = [
    ["Connect Twilio", "Attach a messaging number and verify delivery paths."],
    ["Import contacts", "Bring over historical customers and estimate records."],
    ["Tune attribution", "Set stale estimate rules, recovery windows, and high-value thresholds."],
    ["Launch first campaign", "Start the missed-call or reactivation workflow from the internal app."],
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
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
  );
}
