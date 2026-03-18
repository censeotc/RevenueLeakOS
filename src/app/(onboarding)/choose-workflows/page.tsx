import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOnboardingWorkspace } from "@/services/onboardingService";

export default function ChooseWorkflowsPage() {
  const workspace = getOnboardingWorkspace();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose workflows</CardTitle>
        <CardDescription>Sequence the recovery motions you want to activate first.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {workspace.workflows.map((workflow) => <div className="rounded-xl border border-slate-100 p-4 text-sm text-slate-600" key={workflow}>{workflow}</div>)}
      </CardContent>
    </Card>
  );
}
