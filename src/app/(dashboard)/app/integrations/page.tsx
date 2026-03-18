import { IntegrationCard } from "@/components/integrations/IntegrationCard";
import { PageHeading } from "@/components/shared/PageHeading";
import { integrations } from "@/data/demoData";

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <PageHeading eyebrow="Integrations" title="Connect systems that produce revenue recovery signal" description="Link telephony, CRM, scheduling, and file import sources into a consistent operating model." />
      <div className="grid gap-4 lg:grid-cols-3">{integrations.map((integration) => <IntegrationCard integration={integration} key={integration.id} />)}</div>
    </div>
  );
}
