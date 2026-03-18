"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema } from "@/lib/domain/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type OnboardingInput = z.infer<typeof onboardingSchema>;

export function OnboardingForm({
  defaultValues,
}: {
  defaultValues: OnboardingInput;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const form = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues,
  });

  async function onSubmit(values: OnboardingInput) {
    setStatus(null);
    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      setStatus("Could not save onboarding settings.");
      return;
    }
    setStatus("Business defaults updated.");
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Onboarding defaults</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="businessName">Business name</Label>
            <Input id="businessName" {...form.register("businessName")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input id="timezone" {...form.register("timezone")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="staleEstimateDays">Stale estimate days</Label>
            <Input
              id="staleEstimateDays"
              type="number"
              {...form.register("staleEstimateDays", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="attributionWindowDays">Attribution window days</Label>
            <Input
              id="attributionWindowDays"
              type="number"
              {...form.register("attributionWindowDays", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="highValueThreshold">High-value threshold</Label>
            <Input
              id="highValueThreshold"
              type="number"
              {...form.register("highValueThreshold", { valueAsNumber: true })}
            />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Save onboarding
            </Button>
            {status ? <p className="mt-2 text-sm text-slate-600">{status}</p> : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
