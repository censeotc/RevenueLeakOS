import { DataTable } from "@/components/shared/DataTable";
import { formatCurrency } from "@/lib/formatters";
import type { CampaignRecord } from "@/types/revenue";

import { CampaignStatusBadge } from "./CampaignStatusBadge";

export function CampaignTable({ campaigns }: { campaigns: CampaignRecord[] }) {
  return (
    <DataTable
      title="Campaigns"
      description="Workflow campaigns available for launch, tuning, and attribution reporting."
      columns={["Campaign", "Audience", "Status", "Recovered revenue"]}
      rows={campaigns.map((campaign) => [campaign.name, campaign.audienceLabel, <CampaignStatusBadge key={`${campaign.id}-status`} status={campaign.status} />, formatCurrency(campaign.recoveredRevenueCents)])}
    />
  );
}
