import { EstimatedValueCard } from "@/components/reactivation/EstimatedValueCard";
import { LaunchCampaignButton } from "@/components/reactivation/LaunchCampaignButton";
import { SegmentCard } from "@/components/reactivation/SegmentCard";
import { SegmentPreviewTable } from "@/components/reactivation/SegmentPreviewTable";
import { PageHeading } from "@/components/shared/PageHeading";
import { reactivationSegments } from "@/data/demoData";

export default function ReactivationPage() {
  const totalValue = reactivationSegments.reduce((sum, segment) => sum + segment.estimatedValueCents, 0);
  return (
    <div className="space-y-6">
      <PageHeading eyebrow="Reactivation" title="Identify dormant customers worth re-engaging" description="Build segments around lifecycle gaps, equipment age, and membership renewal risk." action={<LaunchCampaignButton />} />
      <EstimatedValueCard totalValueCents={totalValue} />
      <div className="grid gap-4 lg:grid-cols-2">{reactivationSegments.map((segment) => <SegmentCard key={segment.id} segment={segment} />)}</div>
      <SegmentPreviewTable segment={reactivationSegments[0]} />
    </div>
  );
}
