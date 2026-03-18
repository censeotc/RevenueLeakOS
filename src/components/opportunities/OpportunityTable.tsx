import { DataTable } from "@/components/shared/DataTable";
import { formatCurrency } from "@/lib/formatters";
import type { Opportunity } from "@/types/revenue";

import { OpportunityStatusBadge } from "./OpportunityStatusBadge";

export function OpportunityTable({ opportunities }: { opportunities: Opportunity[] }) {
  return (
    <DataTable
      title="Opportunity queue"
      description="Open and in-flight recovery opportunities across all workflows."
      columns={["Title", "Owner", "Status", "Value", "Last touched"]}
      rows={opportunities.map((opportunity) => [
        <div key={`${opportunity.id}-title`}>
          <p className="font-medium text-slate-900">{opportunity.title}</p>
          <p className="text-xs text-slate-500">{opportunity.contactName}</p>
        </div>,
        opportunity.owner,
        <OpportunityStatusBadge key={`${opportunity.id}-status`} status={opportunity.status} />,
        formatCurrency(opportunity.valueCents),
        opportunity.lastTouched,
      ])}
    />
  );
}
