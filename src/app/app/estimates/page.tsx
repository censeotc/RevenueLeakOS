"use client";

import { useState } from "react";
import { FileText, AlertTriangle, CheckCircle, Clock, DollarSign, Plus, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate, daysAgo, getInitials, cn } from "@/lib/utils";
import { subDays } from "date-fns";

const DEMO_ESTIMATES = [
  { id: "est-1", title: "Furnace Replacement — Bryant 80%", contactName: "Linda Morrison", contactPhone: "(734) 555-1002", amount: 4800, serviceType: "Furnace Repair", status: "booked", sentAt: subDays(new Date(), 20), daysOld: 20, opportunityStatus: "booked" },
  { id: "est-2", title: "50-Gal Water Heater Install", contactName: "Kevin Stern", contactPhone: "(248) 555-1007", amount: 1650, serviceType: "Water Heater", status: "responded", sentAt: subDays(new Date(), 12), daysOld: 12, opportunityStatus: "responded" },
  { id: "est-3", title: "200A Panel Upgrade", contactName: "Paul Thornton", contactPhone: "(248) 555-1013", amount: 3200, serviceType: "Panel Upgrade", status: "stale", sentAt: subDays(new Date(), 21), daysOld: 21, opportunityStatus: "new" },
  { id: "est-4", title: "2.5-Ton Carrier AC Replacement", contactName: "Eric Zimmerman", contactPhone: "(248) 555-1021", amount: 6400, serviceType: "HVAC Installation", status: "stale", sentAt: subDays(new Date(), 16), daysOld: 16, opportunityStatus: null },
  { id: "est-5", title: "Whole-Home Drain Cleaning", contactName: "Jennifer Walsh", contactPhone: "(313) 555-1004", amount: 380, serviceType: "Drain Cleaning", status: "open", sentAt: subDays(new Date(), 3), daysOld: 3, opportunityStatus: null },
  { id: "est-6", title: "Boiler Tune-Up & Inspection", contactName: "Mark Reynolds", contactPhone: "(313) 555-1011", amount: 225, serviceType: "HVAC Repair", status: "open", sentAt: subDays(new Date(), 2), daysOld: 2, opportunityStatus: null },
  { id: "est-7", title: "Mini-Split Install — Sunroom", contactName: "James Patterson", contactPhone: "(586) 555-1023", amount: 3800, serviceType: "HVAC Installation", status: "stale", sentAt: subDays(new Date(), 18), daysOld: 18, opportunityStatus: null },
  { id: "est-8", title: "Electrical Inspection & Permit Work", contactName: "Steven Brooks", contactPhone: "(734) 555-1017", amount: 1100, serviceType: "Electrical Repair", status: "open", sentAt: subDays(new Date(), 5), daysOld: 5, opportunityStatus: null },
  { id: "est-9", title: "Annual Maintenance Plan Renewal", contactName: "Donna Patel", contactPhone: "(734) 555-1018", amount: 299, serviceType: "Maintenance Plan", status: "stale", sentAt: subDays(new Date(), 10), daysOld: 10, opportunityStatus: null },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  open: { label: "Open", color: "bg-blue-100 text-blue-700", icon: Clock },
  stale: { label: "Stale", color: "bg-orange-100 text-orange-700", icon: AlertTriangle },
  responded: { label: "Responded", color: "bg-purple-100 text-purple-700", icon: CheckCircle },
  booked: { label: "Booked", color: "bg-green-100 text-green-700", icon: CheckCircle },
  lost: { label: "Lost", color: "bg-red-100 text-red-700", icon: AlertTriangle },
};

export default function EstimatesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [enrolled, setEnrolled] = useState<Set<string>>(new Set());

  const filtered = DEMO_ESTIMATES.filter((est) => {
    if (activeTab === "all") return true;
    return est.status === activeTab;
  });

  const totalStaleValue = DEMO_ESTIMATES.filter((e) => e.status === "stale").reduce((s, e) => s + e.amount, 0);

  function enrollInFollowUp(id: string) {
    setEnrolled((prev) => new Set(Array.from(prev).concat(id)));
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Estimates</h1>
          <p className="text-slate-500 text-sm mt-1">Track stale and open estimates</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Import Estimates
        </Button>
      </div>

      {/* Stale alert */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-orange-800">
            {DEMO_ESTIMATES.filter((e) => e.status === "stale").length} stale estimates totaling {formatCurrency(totalStaleValue)} at risk
          </p>
          <p className="text-xs text-orange-600 mt-0.5">
            Estimates older than 7 days without a response may be lost. Enroll in a follow-up campaign.
          </p>
        </div>
        <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
          Enroll All Stale
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "All Estimates", value: DEMO_ESTIMATES.length, color: "bg-slate-100 text-slate-600" },
          { label: "Open", value: DEMO_ESTIMATES.filter(e => e.status === "open").length, color: "bg-blue-100 text-blue-600" },
          { label: "Stale (7+ days)", value: DEMO_ESTIMATES.filter(e => e.status === "stale").length, color: "bg-orange-100 text-orange-600" },
          { label: "Booked", value: DEMO_ESTIMATES.filter(e => e.status === "booked").length, color: "bg-green-100 text-green-600" },
        ].map((card) => (
          <Card key={card.label}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({DEMO_ESTIMATES.length})</TabsTrigger>
          <TabsTrigger value="stale">Stale ({DEMO_ESTIMATES.filter(e => e.status === "stale").length})</TabsTrigger>
          <TabsTrigger value="open">Open ({DEMO_ESTIMATES.filter(e => e.status === "open").length})</TabsTrigger>
          <TabsTrigger value="responded">Responded ({DEMO_ESTIMATES.filter(e => e.status === "responded").length})</TabsTrigger>
          <TabsTrigger value="booked">Booked ({DEMO_ESTIMATES.filter(e => e.status === "booked").length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Estimates table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Estimate</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Contact</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Service</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Amount</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Age</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((est) => {
                const statusCfg = STATUS_CONFIG[est.status] ?? { label: est.status, color: "bg-gray-100 text-gray-700", icon: Clock };
                const StatusIcon = statusCfg.icon;
                const isStale = est.status === "stale";
                const isEnrolled = enrolled.has(est.id);

                return (
                  <tr key={est.id} className={cn("border-b border-slate-100 transition", isStale && !isEnrolled ? "bg-orange-50/30" : "hover:bg-slate-50")}>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-900">{est.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Sent {formatDate(est.sentAt)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-slate-600">{getInitials(est.contactName)}</span>
                        </div>
                        <div>
                          <p className="text-sm text-slate-800">{est.contactName}</p>
                          <p className="text-xs text-slate-400">{est.contactPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600">{est.serviceType}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-sm font-semibold", isStale ? "text-orange-600" : "text-slate-900")}>
                        {formatCurrency(est.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full", statusCfg.color)}>
                        <StatusIcon className="h-3 w-3" />
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-sm font-medium", est.daysOld >= 7 ? "text-orange-600" : "text-slate-600")}>
                        {est.daysOld}d
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {est.status === "stale" && !isEnrolled && (
                        <Button size="sm" variant="outline" onClick={() => enrollInFollowUp(est.id)}>
                          Enroll in Follow-Up
                        </Button>
                      )}
                      {isEnrolled && (
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5" /> Enrolled
                        </span>
                      )}
                      {est.status === "open" && (
                        <Button size="sm" variant="ghost">
                          Send Reminder <ArrowRight className="h-3 w-3" />
                        </Button>
                      )}
                      {(est.status === "booked" || est.status === "responded") && (
                        <span className="text-xs text-slate-400">No action needed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
