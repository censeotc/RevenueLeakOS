import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { IntegrationRecord } from "@/types/revenue";

import { IntegrationStatusBadge } from "./IntegrationStatusBadge";

export function IntegrationCard({ integration }: { integration: IntegrationRecord }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>{integration.provider}</CardTitle>
            <CardDescription>{integration.accountLabel}</CardDescription>
          </div>
          <IntegrationStatusBadge status={integration.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-slate-600">
        <p>{integration.summary}</p>
        <p><span className="font-medium text-slate-900">Last sync:</span> {integration.lastSync}</p>
      </CardContent>
    </Card>
  );
}
