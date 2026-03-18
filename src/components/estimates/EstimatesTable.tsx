import { DataTable } from "@/components/shared/DataTable";
import { formatCurrency } from "@/lib/formatters";
import type { EstimateRecord } from "@/types/revenue";

export function EstimatesTable({ estimates }: { estimates: EstimateRecord[] }) {
  return (
    <DataTable
      title="Estimates"
      description="Quotes tracked for rescue and follow-up enrollment."
      columns={["Estimate", "Customer", "Service", "Amount", "Status"]}
      rows={estimates.map((estimate) => [estimate.number, estimate.customer, estimate.serviceType, formatCurrency(estimate.amountCents), estimate.status])}
    />
  );
}
