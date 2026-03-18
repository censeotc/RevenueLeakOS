import { PageHeader } from "@/components/layout/page-header";
import { requireAppPath } from "@/lib/auth/guards";
import { campaignService } from "@/lib/services/campaignService";
import { CampaignsModule } from "@/components/campaigns/campaigns-module";

export default async function CampaignsPage() {
  const session = await requireAppPath("/app/campaigns");
  const campaigns = await campaignService.listCampaigns(session.user.businessId);

  return (
    <div>
      <PageHeader
        title="Campaigns"
        description="Manage draft, active, paused, and completed workflows with editable steps and stop conditions."
      />
      <CampaignsModule
        campaigns={campaigns.map((campaign) => ({
          id: campaign.id,
          name: campaign.name,
          type: campaign.type,
          status: campaign.status,
          targetSegment: campaign.targetSegment,
          startedAt: campaign.startedAt?.toISOString() ?? null,
          steps: campaign.steps.map((step) => ({
            id: step.id,
            orderIndex: step.orderIndex,
            channel: step.channel,
            delayHours: step.delayHours,
            stopOnReply: step.stopOnReply,
            stopOnBooking: step.stopOnBooking,
          })),
        }))}
      />
    </div>
  );
}
