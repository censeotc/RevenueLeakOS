import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { OnboardingForm } from "./_components/onboarding-form";

export default function OnboardingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12">
      <PageHeader
        eyebrow="Pilot setup"
        title="Onboarding"
        description="Capture business defaults before launching the internal revenue recovery workspace."
      />

      <Card>
        <CardHeader>
          <CardTitle>Business defaults</CardTitle>
          <CardDescription>
            Configure stale estimate timing, attribution window, and recovery thresholds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingForm />
        </CardContent>
      </Card>
    </main>
  );
}
