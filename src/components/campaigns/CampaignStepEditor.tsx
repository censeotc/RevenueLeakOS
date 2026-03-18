import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CampaignStep } from "@/types/revenue";

export function CampaignStepEditor({ steps }: { steps: CampaignStep[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step editor</CardTitle>
        <CardDescription>Sequence timing, channel mix, and script preview.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step) => (
          <div className="rounded-xl border border-slate-100 p-4 text-sm text-slate-600" key={step.id}>
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-slate-900">Step {step.order} · {step.channel.toUpperCase()}</p>
              <span>{step.delayHours}h delay</span>
            </div>
            <p className="mt-2">{step.bodyPreview}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
