export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">Create and manage automated follow-up campaigns</p>
        </div>
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          New Campaign
        </button>
      </div>

      {/* CampaignTable */}
      {/* CampaignEditor (modal or separate view) */}
    </div>
  );
}
