"use client";

import { useMemo, useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import type { CampaignStatus, OpportunityType } from "@/types/domain";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

async function postAction(payload: unknown) {
  const response = await fetch("/api/demo/action", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Action failed");
  }
  return response.json();
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("owner@northshore.demo");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        startTransition(async () => {
          const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
            callbackUrl: "/app/dashboard",
          });
          if (result?.error) {
            setError("Invalid demo credentials.");
            return;
          }
          router.push("/app/dashboard");
          router.refresh();
        });
      }}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input value={email} onChange={(event) => setEmail(event.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? "Signing in..." : "Enter demo tenant"}
      </Button>
    </form>
  );
}

export function QuickActions() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const run = (payload: unknown, label: string) => {
    startTransition(async () => {
      setMessage(null);
      await postAction(payload);
      setMessage(label);
      router.refresh();
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => run({ action: "simulate_missed_call" }, "Missed inbound call simulated.")} disabled={isPending}>
          Simulate missed call
        </Button>
        <Button variant="secondary" onClick={() => run({ action: "simulate_reply" }, "Reply simulated on the latest missed-call thread.")} disabled={isPending}>
          Simulate reply
        </Button>
        <Button variant="outline" onClick={() => run({ action: "log_booking" }, "Booking logged and attribution updated.")} disabled={isPending}>
          Log booking
        </Button>
      </div>
      {message ? <p className="text-sm text-zinc-500">{message}</p> : null}
    </div>
  );
}

export function OpportunityDetailCard({
  opportunityId,
  ownerUserId,
  users,
  notes,
}: {
  opportunityId: string;
  ownerUserId?: string;
  users: Array<{ id: string; name: string; role: string }>;
  notes: Array<{ id: string; body: string; createdAt: string; author?: string }>;
}) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [selectedOwner, setSelectedOwner] = useState(ownerUserId ?? users[0]?.id ?? "");
  const [isPending, startTransition] = useTransition();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detail panel</CardTitle>
        <CardDescription>Update ownership or leave a note on the selected opportunity.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Owner assignment</label>
          <div className="flex gap-2">
            <Select value={selectedOwner} onChange={(event) => setSelectedOwner(event.target.value)}>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </Select>
            <Button
              variant="secondary"
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await postAction({ action: "assign_owner", opportunityId, ownerUserId: selectedOwner });
                  router.refresh();
                })
              }
            >
              Save
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          <Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add context, handoff notes, or next steps." />
          <Button
            disabled={isPending || !note.trim()}
            onClick={() =>
              startTransition(async () => {
                await postAction({ action: "add_note", opportunityId, body: note.trim() });
                setNote("");
                router.refresh();
              })
            }
          >
            Add note
          </Button>
          <div className="space-y-3">
            {notes.map((item) => (
              <div key={item.id} className="rounded-lg border border-zinc-200 p-3">
                <div className="mb-1 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">{item.author ?? "Team member"}</span>
                  <span className="text-xs text-zinc-500">{formatDate(item.createdAt)}</span>
                </div>
                <p className="text-sm text-zinc-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function EstimateActions({ estimateId }: { estimateId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const run = (payload: unknown) =>
    startTransition(async () => {
      await postAction(payload);
      router.refresh();
    });

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="secondary" disabled={isPending} onClick={() => run({ action: "enroll_estimate_follow_up", estimateId })}>
        Enroll in follow-up
      </Button>
      <Button size="sm" variant="outline" disabled={isPending} onClick={() => run({ action: "mark_estimate", estimateId, outcome: "responded" })}>
        Mark responded
      </Button>
      <Button size="sm" variant="outline" disabled={isPending} onClick={() => run({ action: "mark_estimate", estimateId, outcome: "booked" })}>
        Mark booked
      </Button>
      <Button size="sm" variant="ghost" disabled={isPending} onClick={() => run({ action: "mark_estimate", estimateId, outcome: "lost" })}>
        Mark lost
      </Button>
    </div>
  );
}

export function ReactivationLauncher({ segmentKey, estimatedValue }: { segmentKey: string; estimatedValue: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      <Badge variant="info">Projected value {formatCurrency(estimatedValue)}</Badge>
      <Button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await postAction({ action: "launch_reactivation", segmentKey });
            router.refresh();
          })
        }
      >
        Launch campaign
      </Button>
    </div>
  );
}

