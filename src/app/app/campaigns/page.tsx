"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Eye,
  Pause,
  Play,
  Pencil,
  Megaphone,
  Send,
  MessageSquare,
  Mail,
  Calendar,
  DollarSign,
  Users,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  Rocket,
  Clock,
  StopCircle,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/layout/page-header";
import { DEMO_CAMPAIGNS, type DemoCampaign } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

const TYPE_BADGE: Record<string, { variant: "info" | "success" | "warning"; label: string }> = {
  missed_call_followup: { variant: "info", label: "Missed Call" },
  estimate_rescue: { variant: "warning", label: "Estimate Rescue" },
  reactivation: { variant: "success", label: "Reactivation" },
};

const STATUS_BADGE: Record<string, { variant: "secondary" | "warning" | "success" | "info"; label: string }> = {
  draft: { variant: "secondary", label: "Draft" },
  scheduled: { variant: "warning", label: "Scheduled" },
  active: { variant: "success", label: "Active" },
  paused: { variant: "warning", label: "Paused" },
  completed: { variant: "info", label: "Completed" },
};

function formatDelayMinutes(minutes: number): string {
  if (minutes === 0) return "Immediately";
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 1440) return `${(minutes / 60).toFixed(0)} hr`;
  return `${(minutes / 1440).toFixed(0)} day${minutes >= 2880 ? "s" : ""}`;
}

