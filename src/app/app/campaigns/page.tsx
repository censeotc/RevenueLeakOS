import { CampaignManager } from "@/components/interactive";
import { EmptyState } from "@/components/empty-state";
import { getCampaignsView } from "@/lib/demo-data";
import { requireRouteAccess } from "@/lib/guards";

export default async function CampaignsPage() {
  await requireRouteAccess("/app/campaigns");
  const campaigns = getCampaignsView();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-zinc-500">Campaigns</p>
        <h1 className="text-3xl font-semibold tracking-tight">Create, edit, and launch recovery campaigns</h1>
      </div>
      {!campaigns.length ? (
        <EmptyState title="No campaigns yet" description="Create your first seeded recovery campaign to begin orchestrating calls, estimate rescue, or reactivation." />
      ) : null}
      <CampaignManager campaigns={campaigns} />
    </div>
  );
}
