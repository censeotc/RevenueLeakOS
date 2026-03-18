import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { WalkthroughStep } from "@/types/revenue";

export function WorkflowWalkthrough({ steps }: { steps: WalkthroughStep[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {steps.map((step) => (
        <Card key={step.id}>
          <CardHeader>
            <CardTitle>{step.title}</CardTitle>
            <CardDescription>{step.description}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">{step.outcome}</CardContent>
        </Card>
      ))}
    </div>
  );
}
