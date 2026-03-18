import { IntegrationActions } from "@/components/interactive";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getIntegrationsView } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";

export default async function IntegrationsPage() {
  const integrations = getIntegrationsView();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-zinc-500">Integrations</p>
        <h1 className="text-3xl font-semibold tracking-tight">Connection state for messaging and field-service systems</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div><CardTitle>{integration.provider}</CardTitle><CardDescription>{integration.accountLabel ?? "No account connected"}</CardDescription></div>
                <Badge variant={integration.status === "connected" ? "success" : integration.status === "error" ? "danger" : "secondary"}>{integration.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-zinc-500">Last tested {formatDate(integration.lastTestedAt)}</p>
              <IntegrationActions provider={integration.provider} connectedLabel={integration.status} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
