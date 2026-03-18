"use client";

import { useState } from "react";
import { Phone, PhoneMissed, PhoneIncoming, Moon, Clock, CheckCircle, XCircle, MessageSquare, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPhone, formatTimeAgo, formatDateTime, getInitials, cn } from "@/lib/utils";
import { subDays, subHours } from "date-fns";

const DEMO_CALLS = [
  { id: "call-1", contactName: "Robert Caldwell", phone: "(734) 555-1001", status: "missed", isAfterHours: false, duration: null, opportunityStatus: "booked", createdAt: subDays(new Date(), 5), smsSent: true, smsReply: "Hey yes! My AC has been struggling. Can you come Thursday?", bookingScheduled: true },
  { id: "call-2", contactName: "David Kim", phone: "(248) 555-1005", status: "missed", isAfterHours: false, duration: null, opportunityStatus: "responded", createdAt: subDays(new Date(), 2), smsSent: true, smsReply: "My AC stopped working. Need emergency service if possible", bookingScheduled: false },
  { id: "call-3", contactName: "Chris Delgado", phone: "(734) 555-1009", status: "missed", isAfterHours: true, duration: null, opportunityStatus: "new", createdAt: subHours(new Date(), 3), smsSent: true, smsReply: null, bookingScheduled: false },
  { id: "call-4", contactName: "Gary Larson", phone: "(586) 555-1015", status: "missed", isAfterHours: false, duration: null, opportunityStatus: "attempted", createdAt: subDays(new Date(), 1), smsSent: true, smsReply: null, bookingScheduled: false },
  { id: "call-5", contactName: "Ruth Sandoval", phone: "(586) 555-1024", status: "missed", isAfterHours: true, duration: null, opportunityStatus: "new", createdAt: subHours(new Date(), 8), smsSent: true, smsReply: null, bookingScheduled: false },
  { id: "call-6", contactName: "Kevin Stern", phone: "(248) 555-1007", status: "missed", isAfterHours: false, duration: null, opportunityStatus: "responded", createdAt: subDays(new Date(), 4), smsSent: true, smsReply: "Hey can you send me an updated estimate?", bookingScheduled: false },
  { id: "call-7", contactName: "Mark Reynolds", phone: "(313) 555-1011", status: "answered", isAfterHours: false, duration: 245, opportunityStatus: null, createdAt: subDays(new Date(), 3), smsSent: false, smsReply: null, bookingScheduled: true },
  { id: "call-8", contactName: "Sandra Mitchell", phone: "(248) 555-1014", status: "answered", isAfterHours: false, duration: 182, opportunityStatus: null, createdAt: subDays(new Date(), 6), smsSent: false, smsReply: null, bookingScheduled: false },
  { id: "call-9", contactName: "Jennifer Walsh", phone: "(313) 555-1004", status: "answered", isAfterHours: false, duration: 310, opportunityStatus: null, createdAt: subDays(new Date(), 8), smsSent: false, smsReply: null, bookingScheduled: true },
];

const OPP_STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  attempted: "bg-yellow-100 text-yellow-700",
  responded: "bg-purple-100 text-purple-700",
  booked: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
};

export default function CallsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [simulating, setSimulating] = useState(false);
  const [lastSimulated, setLastSimulated] = useState<string | null>(null);

  const filtered = DEMO_CALLS.filter((call) => {
    if (activeTab === "all") return true;
    if (activeTab === "missed") return call.status === "missed" && !call.isAfterHours;
    if (activeTab === "after_hours") return call.status === "missed" && call.isAfterHours;
    if (activeTab === "answered") return call.status === "answered";
    if (activeTab === "replied") return call.smsReply !== null;
    if (activeTab === "booked") return call.bookingScheduled;
    return true;
  });

  async function simulateMissedCall() {
    setSimulating(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLastSimulated(`(734) 555-${Math.floor(1000 + Math.random() * 9000)}`);
    setSimulating(false);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Calls</h1>
          <p className="text-slate-500 text-sm mt-1">Inbound call log with opportunity tracking</p>
        </div>
        <Button onClick={simulateMissedCall} loading={simulating} variant="outline">
          <Zap className="h-4 w-4" />
          Simulate Missed Call
        </Button>
      </div>

      {/* Simulation result */}
      {lastSimulated && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
          <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <PhoneMissed className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">Missed call simulated!</p>
            <p className="text-xs text-blue-600">
              Opportunity created for {lastSimulated} · SMS follow-up sent automatically
            </p>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Calls", value: DEMO_CALLS.length, icon: Phone, color: "bg-slate-100 text-slate-600" },
          { label: "Missed Calls", value: DEMO_CALLS.filter((c) => c.status === "missed").length, icon: PhoneMissed, color: "bg-red-100 text-red-600" },
          { label: "After Hours", value: DEMO_CALLS.filter((c) => c.isAfterHours).length, icon: Moon, color: "bg-indigo-100 text-indigo-600" },
          { label: "SMS Replies", value: DEMO_CALLS.filter((c) => c.smsReply).length, icon: MessageSquare, color: "bg-green-100 text-green-600" },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center", card.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">{card.value}</p>
                  <p className="text-xs text-slate-500">{card.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({DEMO_CALLS.length})</TabsTrigger>
          <TabsTrigger value="missed">Missed ({DEMO_CALLS.filter(c => c.status === "missed" && !c.isAfterHours).length})</TabsTrigger>
          <TabsTrigger value="after_hours">After Hours ({DEMO_CALLS.filter(c => c.isAfterHours).length})</TabsTrigger>
          <TabsTrigger value="replied">Replied ({DEMO_CALLS.filter(c => c.smsReply).length})</TabsTrigger>
          <TabsTrigger value="booked">Booked ({DEMO_CALLS.filter(c => c.bookingScheduled).length})</TabsTrigger>
          <TabsTrigger value="answered">Answered ({DEMO_CALLS.filter(c => c.status === "answered").length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Call table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Caller</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Time</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Duration</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Opportunity</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">SMS Thread</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Booking</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((call) => (
                <tr key={call.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-slate-600">
                          {getInitials(call.contactName)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{call.contactName}</p>
                        <p className="text-xs text-slate-400">{formatPhone(call.phone)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {call.status === "missed" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                          <PhoneMissed className="h-3 w-3" />
                          {call.isAfterHours ? "After Hours" : "Missed"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                          <PhoneIncoming className="h-3 w-3" />
                          Answered
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-500">{formatTimeAgo(call.createdAt)}</span>
                  </td>
                  <td className="px-4 py-3">
                    {call.duration ? (
                      <span className="text-xs text-slate-600">{Math.floor(call.duration / 60)}m {call.duration % 60}s</span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {call.opportunityStatus ? (
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full capitalize", OPP_STATUS_COLORS[call.opportunityStatus])}>
                        {call.opportunityStatus}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">No opp</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {call.smsSent ? (
                      <div className="max-w-[200px]">
                        {call.smsReply ? (
                          <div className="space-y-1">
                            <div className="bg-blue-50 text-xs text-blue-700 px-2 py-1 rounded-lg">SMS sent ✓</div>
                            <div className="bg-slate-100 text-xs text-slate-700 px-2 py-1 rounded-lg truncate">{call.smsReply}</div>
                          </div>
                        ) : (
                          <div className="bg-blue-50 text-xs text-blue-700 px-2 py-1 rounded-lg">SMS sent · No reply</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {call.bookingScheduled ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                        <CheckCircle className="h-3.5 w-3.5" /> Booked
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
