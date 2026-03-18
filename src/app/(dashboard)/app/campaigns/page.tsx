import type { Metadata } from "next";
import { CampaignTable } from "@/components/campaigns/CampaignTable";

export const metadata: Metadata = { title: "Campaigns" };

export default function CampaignsPage() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campaigns</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage your automated follow-up sequences</p>
        </div>
        <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          New Campaign
        </button>
      </div>
      <CampaignTable />
    </div>
  );
}
