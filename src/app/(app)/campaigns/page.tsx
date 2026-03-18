"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { demoCampaigns, demoTemplates } from "@/services/seededDataService";
import { getOpportunityTypeLabel } from "@/lib/utils";
import {
  Megaphone,
  Plus,
  Users,
  Send,
  MessageSquare,
  CalendarCheck,
  ArrowRight,
  Mail,
  Phone,
  Clock,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

const stepTypeIcons: Record<string, React.ReactNode> = {
  sms: <MessageSquare className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  call: <Phone className="h-4 w-4" />,
  wait: <Clock className="h-4 w-4" />,
};

export default function CampaignsPage() {
  const { pushToast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const filtered = statusFilter
    ? demoCampaigns.filter((c) => c.status === statusFilter)
    : demoCampaigns;

  const selected = selectedCampaign ? demoCampaigns.find((c) => c.id === selectedCampaign) : null;

  return (
    <div className="flex h-full">
      <div className={`flex-1 flex flex-col ${selected ? "hidden lg:flex" : ""}`}>
        <TopBar title="Campaigns" />
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={!statusFilter ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(null)}
              >
                All ({demoCampaigns.length})
              </Button>
              {["active", "draft", "paused", "completed"].map((s) => (
                <Button
                  key={s}
                  variant={statusFilter === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)} ({demoCampaigns.filter((c) => c.status === s).length})
                </Button>
              ))}
            </div>
            <Button size="sm" onClick={() => setShowCreate(!showCreate)}>
              <Plus className="h-4 w-4 mr-1" />
              Create Campaign
            </Button>
          </div>

          {/* Create Campaign Form */}
          {showCreate && (
            <Card>
              <CardHeader>
                <CardTitle>New Campaign</CardTitle>
                <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Campaign Name</label>
                  <input className="w-full h-9 rounded-lg border border-input px-3 text-sm bg-background" placeholder="e.g., Spring AC Check-Up" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Type</label>
                    <select className="w-full h-9 rounded-lg border border-input px-3 text-sm bg-background">
                      <option value="missed_call">Missed Call</option>
                      <option value="estimate_rescue">Estimate Rescue</option>
                      <option value="reactivation">Reactivation</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Status</label>
                    <select className="w-full h-9 rounded-lg border border-input px-3 text-sm bg-background">
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Description</label>
                  <textarea className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background min-h-[60px]" placeholder="Campaign description..." />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      pushToast({
                        title: "Campaign scaffold ready",
                        description: "Campaign creation payload is staged for full write flow.",
                        variant: "info",
                      });
                      setShowCreate(false);
                    }}
                  >
                    Create Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Campaign List */}
          <div className="space-y-4">
            {filtered.map((campaign) => (
              <Card
                key={campaign.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedCampaign(campaign.id)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{campaign.name}</h3>
                        <StatusBadge status={campaign.status} />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{campaign.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                          campaign.type === "missed_call" ? "border-red-200 text-red-700" :
                          campaign.type === "estimate_rescue" ? "border-amber-200 text-amber-700" :
                          "border-blue-200 text-blue-700"
                        }`}>
                          {getOpportunityTypeLabel(campaign.type)}
                        </span>
                        <span className="text-xs text-muted-foreground">{campaign.steps.length} steps</span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-bold">{campaign.targetCount}</p>
                        <p className="text-xs text-muted-foreground">Targets</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-bold">{campaign.sentCount}</p>
                        <p className="text-xs text-muted-foreground">Sent</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-bold">{campaign.responseCount}</p>
                        <p className="text-xs text-muted-foreground">Responses</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-bold">{campaign.bookedCount}</p>
                        <p className="text-xs text-muted-foreground">Booked</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <EmptyState
                title="No campaigns in this filter"
                description="Try another status filter or create a new campaign draft."
              />
            )}
          </div>
        </div>
      </div>

      {/* Campaign Detail / Step Editor */}
      {selected && (
        <div className="w-full lg:w-[480px] border-l border-border bg-white overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between z-10">
            <div>
              <h2 className="font-semibold">{selected.name}</h2>
              <StatusBadge status={selected.status} />
            </div>
            <button onClick={() => setSelectedCampaign(null)} className="rounded-lg p-1 hover:bg-accent">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">{selected.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <p className="text-lg font-bold">{selected.targetCount}</p>
                <p className="text-xs text-muted-foreground">Targets</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <p className="text-lg font-bold">{selected.sentCount}</p>
                <p className="text-xs text-muted-foreground">Sent</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <p className="text-lg font-bold">{selected.responseCount}</p>
                <p className="text-xs text-muted-foreground">Responses</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <p className="text-lg font-bold">{selected.bookedCount}</p>
                <p className="text-xs text-muted-foreground">Booked</p>
              </div>
            </div>

            {/* Step Editor */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Campaign Steps</h3>
              <div className="space-y-3">
                {selected.steps.map((step, i) => {
                  const template = step.templateId ? demoTemplates.find((t) => t.id === step.templateId) : null;
                  return (
                    <div key={step.id} className="relative">
                      {i > 0 && (
                        <div className="absolute left-5 -top-3 h-3 w-px bg-border" />
                      )}
                      <div className="flex items-start gap-3 p-3 border border-border rounded-lg">
                        <div className="rounded-lg p-2 bg-muted text-muted-foreground shrink-0">
                          {stepTypeIcons[step.type]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">Step {step.stepOrder}</span>
                            <span className="text-xs font-medium uppercase">{step.type}</span>
                          </div>
                          {step.type === "wait" ? (
                            <p className="text-sm mt-1">Wait {step.delayHours} hours</p>
                          ) : template ? (
                            <p className="text-sm mt-1">{template.name}</p>
                          ) : (
                            <p className="text-sm text-muted-foreground mt-1">Custom content</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3"
                onClick={() =>
                  pushToast({
                    title: "Step editor scaffold",
                    description: "Step creation wiring is staged for pilot iteration.",
                    variant: "info",
                  })
                }
              >
                <Plus className="h-4 w-4 mr-1" /> Add Step
              </Button>
            </div>

            <div className="flex gap-2">
              {selected.status === "draft" && (
                <Button className="flex-1">Activate Campaign</Button>
              )}
              {selected.status === "active" && (
                <Button variant="outline" className="flex-1">Pause Campaign</Button>
              )}
              <Button variant="outline" className="flex-1">Edit</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
