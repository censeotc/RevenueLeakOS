import { CampaignEditor } from "@/components/campaigns/CampaignEditor";
import { CampaignStepEditor } from "@/components/campaigns/CampaignStepEditor";
import { CampaignTable } from "@/components/campaigns/CampaignTable";
import { PageHeading } from "@/components/shared/PageHeading";
import { getCampaignWorkspace } from "@/services/campaignService";

export default function CampaignsPage() {
  const workspace = getCampaignWorkspace();
  return (
    <div className="space-y-6">
      <PageHeading eyebrow="Campaigns" title="Build and tune automated recovery sequences" description="Define audience, cadence, channel mix, and message preview for active and draft campaigns." />
      <CampaignTable campaigns={workspace.campaigns} />
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <CampaignEditor campaign={workspace.selectedCampaign} />
        <CampaignStepEditor steps={workspace.selectedCampaign.steps} />
      </div>
    </div>
  );
}
