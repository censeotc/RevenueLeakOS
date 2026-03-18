import { OpportunityDetailPanel } from "@/components/opportunities/OpportunityDetailPanel";
import { OpportunityFilters } from "@/components/opportunities/OpportunityFilters";
import { OpportunityNotes } from "@/components/opportunities/OpportunityNotes";
import { OpportunityTable } from "@/components/opportunities/OpportunityTable";
import { PageHeading } from "@/components/shared/PageHeading";
import { getOpportunitySnapshot } from "@/services/opportunityService";

export default function OpportunitiesPage() {
  const snapshot = getOpportunitySnapshot();
  return (
    <div className="space-y-6">
      <PageHeading eyebrow="Opportunities" title="Triage revenue leakage opportunities" description="Prioritize high-confidence recovery work by value, freshness, and workflow type." />
      <OpportunityFilters filterSummary={snapshot.filterSummary} />
      <OpportunityTable opportunities={snapshot.opportunities} />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <OpportunityDetailPanel opportunity={snapshot.selectedOpportunity} />
        <OpportunityNotes notes={snapshot.notes} />
      </div>
    </div>
  );
}
