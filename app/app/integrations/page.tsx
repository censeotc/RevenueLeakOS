import { INTEGRATION_LABELS } from "@/lib/constants";
import { SectionHeader } from "@/components/section-header";
import { IntegrationStatusBadge } from "@/components/status-badges";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionUser } from "@/lib/session";
import { getIntegrations } from "@/lib/services/revenueleak";
import { setIntegrationStatusAction } from "@/app/actions";

export default async function IntegrationsPage() {
  const user = await getSessionUser();
  const integrations = await getIntegrations(user.businessId);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Integrations"
        description="Connection status and controls for Twilio, FSM platforms, email/calendar, and CSV."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map((integration) => (
          <Card key={integration.provider}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle>{INTEGRATION_LABELS[integration.provider]}</CardTitle>
                <IntegrationStatusBadge status={integration.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-600">
                {integration.connectedAt
                  ? `Connected ${integration.connectedAt.toLocaleDateString("en-US")}`
                  : "Not connected"}
              </p>
              <div className="flex flex-wrap gap-2">
                <form action={setIntegrationStatusAction}>
                  <input type="hidden" name="provider" value={integration.provider} />
                  <input type="hidden" name="status" value="connected" />
                  <SubmitButton size="sm" pendingLabel="Connecting...">
                    Connect
                  </SubmitButton>
                </form>
                <form action={setIntegrationStatusAction}>
                  <input type="hidden" name="provider" value={integration.provider} />
                  <input type="hidden" name="status" value="disconnected" />
                  <SubmitButton size="sm" variant="outline" pendingLabel="Disconnecting...">
                    Disconnect
                  </SubmitButton>
                </form>
                <form action={setIntegrationStatusAction}>
                  <input type="hidden" name="provider" value={integration.provider} />
                  <input type="hidden" name="status" value="error" />
                  <SubmitButton size="sm" variant="secondary" pendingLabel="Testing...">
                    Test
                  </SubmitButton>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
