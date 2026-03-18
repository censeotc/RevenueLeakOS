import { ConversionSummaryTable } from "@/components/reports/ConversionSummaryTable";
import { DirectVsInfluencedChart } from "@/components/reports/DirectVsInfluencedChart";
import { RevenueSummaryCards } from "@/components/reports/RevenueSummaryCards";
import { WorkflowComparison } from "@/components/reports/WorkflowComparison";
import { PageHeading } from "@/components/shared/PageHeading";
import { getRevenueReport } from "@/services/reportingService";

export default function ReportsPage() {
  const report = getRevenueReport();
  return (
    <div className="space-y-6">
      <PageHeading eyebrow="Reports" title="Measure direct and influenced revenue" description="Tie recovered opportunities back to bookings, owners, and workflow performance." />
      <RevenueSummaryCards summaries={report.revenueSummary} />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <DirectVsInfluencedChart summaries={report.revenueSummary} />
        <WorkflowComparison workflows={report.workflowPerformance} />
      </div>
      <ConversionSummaryTable rows={report.conversionSummary} />
    </div>
  );
}
