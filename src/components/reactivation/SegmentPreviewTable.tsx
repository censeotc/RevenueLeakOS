import { DataTable } from "@/components/shared/DataTable";
import { formatCurrency } from "@/lib/formatters";
import type { ReactivationSegment } from "@/types/revenue";

export function SegmentPreviewTable({ segment }: { segment: ReactivationSegment }) {
  return (
    <DataTable
      title="Segment preview"
      description={`Sample contacts from ${segment.name}.`}
      columns={["Contact", "Last service", "Opportunity value"]}
      rows={segment.contacts.map((contact) => [contact.name, contact.lastService, formatCurrency(contact.opportunityValueCents)])}
    />
  );
}
