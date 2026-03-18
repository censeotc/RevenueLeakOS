"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  demoCallEvents,
  demoMessages,
  getContactById,
  demoOpportunities,
} from "@/services/seededDataService";
import { timeAgo } from "@/lib/utils";
import { Phone, PhoneIncoming, PhoneOutgoing, MessageSquare, CalendarCheck } from "lucide-react";
import { useToast } from "@/components/ui/toast";

type CallTab = "all" | "missed" | "after_hours" | "abandoned" | "responded" | "booked" | "lost";
type LocalMessage = {
  id: string;
  channel: "sms";
  direction: "inbound" | "outbound";
  toNumber: string | null;
  fromNumber: string | null;
  body: string;
  contactId: string | null;
  opportunityId: string | null;
  sentAt: Date;
};

const tabs: { value: CallTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "missed", label: "Missed" },
  { value: "after_hours", label: "After Hours" },
  { value: "abandoned", label: "Abandoned" },
  { value: "responded", label: "Responded" },
  { value: "booked", label: "Booked" },
  { value: "lost", label: "Lost" },
];

export default function CallsPage() {
  const { pushToast } = useToast();
  const [tab, setTab] = useState<CallTab>("all");
  const [selectedCall, setSelectedCall] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<Record<string, LocalMessage[]>>({});
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [isCallingBack, setIsCallingBack] = useState(false);

  const filtered = tab === "all"
    ? demoCallEvents
    : demoCallEvents.filter((c) => c.status === tab);

  const selected = selectedCall ? demoCallEvents.find((c) => c.id === selectedCall) : null;
  const selectedOpp = selected?.opportunityId
    ? demoOpportunities.find((o) => o.id === selected.opportunityId)
    : null;
  const selectedContact = selected?.contactId ? getContactById(selected.contactId) : null;
  const baseThread = selected?.opportunityId
    ? demoMessages.filter((m) => m.opportunityId === selected.opportunityId)
    : [];
  const appendedThread = selected?.opportunityId ? localMessages[selected.opportunityId] || [] : [];
  const smsThread = [...baseThread, ...appendedThread];

  const handleSendSms = async () => {
    if (!selected || !selectedOpp) {
      return;
    }

    setIsSendingSms(true);
    try {
      const messageText = `Hi, this is ${selected.calledNumber}. Sorry we missed your call—how can we help today?`;
      const response = await fetch("/api/calls/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: selected.callerNumber,
          from: selected.calledNumber,
          message: messageText,
        }),
      });

      if (!response.ok) {
        throw new Error("SMS send failed");
      }

      const newMessage = {
        id: `local_msg_${Date.now()}`,
        channel: "sms" as const,
        direction: "outbound" as const,
        toNumber: selected.callerNumber,
        fromNumber: selected.calledNumber,
        body: messageText,
        contactId: selected.contactId ?? null,
        opportunityId: selectedOpp.id,
        sentAt: new Date(),
      };

      setLocalMessages((current) => ({
        ...current,
        [selectedOpp.id]: [...(current[selectedOpp.id] || []), newMessage],
      }));

      pushToast({
        title: "SMS sent",
        description: `Message delivered to ${selected.callerNumber}.`,
        variant: "success",
      });
    } catch {
      pushToast({
        title: "SMS failed",
        description: "Unable to send message via Twilio mock service.",
        variant: "error",
      });
    } finally {
      setIsSendingSms(false);
    }
  };

  const handleCallBack = async () => {
    if (!selected) {
      return;
    }

    setIsCallingBack(true);
    try {
      const response = await fetch("/api/calls/call-back", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: selected.callerNumber,
          from: selected.calledNumber,
        }),
      });

      if (!response.ok) {
        throw new Error("Call simulation failed");
      }

      pushToast({
        title: "Call connected",
        description: `Outbound callback placed to ${selected.callerNumber}.`,
        variant: "success",
      });
    } catch {
      pushToast({
        title: "Callback failed",
        description: "Unable to place outbound call in mock mode.",
        variant: "error",
      });
    } finally {
      setIsCallingBack(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className={`flex-1 flex flex-col ${selected ? "hidden lg:flex" : ""}`}>
        <TopBar title="Calls" />
        <div className="p-6 space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg p-2 bg-red-50">
                    <Phone className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{demoCallEvents.filter((c) => c.status === "missed").length}</p>
                    <p className="text-xs text-muted-foreground">Missed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg p-2 bg-green-50">
                    <PhoneIncoming className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{demoCallEvents.filter((c) => c.status === "responded").length}</p>
                    <p className="text-xs text-muted-foreground">Responded</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg p-2 bg-blue-50">
                    <CalendarCheck className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{demoCallEvents.filter((c) => c.status === "booked").length}</p>
                    <p className="text-xs text-muted-foreground">Booked</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg p-2 bg-amber-50">
                    <PhoneOutgoing className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{demoCallEvents.filter((c) => c.status === "after_hours").length}</p>
                    <p className="text-xs text-muted-foreground">After Hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {tabs.map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  tab === t.value
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
                <span className="ml-1 text-xs">
                  ({t.value === "all" ? demoCallEvents.length : demoCallEvents.filter((c) => c.status === t.value).length})
                </span>
              </button>
            ))}
          </div>

          {/* Call Events Table */}
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Caller</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Direction</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Duration</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Opportunity</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Time</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">SMS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((call) => {
                    const contact = call.contactId ? getContactById(call.contactId) : null;
                    const opp = call.opportunityId ? demoOpportunities.find((o) => o.id === call.opportunityId) : null;
                    const hasSms = demoMessages.some((m) => m.opportunityId === call.opportunityId);
                    return (
                      <tr
                        key={call.id}
                        className="hover:bg-muted/30 cursor-pointer"
                        onClick={() => setSelectedCall(call.id)}
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium">
                            {call.callerName || (contact ? `${contact.firstName} ${contact.lastName}` : "Unknown")}
                          </div>
                          <div className="text-xs text-muted-foreground">{call.callerNumber}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            {call.direction === "inbound" ? (
                              <PhoneIncoming className="h-3.5 w-3.5" />
                            ) : (
                              <PhoneOutgoing className="h-3.5 w-3.5" />
                            )}
                            {call.direction}
                          </span>
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={call.status} /></td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {call.duration > 0 ? `${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, "0")}` : "-"}
                        </td>
                        <td className="px-4 py-3">
                          {opp ? (
                            <span className="text-xs text-primary underline">{opp.title}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{timeAgo(call.callTime)}</td>
                        <td className="px-4 py-3">
                          {hasSms && (
                            <MessageSquare className="h-4 w-4 text-primary" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td className="px-4 py-8" colSpan={7}>
                        <EmptyState
                          title="No calls in this view"
                          description="Try another filter or simulate a missed call workflow."
                          className="border-0 bg-transparent p-0 py-2"
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SMS Thread Panel */}
      {selected && (
        <div className="w-full lg:w-[400px] border-l border-border bg-white overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between z-10">
            <h2 className="font-semibold text-sm">Call Details</h2>
            <button onClick={() => setSelectedCall(null)} className="rounded-lg p-1 hover:bg-accent text-muted-foreground">
              &times;
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <p className="text-lg font-semibold">{selected.callerName || "Unknown Caller"}</p>
              <p className="text-sm text-muted-foreground">{selected.callerNumber}</p>
              <div className="flex gap-2 mt-2">
                <StatusBadge status={selected.status} />
                <span className="text-xs text-muted-foreground">{timeAgo(selected.callTime)}</span>
              </div>
            </div>

            {selectedContact && (
              <div className="border border-border rounded-lg p-3">
                <p className="text-sm font-medium">{selectedContact.firstName} {selectedContact.lastName}</p>
                <p className="text-xs text-muted-foreground">{selectedContact.email}</p>
                <p className="text-xs text-muted-foreground">{selectedContact.phone}</p>
              </div>
            )}

            {selectedOpp && (
              <div className="border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Linked Opportunity</p>
                <p className="text-sm font-medium">{selectedOpp.title}</p>
                <StatusBadge status={selectedOpp.status} />
              </div>
            )}

            {/* Booking Indicator */}
            {selected.status === "booked" && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <CalendarCheck className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Booking created</span>
              </div>
            )}

            {smsThread.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  SMS Thread
                </p>
                <div className="space-y-2">
                  {smsThread.map((msg) => (
                    <div
                      key={msg.id}
                      className={`rounded-lg p-3 text-sm ${
                        msg.direction === "outbound" ? "bg-primary/10 ml-4" : "bg-muted mr-4"
                      }`}
                    >
                      <p>{msg.body}</p>
                      <p className="text-xs text-muted-foreground mt-1">{timeAgo(msg.sentAt)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {smsThread.length === 0 && (
              <EmptyState
                title="No SMS thread yet"
                description="Send an outreach message to start a conversation with this caller."
                className="py-6"
              />
            )}

            <div className="flex gap-2">
              <Button size="sm" className="flex-1" onClick={handleSendSms} disabled={isSendingSms}>
                {isSendingSms ? "Sending..." : "Send SMS"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={handleCallBack}
                disabled={isCallingBack}
              >
                {isCallingBack ? "Calling..." : "Call Back"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
