"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { completeOnboardingAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const onboardingSchema = z.object({
  businessName: z.string().min(2),
  timezone: z.string().min(2),
  staleEstimateDays: z.number().min(1).max(30),
  attributionWindowDays: z.number().min(1).max(60),
  highValueThreshold: z.number().min(100),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

export function OnboardingForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      businessName: "North Shore Heating & Plumbing",
      timezone: "America/Detroit",
      staleEstimateDays: 7,
      attributionWindowDays: 14,
      highValueThreshold: 2500,
    },
  });

  function onSubmit() {
    startTransition(async () => {
      await completeOnboardingAction();
    });
  }

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register("businessName")} />
      <Input {...form.register("timezone")} />
      <Input
        type="number"
        {...form.register("staleEstimateDays", { valueAsNumber: true })}
      />
      <Input
        type="number"
        {...form.register("attributionWindowDays", { valueAsNumber: true })}
      />
      <Input
        type="number"
        {...form.register("highValueThreshold", { valueAsNumber: true })}
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? "Launching workspace..." : "Continue to app"}
      </Button>
    </form>
  );
}
