import type { Metadata } from "next";
import { OpportunityTable } from "@/components/opportunities/OpportunityTable";
import { OpportunityFilters } from "@/components/opportunities/OpportunityFilters";

export const metadata: Metadata = { title: "Opportunities" };

export default function OpportunitiesPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Opportunities</h1>
        <p className="text-slate-500 text-sm mt-0.5">All open revenue recovery opportunities</p>
      </div>
      <OpportunityFilters />
      <OpportunityTable />
    </div>
  );
}
