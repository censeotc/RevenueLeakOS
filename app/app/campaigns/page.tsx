import { SectionHeader } from "@/components/section-header";
import { CampaignStatusBadge } from "@/components/status-badges";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getSessionUser } from "@/lib/session";
import { getCampaigns } from "@/lib/services/revenueleak";
import {
  addCampaignStepAction,
  createCampaignAction,
  updateCampaignStatusAction,
} from "@/app/actions";

export default async function CampaignsPage() {
  const user = await getSessionUser();
  const campaigns = await getCampaigns(user.businessId);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Campaigns"
        description="Create and manage reactivation and follow-up campaigns with step sequencing."
      />

      <Card>
        <CardHeader>
          <CardTitle>Create campaign</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCampaignAction} className="grid gap-2 md:grid-cols-3">
            <Input name="name" placeholder="Campaign name" required />
            <Input name="segment" placeholder="Segment key (e.g. maintenance_due)" required />
            <SubmitButton pendingLabel="Creating...">Create campaign</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>{campaign.name}</CardTitle>
                  <p className="text-sm text-slate-500">Segment: {campaign.segment}</p>
                </div>
                <CampaignStatusBadge status={campaign.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <form action={updateCampaignStatusAction}>
                  <input type="hidden" name="campaignId" value={campaign.id} />
                  <input type="hidden" name="status" value="active" />
                  <SubmitButton size="sm" pendingLabel="Updating...">
                    Set active
                  </SubmitButton>
                </form>
                <form action={updateCampaignStatusAction}>
                  <input type="hidden" name="campaignId" value={campaign.id} />
                  <input type="hidden" name="status" value="paused" />
                  <SubmitButton size="sm" variant="outline" pendingLabel="Updating...">
                    Pause
                  </SubmitButton>
                </form>
                <form action={updateCampaignStatusAction}>
                  <input type="hidden" name="campaignId" value={campaign.id} />
                  <input type="hidden" name="status" value="completed" />
                  <SubmitButton size="sm" variant="secondary" pendingLabel="Updating...">
                    Complete
                  </SubmitButton>
                </form>
                <Badge variant="secondary">
                  {campaign.opportunities.length} linked opportunities
                </Badge>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">Step editor</p>
                <div className="space-y-2 rounded-md border border-slate-200 p-3">
                  {campaign.steps.map((step) => (
                    <div key={step.id} className="rounded-md border border-slate-200 p-2 text-sm">
                      <p className="font-medium">
                        Step {step.stepOrder} • {step.channel.toUpperCase()} • delay {step.delayHours}h
                      </p>
                      <p className="text-slate-600">
                        {step.bodyOverride ??
                          step.template?.content ??
                          "No body set yet. Add body override below."}
                      </p>
                    </div>
                  ))}
                </div>
                <form action={addCampaignStepAction} className="space-y-2 rounded-md bg-slate-50 p-3">
                  <input type="hidden" name="campaignId" value={campaign.id} />
                  <div className="grid gap-2 md:grid-cols-3">
                    <Select name="channel" defaultValue="sms">
                      <option value="sms">SMS</option>
                      <option value="email">Email</option>
                    </Select>
                    <Input name="delayHours" type="number" defaultValue={24} />
                    <SubmitButton pendingLabel="Adding...">Add step</SubmitButton>
                  </div>
                  <Textarea
                    name="bodyOverride"
                    placeholder="Optional step body override..."
                    className="bg-white"
                  />
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
