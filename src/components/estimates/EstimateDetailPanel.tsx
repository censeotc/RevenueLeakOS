"use client";

import type { EstimateRow } from "@/types/revenue";
import { formatCurrency } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";

interface EstimateDetailPanelProps {
  estimate: EstimateRow;
  onClose: () => void;
}

export function EstimateDetailPanel({ estimate, onClose }: EstimateDetailPanelProps) {
  return (
    <div className="fixed inset-y-0 right-0 z-50 w-96 border-l bg-background p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Estimate {estimate.number}</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          &times;
        </button>
      </div>
      <div className="mt-6 space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Contact</p>
          <p className="font-medium">{estimate.contactName}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Amount</p>
          <p className="text-lg font-bold">{formatCurrency(estimate.amount)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <Badge variant="outline">{estimate.status}</Badge>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Issued</p>
          <p>{new Date(estimate.issuedAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
