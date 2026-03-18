"use client";

import { useState } from "react";
import { RefreshCw, Users, DollarSign, ArrowRight, CheckCircle, Calendar, Wrench, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPhone, formatDate, getInitials, cn } from "@/lib/utils";
import { subDays } from "date-fns";

const SEGMENTS = [
  {
    id: "no_service_12mo",
    label: "No Service in 12+ Months",
    description: "Customers who haven't had any service in over a year",
    icon: Calendar,
    color: "bg-blue-50 border-blue-200",
    iconColor: "bg-blue-100 text-blue-600",
    count: 8,
    estimatedValue: 18400,
    contacts: [
      { id: "c2", name: "Linda Morrison", phone: "(734) 555-1002", lastService: subDays(new Date(), 420), totalSpend: 8750 },
      { id: "c3", name: "Tom Bancroft", phone: "(313) 555-1003", lastService: subDays(new Date(), 380), totalSpend: 3100 },
      { id: "c6", name: "Patricia Nguyen", phone: "(248) 555-1006", lastService: subDays(new Date(), 500), totalSpend: 2900 },
      { id: "c8", name: "Nancy Ostrowski", phone: "(586) 555-1008", lastService: subDays(new Date(), 460), totalSpend: 5600 },
    ],
  },
  {
    id: "maintenance_due",
    label: "Maintenance Due",
    description: "Customers whose annual maintenance is overdue",
    icon: Wrench,
    color: "bg-orange-50 border-orange-200",
    iconColor: "bg-orange-100 text-orange-600",
    count: 5,
    estimatedValue: 1495,
    contacts: [
      { id: "c13", name: "Paul Thornton", phone: "(248) 555-1013", lastService: subDays(new Date(), 395), totalSpend: 7100 },
      { id: "c16", name: "Betty Yamamoto", phone: "(586) 555-1016", lastService: subDays(new Date(), 440), totalSpend: 6200 },
    ],
  },
  {
    id: "membership_renewal",
    label: "Membership Renewal",
    description: "Maintenance plan members up for renewal",
    icon: Star,
    color: "bg-purple-50 border-purple-200",
    iconColor: "bg-purple-100 text-purple-600",
    count: 4,
    estimatedValue: 1196,
    contacts: [
      { id: "c20", name: "Carol Vasquez", phone: "(313) 555-1020", lastService: subDays(new Date(), 415), totalSpend: 3400 },
      { id: "c22", name: "Helen Murphy", phone: "(248) 555-1022", lastService: subDays(new Date(), 475), totalSpend: 4800 },
    ],
  },
  {
    id: "replacement_cycle",
    label: "Replacement Cycle Candidates",
    description: "Systems 10+ years old likely approaching end-of-life",
    icon: RefreshCw,
    color: "bg-red-50 border-red-200",
    iconColor: "bg-red-100 text-red-600",
    count: 6,
    estimatedValue: 32400,
    contacts: [
      { id: "c5", name: "Scott Hoffman", phone: "(734) 555-1025", lastService: subDays(new Date(), 410), totalSpend: 5500 },
    ],
  },
];

export default function ReactivationPage() {
  const [selectedSegment, setSelectedSegment] = useState(SEGMENTS[0]);
  const [launching, setLaunching] = useState<string | null>(null);
  const [launched, setLaunched] = useState<Set<string>>(new Set());

  async function launchCampaign(segmentId: string) {
    setLaunching(segmentId);
    await new Promise((r) => setTimeout(r, 1800));
    setLaunched((prev) => new Set(Array.from(prev).concat(segmentId)));
    setLaunching(null);
  }

  const totalReactivatable = SEGMENTS.reduce((s, seg) => s + seg.count, 0);
  const totalEstimatedValue = SEGMENTS.reduce((s, seg) => s + seg.estimatedValue, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reactivation</h1>
        <p className="text-slate-500 text-sm mt-1">Win back dormant customers with targeted campaigns</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Reactivatable", value: totalReactivatable.toString(), sub: "dormant contacts", color: "bg-blue-50 text-blue-600" },
          { label: "Estimated Revenue", value: formatCurrency(totalEstimatedValue), sub: "potential value", color: "bg-green-50 text-green-600" },
          { label: "Active Segments", value: SEGMENTS.length.toString(), sub: "target segments", color: "bg-purple-50 text-purple-600" },
          { label: "Campaigns Active", value: "1", sub: "win-back campaigns", color: "bg-orange-50 text-orange-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className={cn("text-2xl font-bold", stat.color.split(" ")[1])}>{stat.value}</p>
              <p className="text-sm font-medium text-slate-700 mt-0.5">{stat.label}</p>
              <p className="text-xs text-slate-400">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Segment cards */}
        <div className="xl:col-span-1 space-y-3">
          <h2 className="text-sm font-semibold text-slate-700">Segments</h2>
          {SEGMENTS.map((segment) => {
            const Icon = segment.icon;
            const isSelected = selectedSegment.id === segment.id;
            const isLaunched = launched.has(segment.id);

            return (
              <div
                key={segment.id}
                onClick={() => setSelectedSegment(segment)}
                className={cn(
                  "border rounded-xl p-4 cursor-pointer transition",
                  segment.color,
                  isSelected ? "ring-2 ring-blue-500 ring-offset-1" : "hover:shadow-sm"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0", segment.iconColor)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{segment.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{segment.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs font-medium text-slate-700">
                        <Users className="h-3 w-3 inline mr-1" />{segment.count} contacts
                      </span>
                      <span className="text-xs font-medium text-green-700">
                        {formatCurrency(segment.estimatedValue)} est.
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  {isLaunched ? (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-green-700">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Campaign launched!
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="default"
                      className="w-full"
                      loading={launching === segment.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        launchCampaign(segment.id);
                      }}
                    >
                      Launch Campaign
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Segment preview */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">
              {selectedSegment.label} — Preview
            </h2>
            <span className="text-xs text-slate-400">{selectedSegment.count} total contacts</span>
          </div>

          {/* Value card */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-5 text-white">
            <p className="text-green-100 text-sm">Estimated Recoverable Revenue</p>
            <p className="text-3xl font-bold mt-1">{formatCurrency(selectedSegment.estimatedValue)}</p>
            <p className="text-green-100 text-xs mt-1">
              Based on avg ticket · {selectedSegment.count} contacts · historical recovery rate 12%
            </p>
          </div>

          {/* Preview table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Sample Contacts</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-2">Contact</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-2">Last Service</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-2">Total Spend</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSegment.contacts.map((contact) => (
                    <tr key={contact.id} className="border-b border-slate-100">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center">
                            <span className="text-xs font-semibold text-slate-600">{getInitials(contact.name)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{contact.name}</p>
                            <p className="text-xs text-slate-400">{formatPhone(contact.phone)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-orange-600 font-medium">{formatDate(contact.lastService)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-slate-800">{formatCurrency(contact.totalSpend)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="outline">
                          Send Now <ArrowRight className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {selectedSegment.contacts.length < selectedSegment.count && (
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-center">
                        <p className="text-xs text-slate-400">
                          +{selectedSegment.count - selectedSegment.contacts.length} more contacts in this segment
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
