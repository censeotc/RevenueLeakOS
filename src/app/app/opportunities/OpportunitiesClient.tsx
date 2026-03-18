"use client";

import { useState } from "react";
import { Phone, FileText, RefreshCw, Target, ChevronRight, MessageSquare, Calendar, User, Plus, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatTimeAgo, formatPhone, getInitials, cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody } from "@/components/ui/dialog";

type OpportunityType = "missed_call" | "estimate_rescue" | "reactivation";
type OpportunityStatus = "new" | "attempted" | "responded" | "qualified" | "booked" | "lost" | "paused" | "closed";

interface Opportunity {
  id: string;
  type: string;
  status: string;
  title: string;
  serviceType: string | null;
  estimatedValue: number | null;
  actualValue: number | null;
  followUpCount: number;
  createdAt: Date;
  lastContactAt: Date | null;
  resolvedAt: Date | null;
  contact: { id: string; firstName: string; lastName: string; phone: string; email: string | null; type: string; status: string };
  assignedTo: { id: string; name: string | null; email: string } | null;
  _count: { notes: number; callEvents: number; messageEvents: number; bookings: number };
}

const TYPE_CONFIG = {
  missed_call: { label: "Missed Call", icon: Phone, color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  estimate_rescue: { label: "Estimate Rescue", icon: FileText, color: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
  reactivation: { label: "Reactivation", icon: RefreshCw, color: "bg-green-100 text-green-700", dot: "bg-green-500" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-blue-100 text-blue-800" },
  attempted: { label: "Attempted", color: "bg-yellow-100 text-yellow-800" },
  responded: { label: "Responded", color: "bg-purple-100 text-purple-800" },
  qualified: { label: "Qualified", color: "bg-indigo-100 text-indigo-800" },
  booked: { label: "Booked", color: "bg-green-100 text-green-800" },
  lost: { label: "Lost", color: "bg-red-100 text-red-800" },
  paused: { label: "Paused", color: "bg-gray-100 text-gray-800" },
  closed: { label: "Closed", color: "bg-gray-100 text-gray-600" },
  stale: { label: "Stale", color: "bg-orange-100 text-orange-800" },
};

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status] ?? { label: status, color: "bg-gray-100 text-gray-800" };
}

interface OpportunitiesClientProps {
  opportunities: Opportunity[];
}

export function OpportunitiesClient({ opportunities }: OpportunitiesClientProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Opportunity | null>(null);

  const filtered = opportunities.filter((opp) => {
    const matchesTab = activeTab === "all" || opp.type === activeTab;
    const matchesSearch =
      !search ||
      `${opp.contact.firstName} ${opp.contact.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      opp.title.toLowerCase().includes(search.toLowerCase()) ||
      (opp.serviceType?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchesTab && matchesSearch;
  });

  const counts = {
    all: opportunities.length,
    missed_call: opportunities.filter((o) => o.type === "missed_call").length,
    estimate_rescue: opportunities.filter((o) => o.type === "estimate_rescue").length,
    reactivation: opportunities.filter((o) => o.type === "reactivation").length,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Opportunities</h1>
          <p className="text-slate-500 text-sm mt-1">{opportunities.length} total opportunities</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          New Opportunity
        </Button>
      </div>

      {/* Tabs + Search */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All <span className="ml-1 text-xs opacity-60">({counts.all})</span></TabsTrigger>
            <TabsTrigger value="missed_call">
              <Phone className="h-3 w-3" /> Missed Call <span className="ml-1 text-xs opacity-60">({counts.missed_call})</span>
            </TabsTrigger>
            <TabsTrigger value="estimate_rescue">
              <FileText className="h-3 w-3" /> Estimate <span className="ml-1 text-xs opacity-60">({counts.estimate_rescue})</span>
            </TabsTrigger>
            <TabsTrigger value="reactivation">
              <RefreshCw className="h-3 w-3" /> Reactivation <span className="ml-1 text-xs opacity-60">({counts.reactivation})</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search contacts or services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-64"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Contact</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Type</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Service</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Value</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Assigned</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Age</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((opp) => {
                const typeConfig = TYPE_CONFIG[opp.type as OpportunityType];
                const statusConfig = getStatusConfig(opp.status);
                const TypeIcon = typeConfig?.icon ?? Target;

                return (
                  <tr
                    key={opp.id}
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition"
                    onClick={() => setSelected(opp)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-slate-600">
                            {getInitials(`${opp.contact.firstName} ${opp.contact.lastName}`)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {opp.contact.firstName} {opp.contact.lastName}
                          </p>
                          <p className="text-xs text-slate-400">{formatPhone(opp.contact.phone)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full", typeConfig?.color ?? "bg-gray-100 text-gray-700")}>
                        <TypeIcon className="h-3 w-3" />
                        {typeConfig?.label ?? opp.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600">{opp.serviceType ?? "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full", statusConfig.color)}>
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-800">
                        {opp.estimatedValue ? formatCurrency(opp.estimatedValue) : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {opp.assignedTo ? (
                        <div className="flex items-center gap-1.5">
                          <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-xs font-semibold text-blue-700">
                              {getInitials(opp.assignedTo.name ?? opp.assignedTo.email)}
                            </span>
                          </div>
                          <span className="text-xs text-slate-600">{opp.assignedTo.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-400">{formatTimeAgo(opp.createdAt)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Target className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No opportunities found</p>
            </div>
          )}
        </div>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-3">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", TYPE_CONFIG[selected.type as OpportunityType]?.color ?? "bg-gray-100")}>
                    {(() => {
                      const Icon = TYPE_CONFIG[selected.type as OpportunityType]?.icon ?? Target;
                      return <Icon className="h-5 w-5" />;
                    })()}
                  </div>
                  <div>
                    <DialogTitle>{selected.title}</DialogTitle>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {selected.contact.firstName} {selected.contact.lastName} · {formatPhone(selected.contact.phone)}
                    </p>
                  </div>
                </div>
              </DialogHeader>
              <DialogBody className="space-y-4">
                {/* Status bar */}
                <div className="flex flex-wrap gap-2">
                  <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", getStatusConfig(selected.status).color)}>
                    {getStatusConfig(selected.status).label}
                  </span>
                  {selected.serviceType && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {selected.serviceType}
                    </span>
                  )}
                  {selected.estimatedValue ? (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700">
                      {formatCurrency(selected.estimatedValue)}
                    </span>
                  ) : null}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Follow-ups", value: selected.followUpCount, icon: MessageSquare },
                    { label: "Call Events", value: selected._count.callEvents, icon: Phone },
                    { label: "Messages", value: selected._count.messageEvents, icon: MessageSquare },
                    { label: "Bookings", value: selected._count.bookings, icon: Calendar },
                  ].map((stat) => {
                    const StatIcon = stat.icon;
                    return (
                      <div key={stat.label} className="bg-slate-50 rounded-xl p-3 text-center">
                        <StatIcon className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                        <p className="text-xs text-slate-500">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Assignment */}
                <div className="flex items-center justify-between py-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <User className="h-4 w-4" />
                    <span>Assigned to: </span>
                    <span className="font-medium text-slate-800">
                      {selected.assignedTo?.name ?? "Unassigned"}
                    </span>
                  </div>
                  <Button size="sm" variant="outline">Reassign</Button>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Activity Timeline</h4>
                  <div className="space-y-3">
                    {[
                      { label: "Opportunity created", date: selected.createdAt, color: "bg-blue-500" },
                      ...(selected.lastContactAt ? [{ label: "Last contact", date: selected.lastContactAt, color: "bg-purple-500" }] : []),
                      ...(selected.resolvedAt ? [{ label: "Resolved / Booked", date: selected.resolvedAt, color: "bg-green-500" }] : []),
                    ].map((event, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={cn("h-2 w-2 rounded-full shrink-0", event.color)} />
                        <span className="text-sm text-slate-600">{event.label}</span>
                        <span className="text-xs text-slate-400 ml-auto">{formatTimeAgo(event.date)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="default">Log Booking</Button>
                  <Button size="sm" variant="outline">Send SMS</Button>
                  <Button size="sm" variant="outline">Add Note</Button>
                  <Button size="sm" variant="ghost" className="text-red-600 ml-auto">Mark Lost</Button>
                </div>
              </DialogBody>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
