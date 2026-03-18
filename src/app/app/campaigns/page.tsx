import { CampaignManager } from "@/components/interactive";
import { getCampaignsView } from "@/lib/demo-data";

export default async function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-zinc-500">Campaigns</p>
        <h1 className="text-3xl font-semibold tracking-tight">Create, edit, and launch recovery campaigns</h1>
      </div>
      <CampaignManager campaigns={getCampaignsView()} />
    </div>
  );
}
