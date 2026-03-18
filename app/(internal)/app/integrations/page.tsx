import { PageHeader } from "@/components/layout/page-header";
import { requireAppPath } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { IntegrationsModule } from "@/components/integrations/integrations-module";

export default async function IntegrationsPage() {
  const session = await requireAppPath("/app/integrations");
  const integrations = await prisma.integrationConnection.findMany({
    where: { businessId: session.user.businessId },
    orderBy: { provider: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Integrations"
        description="Connection controls for Twilio, FSM platforms, inbox providers, calendar sync, and CSV import."
      />
      <IntegrationsModule
        rows={integrations.map((integration) => ({
          id: integration.id,
          provider: integration.provider,
          status: integration.status,
          lastSyncAt: integration.lastSyncAt?.toISOString() ?? null,
        }))}
      />
    </div>
  );
}
