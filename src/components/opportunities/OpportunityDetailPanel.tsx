"use client";

import type { OpportunityRow } from "@/types/revenue";
import { formatCurrency } from "@/lib/formatters";
import { OpportunityStatusBadge } from "./OpportunityStatusBadge";

interface OpportunityDetailPanelProps {
  opportunity: OpportunityRow;
  onClose: () => void;
}

export function OpportunityDetailPanel({ opportunity, onClose }: OpportunityDetailPanelProps) {
  return (
    <div className="fixed inset-y-0 right-0 z-50 w-96 border-l bg-background p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Opportunity Detail</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          &times;
        </button>
      </div>
      <div className="mt-6 space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Contact</p>
          <p className="font-medium">{opportunity.contactName}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Type</p>
          <p className="capitalize">{opportunity.type.replace(/_/g, " ").toLowerCase()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <OpportunityStatusBadge status={opportunity.status} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Value</p>
          <p className="text-lg font-bold">{formatCurrency(opportunity.value)}</p>
        </div>
        {opportunity.description && (
          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="text-sm">{opportunity.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
