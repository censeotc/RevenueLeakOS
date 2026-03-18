import type { Metadata } from "next";
import { RevenueSummaryCards } from "@/components/reports/RevenueSummaryCards";
import { DirectVsInfluencedChart } from "@/components/reports/DirectVsInfluencedChart";
import { WorkflowComparison } from "@/components/reports/WorkflowComparison";
import { ConversionSummaryTable } from "@/components/reports/ConversionSummaryTable";

export const metadata: Metadata = { title: "Reports" };

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-500 text-sm mt-0.5">Revenue attribution and workflow performance</p>
      </div>
      <RevenueSummaryCards />
      <div className="grid lg:grid-cols-2 gap-6">
        <DirectVsInfluencedChart />
        <WorkflowComparison />
      </div>
      <ConversionSummaryTable />
    </div>
  );
}
