import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";

const checklist = [
  "Connect Twilio integration",
  "Import contacts or verify seeded demo data",
  "Review missed call template",
  "Set stale estimate threshold",
  "Launch first reactivation campaign",
];

export default function OnboardingPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Onboarding"
        description="Tenant onboarding checklist for RevenueLeak OS workflows."
      />

      <Card>
        <CardHeader>
          <CardTitle>Getting started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {checklist.map((item, index) => (
            <div key={item} className="flex items-center gap-3 rounded-md border border-slate-200 p-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                {index + 1}
              </div>
              <p className="text-sm text-slate-800">{item}</p>
            </div>
          ))}
          <Link href="/app/dashboard">
            <Button className="mt-2">Go to dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
