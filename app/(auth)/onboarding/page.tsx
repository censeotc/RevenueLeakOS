import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { OnboardingForm } from "@/components/forms/onboarding-form";

export default async function OnboardingPage() {
  const session = await requireSession();
  if (session.user.role === "readonly") {
    redirect("/app/dashboard");
  }

  const business = await prisma.business.findUnique({
    where: { id: session.user.businessId },
  });

  if (!business) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="mb-6 max-w-2xl">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome to RevenueLeak OS</h1>
        <p className="mt-2 text-sm text-slate-600">
          Confirm your defaults before launching missed-call, estimate rescue, and reactivation
          workflows.
        </p>
      </div>
      <OnboardingForm
        defaultValues={{
          businessName: business.name,
          timezone: business.timezone,
          staleEstimateDays: business.staleEstimateDays,
          attributionWindowDays: business.attributionWindowDays,
          highValueThreshold: business.highValueThreshold,
        }}
      />
    </div>
  );
}