export function CallActionPanel({ opportunityId }: { opportunityId?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  if (!opportunityId) {
    return <p className="text-sm text-zinc-500">No linked opportunity on this call event.</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant="secondary"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await postAction({ action: "simulate_reply" });
            router.refresh();
          })
        }
      >
        Simulate reply
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await postAction({ action: "log_booking", opportunityId });
            router.refresh();
          })
        }
      >
        Log booking
      </Button>
    </div>
  );
}

export function CampaignManager({
  campaigns,
}: {
  campaigns: Array<{ id: string; name: string; status: CampaignStatus; type: OpportunityType; audienceLabel: string; steps: Array<{ id: string; stepOrder: number; channel: string; bodyPreview: string; delayHours: number }> }>;
}) {
  const router = useRouter();
  const [name, setName] = useState("New revenue rescue sequence");
  const [type, setType] = useState<OpportunityType>("missed_call");
  const [segmentKey, setSegmentKey] = useState("after_hours_callbacks");
  const [audienceLabel, setAudienceLabel] = useState("After-hours callbacks");
  const [isPending, startTransition] = useTransition();

  const segmentOptions = useMemo(() => ({
    missed_call: ["after_hours_callbacks"],
    estimate_rescue: ["estimate_follow_up"],
    reactivation: ["no_service_12_months", "maintenance_due", "membership_renewal", "replacement_cycle"],
  }), []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create campaign</CardTitle>
          <CardDescription>Spin up a new draft with a starter step editor scaffold.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Workflow type</label>
            <Select
              value={type}
              onChange={(event) => {
                const nextType = event.target.value as OpportunityType;
                setType(nextType);
                const nextSegment = segmentOptions[nextType][0];
                setSegmentKey(nextSegment);
              }}
            >
              <option value="missed_call">missed_call</option>
              <option value="estimate_rescue">estimate_rescue</option>
              <option value="reactivation">reactivation</option>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Segment key</label>
            <Select value={segmentKey} onChange={(event) => setSegmentKey(event.target.value)}>
              {segmentOptions[type].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Audience label</label>
            <Input value={audienceLabel} onChange={(event) => setAudienceLabel(event.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Button
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await postAction({ action: "create_campaign", name, type, segmentKey, audienceLabel });
                  router.refresh();
                })
              }
            >
              Create draft
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{campaign.name}</CardTitle>
                  <CardDescription>{campaign.audienceLabel}</CardDescription>
                </div>
                <Badge variant={campaign.status === "active" ? "success" : campaign.status === "paused" ? "warning" : campaign.status === "completed" ? "secondary" : "info"}>
                  {campaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {(["draft", "active", "paused", "completed"] as CampaignStatus[]).map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={campaign.status === status ? "default" : "outline"}
                    disabled={isPending}
                    onClick={() =>
                      startTransition(async () => {
                        await postAction({ action: "update_campaign_status", campaignId: campaign.id, status });
                        router.refresh();
                      })
                    }
                  >
                    {status}
                  </Button>
                ))}
              </div>
              <div className="space-y-3">
                {campaign.steps.map((step) => (
                  <div key={step.id} className="rounded-lg border border-zinc-200 p-3">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">Step {step.stepOrder}</p>
                      <Badge variant="secondary">{step.channel} · {step.delayHours}h</Badge>
                    </div>
                    <p className="text-sm text-zinc-600">{step.bodyPreview}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function TemplateActions({ templateId, archived }: { templateId: string; archived: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="secondary"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await postAction({ action: "duplicate_template", templateId });
            router.refresh();
          })
        }
      >
        Duplicate
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={isPending || archived}
        onClick={() =>
          startTransition(async () => {
            await postAction({ action: "archive_template", templateId });
            router.refresh();
          })
        }
      >
        Archive
      </Button>
    </div>
  );
}

export function IntegrationActions({ provider, connectedLabel }: { provider: string; connectedLabel: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <div className="space-y-2">
      <p className="text-xs text-zinc-500">{connectedLabel}</p>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await postAction({ action: "toggle_integration", provider });
              router.refresh();
            })
          }
        >
          Connect / disconnect
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await postAction({ action: "test_integration", provider });
              router.refresh();
            })
          }
        >
          Test
        </Button>
      </div>
    </div>
  );
}
