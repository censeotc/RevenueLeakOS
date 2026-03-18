import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { CampaignRecord } from "@/types/revenue";

export function CampaignEditor({ campaign }: { campaign: CampaignRecord }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign editor</CardTitle>
        <CardDescription>Draft the workflow definition, audience, and launch cadence.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Input defaultValue={campaign.name} />
        <Select defaultValue={campaign.type}><option>{campaign.type}</option><option>Missed call</option><option>Reactivation</option></Select>
        <Input defaultValue={campaign.audienceLabel} />
        <Input defaultValue={campaign.launches} />
      </CardContent>
    </Card>
  );
}
