import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOnboardingWorkspace } from "@/services/onboardingService";

export default function ConnectDataPage() {
  const workspace = getOnboardingWorkspace();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect data</CardTitle>
        <CardDescription>Start with the systems that create the highest-confidence recovery signals.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        {workspace.integrations.map((integration) => <div className="rounded-xl border border-slate-100 p-4 text-sm text-slate-600" key={integration}>{integration}</div>)}
      </CardContent>
    </Card>
  );
}