export default function CampaignsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewCampaign, setViewCampaign] = useState<DemoCampaign | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    type: "missed_call_followup",
    channel: "sms",
    message: "",
  });
  const [campaigns, setCampaigns] = useState(DEMO_CAMPAIGNS);

  const filteredCampaigns = useMemo(() => {
    if (statusFilter === "all") return campaigns;
    return campaigns.filter((c) => c.status === statusFilter);
  }, [statusFilter, campaigns]);

  const stats = useMemo(() => {
    const total = campaigns.length;
    const active = campaigns.filter((c) => c.status === "active").length;
    const totalSent = campaigns.reduce((sum, c) => sum + c.sentCount, 0);
    const totalResponded = campaigns.reduce((sum, c) => sum + c.respondedCount, 0);
    const avgRate = totalSent > 0 ? ((totalResponded / totalSent) * 100).toFixed(1) : "0";
    return { total, active, totalSent, avgRate };
  }, [campaigns]);

  function handleTogglePause(campaignId: string) {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaignId
          ? { ...c, status: (c.status === "active" ? "paused" : "active") as typeof c.status }
          : c
      )
    );
  }

  function handleCloseCreate() {
    setShowCreate(false);
    setCreateStep(1);
    setNewCampaign({ name: "", type: "missed_call_followup", channel: "sms", message: "" });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaigns"
        description="Automated follow-up sequences"
      >
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Megaphone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Campaigns</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Play className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Sent</p>
                <p className="text-2xl font-bold">{stats.totalSent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold">{stats.avgRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredCampaigns.map((campaign) => {
          const typeBadge = TYPE_BADGE[campaign.type] ?? { variant: "secondary" as const, label: campaign.type };
          const statusBadge = STATUS_BADGE[campaign.status] ?? { variant: "secondary" as const, label: campaign.status };
          const progressPct = campaign.targetCount > 0
            ? Math.min((campaign.sentCount / campaign.targetCount) * 100, 100)
            : 0;

          return (
            <Card key={campaign.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-snug">
                    {campaign.name}
                  </CardTitle>
                  <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <Badge variant={typeBadge.variant}>{typeBadge.label}</Badge>
                  <Badge variant="outline" className="gap-1">
                    {campaign.channel === "sms" ? (
                      <MessageSquare className="h-3 w-3" />
                    ) : (
                      <Mail className="h-3 w-3" />
                    )}
                    {campaign.channel.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-md bg-muted/50 p-2">
                    <p className="text-lg font-bold">{campaign.sentCount}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Sent</p>
                  </div>
                  <div className="rounded-md bg-muted/50 p-2">
                    <p className="text-lg font-bold">{campaign.respondedCount}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Responded</p>
                  </div>
                  <div className="rounded-md bg-muted/50 p-2">
                    <p className="text-lg font-bold">{campaign.bookedCount}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Booked</p>
                  </div>
                </div>

                {/* Revenue */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Revenue generated</span>
                  <span className="font-semibold">{formatCurrency(campaign.revenue)}</span>
                </div>

                {/* Progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{campaign.sentCount} / {campaign.targetCount}</span>
                  </div>
                  <Progress value={progressPct} className="h-2" />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setViewCampaign(campaign)}
                  >
                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                    View
                  </Button>
                  {(campaign.status === "active" || campaign.status === "paused") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePause(campaign.id)}
                    >
                      {campaign.status === "active" ? (
                        <Pause className="h-3.5 w-3.5" />
                      ) : (
                        <Play className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filteredCampaigns.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No campaigns found with status &quot;{statusFilter}&quot;
          </div>
        )}
      </div>

      {/* View Campaign Dialog */}
      <Dialog open={!!viewCampaign} onOpenChange={(open) => !open && setViewCampaign(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {viewCampaign && (
            <>
              <DialogHeader>
                <DialogTitle>{viewCampaign.name}</DialogTitle>
                <DialogDescription>
                  Campaign details and performance
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Campaign Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <Badge variant={TYPE_BADGE[viewCampaign.type]?.variant ?? "secondary"}>
                      {TYPE_BADGE[viewCampaign.type]?.label ?? viewCampaign.type}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge variant={STATUS_BADGE[viewCampaign.status]?.variant ?? "secondary"}>
                      {STATUS_BADGE[viewCampaign.status]?.label ?? viewCampaign.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Channel</p>
                    <p className="font-medium capitalize">{viewCampaign.channel}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Target Segment</p>
                    <p className="font-medium">{viewCampaign.targetSegment ?? "—"}</p>
                  </div>
                </div>

                <Separator />

                {/* Performance Summary */}
                <div>
                  <h4 className="text-sm font-semibold mb-3">Performance Summary</h4>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <p className="text-xl font-bold">{viewCampaign.sentCount}</p>
                      <p className="text-xs text-muted-foreground">Sent</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <p className="text-xl font-bold">{viewCampaign.respondedCount}</p>
                      <p className="text-xs text-muted-foreground">Responded</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <p className="text-xl font-bold">{viewCampaign.bookedCount}</p>
                      <p className="text-xs text-muted-foreground">Booked</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <p className="text-xl font-bold">{formatCurrency(viewCampaign.revenue)}</p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Steps */}
                <div>
                  <h4 className="text-sm font-semibold mb-3">
                    Campaign Steps ({viewCampaign.steps?.length ?? 0})
                  </h4>
                  <div className="space-y-3">
                    {viewCampaign.steps?.map((step) => (
                      <div
                        key={step.id}
                        className="rounded-md border p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                              {step.stepOrder}
                            </div>
                            <span className="text-sm font-medium">
                              Step {step.stepOrder}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDelayMinutes(step.delayMinutes)}
                            </Badge>
                            <Badge variant="outline" className="gap-1 uppercase">
                              {step.channel === "sms" ? (
                                <MessageSquare className="h-3 w-3" />
                              ) : (
                                <Mail className="h-3 w-3" />
                              )}
                              {step.channel}
                            </Badge>
                          </div>
                        </div>
                        {step.subject && (
                          <p className="text-sm">
                            <span className="text-muted-foreground">Subject: </span>
                            <span className="font-medium">{step.subject}</span>
                          </p>
                        )}
                        <div className="rounded bg-muted/50 p-3 text-sm font-mono leading-relaxed">
                          {step.body}
                        </div>
                      </div>
                    ))}
                    {(!viewCampaign.steps || viewCampaign.steps.length === 0) && (
                      <p className="text-sm text-muted-foreground">No steps configured</p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Stop Conditions */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Stop Conditions</h4>
                  <div className="flex flex-wrap gap-2">
                    {viewCampaign.stopOnReply && (
                      <Badge variant="outline" className="gap-1">
                        <StopCircle className="h-3 w-3" />
                        Stop on reply
                      </Badge>
                    )}
                    {viewCampaign.stopOnBooking && (
                      <Badge variant="outline" className="gap-1">
                        <StopCircle className="h-3 w-3" />
                        Stop on booking
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Campaign Dialog */}
      <Dialog open={showCreate} onOpenChange={(open) => !open && handleCloseCreate()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Campaign</DialogTitle>
            <DialogDescription>
              Step {createStep} of 3
              {createStep === 1 && " — Campaign details"}
              {createStep === 2 && " — Message editor"}
              {createStep === 3 && " — Review & launch"}
            </DialogDescription>
          </DialogHeader>

          {/* Step indicators */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  step <= createStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Step 1: Details */}
          {createStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input
                  id="campaign-name"
                  placeholder="e.g. Spring Follow-up Campaign"
                  value={newCampaign.name}
                  onChange={(e) =>
                    setNewCampaign((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Campaign Type</Label>
                <Select
                  value={newCampaign.type}
                  onValueChange={(v) =>
                    setNewCampaign((prev) => ({ ...prev, type: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="missed_call_followup">
                      Missed Call Follow-up
                    </SelectItem>
                    <SelectItem value="estimate_rescue">
                      Estimate Rescue
                    </SelectItem>
                    <SelectItem value="reactivation">
                      Customer Reactivation
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Channel</Label>
                <Select
                  value={newCampaign.channel}
                  onValueChange={(v) =>
                    setNewCampaign((prev) => ({ ...prev, channel: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Message Editor */}
          {createStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-message">Message Template</Label>
                <Textarea
                  id="campaign-message"
                  placeholder={`Hi {{firstName}}, this is {{businessName}}. ${
                    newCampaign.type === "missed_call_followup"
                      ? "We noticed we missed your call. How can we help?"
                      : newCampaign.type === "estimate_rescue"
                        ? "Your estimate is still available. Any questions?"
                        : "It's been a while! We'd love to help keep your home comfortable."
                  }`}
                  value={newCampaign.message}
                  onChange={(e) =>
                    setNewCampaign((prev) => ({ ...prev, message: e.target.value }))
                  }
                  rows={6}
                />
              </div>
              <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
                <p className="font-medium mb-1">Available Variables:</p>
                <div className="flex flex-wrap gap-1.5">
                  {["{{firstName}}", "{{lastName}}", "{{businessName}}", "{{serviceType}}", "{{estimateAmount}}"].map(
                    (v) => (
                      <Badge key={v} variant="outline" className="font-mono text-[10px]">
                        {v}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {createStep === 3 && (
            <div className="space-y-4">
              <div className="rounded-md border p-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{newCampaign.name || "—"}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <Badge variant={TYPE_BADGE[newCampaign.type]?.variant ?? "secondary"}>
                    {TYPE_BADGE[newCampaign.type]?.label ?? newCampaign.type}
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Channel</span>
                  <span className="font-medium uppercase">{newCampaign.channel}</span>
                </div>
                <Separator />
                <div>
                  <p className="text-muted-foreground mb-1">Message Preview</p>
                  <div className="rounded bg-muted/50 p-3 font-mono text-xs leading-relaxed">
                    {newCampaign.message || "No message set"}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            {createStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCreateStep((s) => s - 1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            {createStep < 3 ? (
              <Button
                onClick={() => setCreateStep((s) => s + 1)}
                disabled={createStep === 1 && !newCampaign.name.trim()}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleCloseCreate}>
                <Rocket className="mr-2 h-4 w-4" />
                Launch Campaign
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
