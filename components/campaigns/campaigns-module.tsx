"use client";

import { useState } from "react";
import { campaignStatuses, campaignTypes } from "@/lib/domain/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type CampaignRow = {
  id: string;
  name: string;
  type: string;
  status: string;
  targetSegment: string | null;
  startedAt: string | null;
  steps: Array<{
    id: string;
    orderIndex: number;
    channel: string;
    delayHours: number;
    stopOnReply: boolean;
    stopOnBooking: boolean;
  }>;
};

export function CampaignsModule({ campaigns }: { campaigns: CampaignRow[] }) {
  const [name, setName] = useState("Weekend missed-call rescue");
  const [type, setType] = useState<(typeof campaignTypes)[number]>("missed_call_followup");
  const [message, setMessage] = useState<string | null>(null);

  async function createCampaign() {
    const response = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        type,
        targetSegment: "pilot segment",
      }),
    });
    setMessage(response.ok ? "Campaign created. Refresh to load it." : "Could not create campaign.");
  }

  async function setStatus(campaignId: string, status: string) {
    const response = await fetch(`/api/campaigns/${campaignId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setMessage(response.ok ? "Campaign status updated." : "Could not update status.");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-5">
      <Card className="xl:col-span-3">
        <CardHeader>
          <CardTitle>Campaign list</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>State controls</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <p className="font-medium text-slate-900">{campaign.name}</p>
                    <p className="text-xs text-slate-500">
                      {campaign.startedAt
                        ? `Started ${new Date(campaign.startedAt).toLocaleDateString("en-US")}`
                        : "Not started"}
                    </p>
                  </TableCell>
                  <TableCell>{campaign.type}</TableCell>
                  <TableCell>
                    <Badge>{campaign.status}</Badge>
                  </TableCell>
                  <TableCell>{campaign.targetSegment ?? "—"}</TableCell>
                  <TableCell>
                    <p className="text-xs text-slate-600">
                      {campaign.steps.length} steps · stop on reply/booking enabled
                    </p>
                  </TableCell>
                  <TableCell>
                    <Select
                      className="h-8"
                      defaultValue={campaign.status}
                      onChange={(event) => setStatus(campaign.id, event.target.value)}
                    >
                      {campaignStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Create / edit campaign</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onChange={(event) => setType(event.target.value as typeof type)}>
              {campaignTypes.map((candidate) => (
                <option key={candidate} value={candidate}>
                  {candidate}
                </option>
              ))}
            </Select>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-700">Step editor</p>
            <p className="mt-1 text-xs text-slate-600">
              Step 1: SMS immediately · Step 2: follow-up after 18h · stop conditions: reply or
              booking.
            </p>
          </div>
          <Button onClick={createCampaign}>Save draft</Button>
          {message ? <p className="text-xs text-slate-600">{message}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
