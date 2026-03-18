"use client";

import { useState } from "react";
import { usePilotData } from "@/components/providers/pilot-data-provider";
import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency, timeAgo, getOpportunityTypeLabel, getOpportunityTypeColor } from "@/lib/utils";
import { Target, X, MessageSquare, User, Plus } from "lucide-react";

type FilterType = "all" | "missed_call" | "estimate_rescue" | "reactivation";

export default function OpportunitiesPage() {
  const { opportunities, messages, contacts, users } = usePilotData();
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedOpp, setSelectedOpp] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [localNotes, setLocalNotes] = useState<Record<string, Array<{ content: string; author: string; createdAt: Date }>>>({});

  const filtered =
    filter === "all"
      ? opportunities
      : opportunities.filter((o) => o.type === filter);

  const selected = selectedOpp ? opportunities.find((o) => o.id === selectedOpp) : null;
  const selectedContact = selected ? contacts.find((contact) => contact.id === selected.contactId) : null;
  const selectedAssignee = selected?.assignedToId
    ? users.find((user) => user.id === selected.assignedToId)
    : null;
  const selectedMessages = selected ? messages.filter((m) => m.opportunityId === selected.id) : [];

  const filterCounts = {
    all: opportunities.length,
    missed_call: opportunities.filter((o) => o.type === "missed_call").length,
    estimate_rescue: opportunities.filter((o) => o.type === "estimate_rescue").length,
    reactivation: opportunities.filter((o) => o.type === "reactivation").length,
  };

  const addNote = () => {
    if (!noteText.trim() || !selectedOpp) return;
    setLocalNotes((prev) => ({
      ...prev,
      [selectedOpp]: [
        ...(prev[selectedOpp] || []),
        { content: noteText, author: "Mike Kowalski", createdAt: new Date() },
      ],
    }));
    setNoteText("");
  };

  return (
    <div className="flex h-full">
      <div className={`flex-1 flex flex-col ${selected ? "hidden lg:flex" : ""}`}>
        <TopBar title="Opportunities" />
        <div className="p-6 space-y-4">
          {/* Filter Tabs */}
          <div className="flex gap-2">
            {(["all", "missed_call", "estimate_rescue", "reactivation"] as FilterType[]).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "All" : getOpportunityTypeLabel(f)} ({filterCounts[f]})
              </Button>
            ))}
          </div>

          {/* Opportunities Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Opportunity</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Type</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Contact</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Value</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Assigned To</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map((opp) => {
                      const contact = contacts.find((item) => item.id === opp.contactId);
                      const assignee = opp.assignedToId
                        ? users.find((item) => item.id === opp.assignedToId)
                        : null;
                      return (
                        <tr
                          key={opp.id}
                          className="hover:bg-muted/30 cursor-pointer"
                          onClick={() => setSelectedOpp(opp.id)}
                        >
                          <td className="px-4 py-3">
                            <div className="font-medium">{opp.title}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-xs">
                              {opp.description}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getOpportunityTypeColor(opp.type)}`}>
                              {getOpportunityTypeLabel(opp.type)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {contact ? `${contact.firstName} ${contact.lastName}` : "-"}
                          </td>
                          <td className="px-4 py-3 font-medium">{formatCurrency(opp.estimatedValue)}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={opp.status} />
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {assignee?.name || "Unassigned"}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{timeAgo(opp.createdAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="w-full lg:w-[480px] border-l border-border bg-white overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Opportunity Details</h2>
            </div>
            <button onClick={() => setSelectedOpp(null)} className="rounded-lg p-1 hover:bg-accent">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 space-y-6">
            <div>
              <h3 className="text-lg font-semibold">{selected.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{selected.description}</p>
              <div className="flex gap-2 mt-3">
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getOpportunityTypeColor(selected.type)}`}>
                  {getOpportunityTypeLabel(selected.type)}
                </span>
                <StatusBadge status={selected.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Estimated Value</p>
                <p className="text-lg font-bold">{formatCurrency(selected.estimatedValue)}</p>
              </div>
              {selected.actualValue && (
                <div>
                  <p className="text-xs text-muted-foreground">Actual Value</p>
                  <p className="text-lg font-bold text-emerald-600">{formatCurrency(selected.actualValue)}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm">{timeAgo(selected.createdAt)}</p>
              </div>
              {selected.resolvedAt && (
                <div>
                  <p className="text-xs text-muted-foreground">Resolved</p>
                  <p className="text-sm">{timeAgo(selected.resolvedAt)}</p>
                </div>
              )}
            </div>

            {/* Contact Info */}
            {selectedContact && (
              <div className="border border-border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Contact</span>
                </div>
                <p className="text-sm font-medium">{selectedContact.firstName} {selectedContact.lastName}</p>
                <p className="text-xs text-muted-foreground">{selectedContact.phone}</p>
                <p className="text-xs text-muted-foreground">{selectedContact.email}</p>
              </div>
            )}

            {/* Assignment */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Assigned To</p>
              <select className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background">
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id} selected={u.id === selected.assignedToId}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            {/* SMS Thread */}
            {selectedMessages.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Messages ({selectedMessages.length})</span>
                </div>
                <div className="space-y-2">
                  {selectedMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`rounded-lg p-3 text-sm ${
                        msg.direction === "outbound"
                          ? "bg-primary/10 ml-4"
                          : "bg-muted mr-4"
                      }`}
                    >
                      <p>{msg.body}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {msg.direction === "outbound" ? "Sent" : "Received"} {timeAgo(msg.sentAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <p className="text-sm font-medium mb-3">Notes</p>
              {(localNotes[selected.id] || []).map((note, i) => (
                <div key={i} className="bg-muted rounded-lg p-3 mb-2 text-sm">
                  <p>{note.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">{note.author} - {timeAgo(note.createdAt)}</p>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addNote()}
                  placeholder="Add a note..."
                  className="flex-1 rounded-lg border border-input px-3 py-2 text-sm bg-background"
                />
                <Button size="sm" onClick={addNote}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">Mark Contacted</Button>
              <Button size="sm" variant="outline" className="flex-1">Log Booking</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
