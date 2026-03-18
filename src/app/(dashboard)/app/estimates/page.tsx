import { EnrollFollowupButton } from "@/components/estimates/EnrollFollowupButton";
import { EstimateDetailPanel } from "@/components/estimates/EstimateDetailPanel";
import { EstimateFilters } from "@/components/estimates/EstimateFilters";
import { EstimatesTable } from "@/components/estimates/EstimatesTable";
import { PageHeading } from "@/components/shared/PageHeading";
import { estimates } from "@/data/demoData";

export default function EstimatesPage() {
  return (
    <div className="space-y-6">
      <PageHeading eyebrow="Estimates" title="Rescue aging quotes before they stall out" description="Track stale thresholds, enrollment status, and next-touch sequences for every estimate." action={<EnrollFollowupButton />} />
      <EstimateFilters />
      <EstimatesTable estimates={estimates} />
      <EstimateDetailPanel estimate={estimates[0]} />
    </div>
  );
}
