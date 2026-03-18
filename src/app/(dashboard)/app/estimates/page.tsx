import type { Metadata } from "next";
import { EstimatesTable } from "@/components/estimates/EstimatesTable";
import { EstimateFilters } from "@/components/estimates/EstimateFilters";

export const metadata: Metadata = { title: "Estimates" };

export default function EstimatesPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Estimates</h1>
        <p className="text-slate-500 text-sm mt-0.5">Track and follow up on sent estimates</p>
      </div>
      <EstimateFilters />
      <EstimatesTable />
    </div>
  );
}
