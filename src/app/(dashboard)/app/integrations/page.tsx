import type { Metadata } from "next";
import { IntegrationCard } from "@/components/integrations/IntegrationCard";
import { integrationsList } from "@/data/demoData";

export const metadata: Metadata = { title: "Integrations" };

export default function IntegrationsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Integrations</h1>
        <p className="text-slate-500 text-sm mt-0.5">Connect your field service management tools</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrationsList.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>
    </div>
  );
}
