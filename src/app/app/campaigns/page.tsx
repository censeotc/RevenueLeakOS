"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { demoCampaigns, demoTemplates } from "@/lib/demo-data";
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

const stepTypeIcons: Record<string, React.ReactNode> = {
  sms: <MessageSquare className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  call: <Phone className="h-4 w-4" />,
  wait: <Clock className="h-4 w-4" />,
};

export default function CampaignsPage() {
  const { success } = useToast();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>({});
  const [newCampaignName, setNewCampaignName] = useState("");

  const filtered = statusFilter
    ? demoCampaigns.filter((c) => c.status === statusFilter)
    : demoCampaigns;

  const selected = selectedCampaign ? demoCampaigns.find((c) => c.id === selectedCampaign) : null;

  const handleActivate = (id: string) => {
    setLocalStatuses((prev) => ({ ...prev, [id]: "active" }));
    success("Campaign activated", "Outreach will begin shortly");
  };

  const handlePause = (id: string) => {
    setLocalStatuses((prev) => ({ ...prev, [id]: "paused" }));
    success("Campaign paused", "Outreach has been paused");
  };

  const handleCreateCampaign = () => {
    if (!newCampaignName.trim()) return;
    success("Campaign created", `"${newCampaignName}" saved as draft`);
    setNewCampaignName("");
    setShowCreate(false);
  };

  return (
    <div className="flex h-full">
      <div className={`flex-1 flex flex-col ${selected ? "hidden lg:flex" : ""}`}>
        <TopBar title="Campaigns" />
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-2 flex-wrap">
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

          {/* Create Form */}
          {showCreate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">New Campaign</CardTitle>
                <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground ml-auto">
                  <X className="h-4 w-4" />
                </button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Campaign Name</label>
                  <input
                    className="w-full h-9 rounded-lg border border-input px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g., Spring AC Check-Up"
                    value={newCampaignName}
                    onChange={(e) => setNewCampaignName(e.target.value)}
                  />
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
                  <textarea className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background min-h-[60px] focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Campaign description..." />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
                  <Button size="sm" onClick={handleCreateCampaign} disabled={!newCampaignName.trim()}>Create Campaign</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Campaign List */}
          {filtered.length === 0 ? (
            <Card>
              <CardContent>
                <EmptyState
                  icon={Megaphone}
                  title="No campaigns found"
                  description="Create a campaign to start automated outreach."
                  action={{ label: "Create Campaign", onClick: () => setShowCreate(true) }}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filtered.map((campaign) => {
                const effectiveStatus = localStatuses[campaign.id] ?? campaign.status;
                return (
                  <Card
                    key={campaign.id}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${selectedCampaign === campaign.id ? "ring-2 ring-primary" : ""}`}
                    onClick={() => setSelectedCampaign(campaign.id)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{campaign.name}</h3>
                            <StatusBadge status={effectiveStatus} />
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
                        <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
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
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Campaign Detail */}
      {selected && (
        <div className="w-full lg:w-[480px] border-l border-border bg-white overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between z-10">
            <div>
              <h2 className="font-semibold">{selected.name}</h2>
              <StatusBadge status={localStatuses[selected.id] ?? selected.status} />
            </div>
            <button onClick={() => setSelectedCampaign(null)} className="rounded-lg p-1 hover:bg-accent">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 space-y-6">
            <p className="text-sm text-muted-foreground">{selected.description}</p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Targets", value: selected.targetCount },
                { label: "Sent", value: selected.sentCount },
                { label: "Responses", value: selected.responseCount },
                { label: "Booked", value: selected.bookedCount },
              ].map((item) => (
                <div key={item.label} className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-lg font-bold">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>

            {selected.sentCount > 0 && (
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Response rate</span>
                  <span>{Math.round((selected.responseCount / selected.sentCount) * 100)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-primary rounded-full"
                    style={{ width: `${(selected.responseCount / selected.sentCount) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Steps */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Campaign Steps</h3>
              <div className="space-y-3">
                {selected.steps.map((step, i) => {
                  const template = step.templateId ? demoTemplates.find((t) => t.id === step.templateId) : null;
                  return (
                    <div key={step.id} className="relative">
                      {i > 0 && <div className="absolute left-5 -top-3 h-3 w-px bg-border" />}
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
              <Button variant="outline" size="sm" className="w-full mt-3">
                <Plus className="h-4 w-4 mr-1" /> Add Step
              </Button>
            </div>

            <div className="flex gap-2">
              {(localStatuses[selected.id] ?? selected.status) === "draft" && (
                <Button className="flex-1" onClick={() => handleActivate(selected.id)}>Activate Campaign</Button>
              )}
              {(localStatuses[selected.id] ?? selected.status) === "active" && (
                <Button variant="outline" className="flex-1" onClick={() => handlePause(selected.id)}>Pause Campaign</Button>
              )}
              <Button variant="outline" className="flex-1">Edit</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
