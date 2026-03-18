"use client";

import { useState } from "react";
import { Megaphone, Plus, Play, Pause, CheckCircle, Clock, BarChart2, Users, DollarSign, MessageSquare, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate, formatTimeAgo, cn } from "@/lib/utils";
import { subDays } from "date-fns";

const DEMO_CAMPAIGNS = [
  {
    id: "camp-1",
    name: "Missed Call Recovery — June",
    type: "missed_call_followup",
    status: "active",
    channelType: "sms",
    targetCount: 42,
    sentCount: 42,
    repliedCount: 18,
    bookedCount: 11,
    revenue: 24800,
    scheduledAt: subDays(new Date(), 20),
    steps: 2,
  },
  {
    id: "camp-2",
    name: "Stale Estimate Rescue — Q2",
    type: "estimate_rescue",
    status: "active",
    channelType: "sms",
    targetCount: 28,
    sentCount: 28,
    repliedCount: 14,
    bookedCount: 9,
    revenue: 31500,
    scheduledAt: subDays(new Date(), 15),
    steps: 3,
  },
  {
    id: "camp-3",
    name: "Dormant Customer Win-Back",
    type: "reactivation",
    status: "completed",
    channelType: "sms",
    targetCount: 65,
    sentCount: 65,
    repliedCount: 22,
    bookedCount: 8,
    revenue: 18200,
    scheduledAt: subDays(new Date(), 45),
    steps: 2,
  },
  {
    id: "camp-4",
    name: "After-Hours Follow-Up",
    type: "missed_call_followup",
    status: "draft",
    channelType: "sms",
    targetCount: 0,
    sentCount: 0,
    repliedCount: 0,
    bookedCount: 0,
    revenue: 0,
    scheduledAt: null,
    steps: 1,
  },
];

const TYPE_LABELS: Record<string, string> = {
  missed_call_followup: "Missed Call",
  estimate_rescue: "Estimate Rescue",
  reactivation: "Reactivation",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-700", icon: Clock },
  scheduled: { label: "Scheduled", color: "bg-blue-100 text-blue-700", icon: Clock },
  active: { label: "Active", color: "bg-green-100 text-green-700", icon: Play },
  paused: { label: "Paused", color: "bg-yellow-100 text-yellow-700", icon: Pause },
  completed: { label: "Completed", color: "bg-purple-100 text-purple-700", icon: CheckCircle },
};

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = DEMO_CAMPAIGNS.filter((c) => {
    if (activeTab === "all") return true;
    return c.status === activeTab;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campaigns</h1>
          <p className="text-slate-500 text-sm mt-1">Automated follow-up sequences</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Campaigns", value: DEMO_CAMPAIGNS.length.toString() },
          { label: "Active", value: DEMO_CAMPAIGNS.filter(c => c.status === "active").length.toString() },
          { label: "Total Revenue", value: formatCurrency(DEMO_CAMPAIGNS.reduce((s, c) => s + c.revenue, 0)) },
          { label: "Total Booked", value: DEMO_CAMPAIGNS.reduce((s, c) => s + c.bookedCount, 0).toString() },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Campaign cards */}
      <div className="space-y-3">
        {filtered.map((campaign) => {
          const statusCfg = STATUS_CONFIG[campaign.status];
          const StatusIcon = statusCfg.icon;
          const convRate = campaign.sentCount > 0 ? ((campaign.bookedCount / campaign.sentCount) * 100).toFixed(1) : "0";

          return (
            <Card key={campaign.id} className="hover:shadow-md transition">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Megaphone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h3 className="font-semibold text-slate-900">{campaign.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">{TYPE_LABELS[campaign.type]}</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs text-slate-500">{campaign.steps} steps</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs text-slate-500 capitalize">{campaign.channelType}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full", statusCfg.color)}>
                          <StatusIcon className="h-3 w-3" />
                          {statusCfg.label}
                        </span>
                        {campaign.status === "active" && (
                          <Button size="sm" variant="outline">
                            <Pause className="h-3 w-3" /> Pause
                          </Button>
                        )}
                        {campaign.status === "draft" && (
                          <Button size="sm">
                            <Play className="h-3 w-3" /> Launch
                          </Button>
                        )}
                        {campaign.status === "paused" && (
                          <Button size="sm" variant="outline">
                            <Play className="h-3 w-3" /> Resume
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Performance metrics */}
                    {campaign.sentCount > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: "Sent", value: campaign.sentCount, icon: MessageSquare, color: "text-slate-700" },
                          { label: "Replied", value: `${campaign.repliedCount} (${campaign.sentCount > 0 ? ((campaign.repliedCount / campaign.sentCount) * 100).toFixed(0) : 0}%)`, icon: ArrowRight, color: "text-blue-600" },
                          { label: "Booked", value: `${campaign.bookedCount} (${convRate}%)`, icon: CheckCircle, color: "text-green-600" },
                          { label: "Revenue", value: formatCurrency(campaign.revenue), icon: DollarSign, color: "text-emerald-600" },
                        ].map((metric) => {
                          const MetricIcon = metric.icon;
                          return (
                            <div key={metric.label} className="bg-slate-50 rounded-lg p-2.5">
                              <div className="flex items-center gap-1.5">
                                <MetricIcon className={cn("h-3.5 w-3.5", metric.color)} />
                                <span className="text-xs text-slate-500">{metric.label}</span>
                              </div>
                              <p className={cn("text-sm font-semibold mt-0.5", metric.color)}>{metric.value}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {campaign.scheduledAt && (
                      <p className="text-xs text-slate-400 mt-2">
                        Started {formatTimeAgo(campaign.scheduledAt)}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
