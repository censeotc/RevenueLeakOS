"use client";

import { useState, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Plus,
  Eye,
  Phone,
  Mail,
  User,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  DEMO_OPPORTUNITIES,
  DEMO_CONTACTS,
  DEMO_USERS,
} from "@/lib/demo-data";
import type { DemoOpportunity, DemoContact } from "@/lib/demo-data";

type TabValue = "all" | "missed_call" | "estimate_rescue" | "reactivation";

const STATUS_STYLES: Record<string, { className: string; label: string }> = {
  new: { className: "bg-blue-100 text-blue-800", label: "New" },
  attempted: { className: "bg-yellow-100 text-yellow-800", label: "Attempted" },
  responded: { className: "bg-green-100 text-green-800", label: "Responded" },
  qualified: { className: "bg-indigo-100 text-indigo-800", label: "Qualified" },
  booked: { className: "bg-emerald-100 text-emerald-800", label: "Booked" },
  lost: { className: "bg-red-100 text-red-800", label: "Lost" },
  paused: { className: "bg-gray-100 text-gray-800", label: "Paused" },
};

const TYPE_LABELS: Record<string, string> = {
  missed_call: "Missed Call",
  estimate_rescue: "Estimate Rescue",
  reactivation: "Reactivation",
};

function formatCurrency(value: number | null): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function getContact(contactId: string): DemoContact | undefined {
  return DEMO_CONTACTS.find((c) => c.id === contactId);
}

function getUserName(userId: string | null): string {
  if (!userId) return "Unassigned";
  const user = DEMO_USERS.find((u) => u.id === userId);
  return user?.name ?? "Unassigned";
}

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? {
    className: "bg-gray-100 text-gray-800",
    label: status,
  };
  return (
    <Badge className={`${style.className} border-0`}>
      {style.label}
    </Badge>
  );
}

function TypeBadge({ type }: { type: string }) {
  return (
    <Badge variant="outline" className="text-xs font-normal">
      {TYPE_LABELS[type] ?? type}
    </Badge>
  );
}

export default function OpportunitiesPage() {
  const [activeTab, setActiveTab] = useState<TabValue>("all");
  const [selectedOpp, setSelectedOpp] = useState<DemoOpportunity | null>(null);
  const [noteText, setNoteText] = useState("");

  const counts = useMemo(() => {
    const all = DEMO_OPPORTUNITIES.length;
    const missed_call = DEMO_OPPORTUNITIES.filter(
      (o) => o.type === "missed_call"
    ).length;
    const estimate_rescue = DEMO_OPPORTUNITIES.filter(
      (o) => o.type === "estimate_rescue"
    ).length;
    const reactivation = DEMO_OPPORTUNITIES.filter(
      (o) => o.type === "reactivation"
    ).length;
    return { all, missed_call, estimate_rescue, reactivation };
  }, []);

  const filtered = useMemo(() => {
    if (activeTab === "all") return DEMO_OPPORTUNITIES;
    return DEMO_OPPORTUNITIES.filter((o) => o.type === activeTab);
  }, [activeTab]);

  const selectedContact = selectedOpp
    ? getContact(selectedOpp.contactId)
    : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Opportunities"
        description="Track and manage revenue recovery opportunities"
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Opportunity
        </Button>
      </PageHeader>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabValue)}
      >
        <TabsList>
          <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
          <TabsTrigger value="missed_call">
            Missed Calls ({counts.missed_call})
          </TabsTrigger>
          <TabsTrigger value="estimate_rescue">
            Estimate Rescue ({counts.estimate_rescue})
          </TabsTrigger>
          <TabsTrigger value="reactivation">
            Reactivation ({counts.reactivation})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="text-right">Est. Value</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[60px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((opp) => {
                    const contact = getContact(opp.contactId);
                    const contactName = contact
                      ? `${contact.firstName} ${contact.lastName}`
                      : "Unknown";

                    return (
                      <TableRow
                        key={opp.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedOpp(opp)}
                      >
                        <TableCell>
                          <StatusBadge status={opp.status} />
                        </TableCell>
                        <TableCell className="font-medium">
                          {contactName}
                        </TableCell>
                        <TableCell>
                          <TypeBadge type={opp.type} />
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {opp.title}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(opp.estimatedValue)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {opp.serviceType ?? "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {getUserName(opp.assignedToId)}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatDistanceToNow(opp.createdAt, {
                            addSuffix: true,
                          })}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOpp(opp);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No opportunities found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog
        open={selectedOpp !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOpp(null);
            setNoteText("");
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedOpp && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 flex-wrap">
                  {selectedOpp.title}
                </DialogTitle>
                <DialogDescription asChild>
                  <div className="flex items-center gap-2 pt-1">
                    <TypeBadge type={selectedOpp.type} />
                    <StatusBadge status={selectedOpp.status} />
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 pt-2">
                {/* Contact Info */}
                {selectedContact && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Contact
                    </h4>
                    <div className="rounded-lg border p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {selectedContact.firstName}{" "}
                          {selectedContact.lastName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{selectedContact.phone}</span>
                      </div>
                      {selectedContact.email && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" />
                          <span>{selectedContact.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Details */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Estimated Value
                      </p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(selectedOpp.estimatedValue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Service Type
                      </p>
                      <p className="text-sm font-medium">
                        {selectedOpp.serviceType ?? "—"}
                      </p>
                    </div>
                  </div>
                  {selectedOpp.description && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Description
                      </p>
                      <p className="text-sm">{selectedOpp.description}</p>
                    </div>
                  )}
                </div>

                {/* Assignment */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Assigned To
                  </h4>
                  <Select
                    defaultValue={selectedOpp.assignedToId ?? "unassigned"}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {DEMO_USERS.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Activity Timeline */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Activity Timeline
                  </h4>
                  <div className="rounded-lg border p-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 text-sm">
                        <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                        <div>
                          <p>Opportunity created</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(selectedOpp.createdAt, {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                      {selectedOpp.updatedAt.getTime() !==
                        selectedOpp.createdAt.getTime() && (
                        <div className="flex items-start gap-3 text-sm">
                          <div className="mt-1 h-2 w-2 rounded-full bg-green-500 shrink-0" />
                          <div>
                            <p>Last updated</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(selectedOpp.updatedAt, {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedOpp.resolvedAt && (
                        <div className="flex items-start gap-3 text-sm">
                          <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                          <div>
                            <p>Resolved</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(selectedOpp.resolvedAt, {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Notes
                  </h4>
                  {selectedContact?.notes && (
                    <div className="rounded-lg border p-3 text-sm bg-muted/50">
                      {selectedContact.notes}
                    </div>
                  )}
                  {selectedOpp.description && (
                    <div className="rounded-lg border p-3 text-sm bg-muted/50">
                      {selectedOpp.description}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Add a note..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="min-h-[60px]"
                    />
                  </div>
                  <Button
                    size="sm"
                    disabled={!noteText.trim()}
                    onClick={() => setNoteText("")}
                  >
                    Add Note
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
