import Link from "next/link";

import { saveCampaignAction, updateCampaignStatusAction } from "@/app/actions";
import { PageHeader } from "@/components/app-shell/page-header";
import { StatusBadge } from "@/components/app-shell/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getCampaigns } from "@/lib/data/selectors";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const campaigns = getCampaigns();
  const selected = campaigns.find((campaign) => campaign.id === params.id) ?? campaigns[0];

  return (
    <>
      <PageHeader
        eyebrow="Workflow orchestration"
        title="Campaigns"
        description="Manage draft, scheduled, active, paused, and completed campaigns across missed call follow-up, estimate rescue, and reactivation workflows."
      />

      <section className="grid gap-6 xl:grid-cols-[1fr,0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>Campaign list</CardTitle>
            <CardDescription>Create, launch, pause, and inspect performance from one queue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <Link href={`/app/campaigns?id=${campaign.id}`} className="font-medium text-slate-900">
                      {campaign.name}
                    </Link>
                    <p className="text-sm text-slate-500">{campaign.segmentName ?? campaign.type}</p>
                  </div>
                  <StatusBadge value={campaign.status} />
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-3 text-sm">
                    <p className="text-slate-500">Type</p>
                    <p className="font-medium text-slate-900">{campaign.type.replace(/_/g, " ")}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 text-sm">
                    <p className="text-slate-500">Messages</p>
                    <p className="font-medium text-slate-900">{campaign.messageCount}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 text-sm">
                    <p className="text-slate-500">Bookings influenced</p>
                    <p className="font-medium text-slate-900">{campaign.bookingCount}</p>
                  </div>
                </div>
                <form action={updateCampaignStatusAction} className="mt-4 flex flex-wrap items-center gap-2">
                  <input type="hidden" name="campaignId" value={campaign.id} />
                  <Select name="status" defaultValue={campaign.status}>
                    <SelectTrigger className="w-44">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      {["draft", "scheduled", "active", "paused", "completed"].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" type="submit" variant="outline">
                    Save
                  </Button>
                </form>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create campaign</CardTitle>
              <CardDescription>Draft a new workflow with clean defaults and stop conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={saveCampaignAction} className="grid gap-3">
                <Input name="name" placeholder="Campaign name" required />
                <div className="grid gap-3 md:grid-cols-2">
                  <Select name="type" defaultValue="reactivation">
                    <SelectTrigger>
                      <SelectValue placeholder="Campaign type" />
                    </SelectTrigger>
                    <SelectContent>
                      {["missed_call_followup", "estimate_rescue", "reactivation"].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select name="channel" defaultValue="sms">
                    <SelectTrigger>
                      <SelectValue placeholder="Channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">sms</SelectItem>
                      <SelectItem value="email">email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input name="segmentName" placeholder="Segment name" />
                <Textarea name="goal" placeholder="Performance goal or offer angle" />
                <Button type="submit">Create draft campaign</Button>
              </form>
            </CardContent>
          </Card>

          {selected ? (
            <Card>
              <CardHeader>
                <CardTitle>Step editor</CardTitle>
                <CardDescription>
                  {selected.name} · stop on reply and stop on booking enabled by default
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selected.steps.map((step) => (
                  <div key={step.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">
                          Step {step.position}: {step.title}
                        </p>
                        <p className="text-sm text-slate-500">
                          {step.channel.toUpperCase()} after {step.delayHours} hours
                        </p>
                      </div>
                      <StatusBadge value={selected.status} />
                    </div>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <div className="rounded-xl bg-slate-50 p-3 text-sm">
                        <p className="text-slate-500">Stop conditions</p>
                        <p className="font-medium text-slate-900">
                          Reply: {step.stopOnReply ? "On" : "Off"} · Booking: {step.stopOnBooking ? "On" : "Off"}
                        </p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3 text-sm">
                        <p className="text-slate-500">Copy source</p>
                        <p className="font-medium text-slate-900">
                          {step.bodyOverride ? "Custom override" : "Template-linked"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-900">Performance summary</p>
                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <div>
                      <p className="text-sm text-slate-500">Influenced bookings</p>
                      <p className="text-xl font-semibold text-slate-950">{selected.bookingCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Messages</p>
                      <p className="text-xl font-semibold text-slate-950">{selected.messageCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Estimated value</p>
                      <p className="text-xl font-semibold text-slate-950">
                        {formatCurrency(selected.opportunities.reduce((sum, opportunity) => sum + opportunity.value, 0))}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </section>
    </>
  );
}
