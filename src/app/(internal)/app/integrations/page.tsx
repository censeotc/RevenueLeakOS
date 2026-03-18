import { setIntegrationStatusAction } from "@/app/actions";
import { PageHeader } from "@/components/app-shell/page-header";
import { StatusBadge } from "@/components/app-shell/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getIntegrations } from "@/lib/data/selectors";
import { formatRelativeTime, titleCase } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function IntegrationsPage() {
  const integrations = getIntegrations();

  return (
    <>
      <PageHeader
        eyebrow="Integration scaffold"
        title="Integrations"
        description="Scaffold connection cards for telephony, field service platforms, inboxes, calendars, and CSV import."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-base">{titleCase(integration.provider)}</CardTitle>
                <StatusBadge value={integration.status} />
              </div>
              <CardDescription>
                {integration.lastSyncAt
                  ? `Last sync ${formatRelativeTime(integration.lastSyncAt)}`
                  : "No sync recorded yet"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {integration.errorMessage ? (
                <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                  {integration.errorMessage}
                </div>
              ) : null}
              <div className="grid grid-cols-3 gap-2">
                <form action={setIntegrationStatusAction}>
                  <input type="hidden" name="integrationId" value={integration.id} />
                  <input type="hidden" name="status" value="connected" />
                  <Button className="w-full" size="sm" type="submit">
                    Connect
                  </Button>
                </form>
                <form action={setIntegrationStatusAction}>
                  <input type="hidden" name="integrationId" value={integration.id} />
                  <input type="hidden" name="status" value="disconnected" />
                  <Button className="w-full" size="sm" type="submit" variant="outline">
                    Disconnect
                  </Button>
                </form>
                <form action={setIntegrationStatusAction}>
                  <input type="hidden" name="integrationId" value={integration.id} />
                  <input type="hidden" name="status" value="pending" />
                  <Button className="w-full" size="sm" type="submit" variant="secondary">
                    Test
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
