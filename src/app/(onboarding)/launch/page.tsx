import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOnboardingWorkspace } from "@/services/onboardingService";

export default function LaunchPage() {
  const workspace = getOnboardingWorkspace();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Launch checklist</CardTitle>
        <CardDescription>Confirm readiness before you invite operators into the live workspace.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-600">
        {workspace.launchChecklist.map((item) => <div className="rounded-xl border border-slate-100 p-4" key={item}>{item}</div>)}
      </CardContent>
    </Card>
  );
}
