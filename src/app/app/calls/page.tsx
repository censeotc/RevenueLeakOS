"use client";

import { useState, useMemo } from "react";
import {
  Phone,
  PhoneMissed,
  PhoneOff,
  Moon,
  Check,
  Eye,
  PlusCircle,
  Clock,
  MessageSquare,
  FileText,
  User,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatDateTime, formatPhone, formatCurrency } from "@/lib/utils";
import {
  DEMO_CALL_EVENTS,
  DEMO_CONTACTS,
  DEMO_OPPORTUNITIES,
  DEMO_BOOKINGS,
  type DemoCallEvent,
} from "@/lib/demo-data";

function getContactName(contactId: string | null): string | null {
  if (!contactId) return null;
  const contact = DEMO_CONTACTS.find((c) => c.id === contactId);
  if (!contact) return null;
  return `${contact.firstName} ${contact.lastName}`;
}

function getLinkedOpportunity(opportunityId: string | null) {
  if (!opportunityId) return null;
  return DEMO_OPPORTUNITIES.find((o) => o.id === opportunityId) ?? null;
}

function isBooked(call: DemoCallEvent): boolean {
  if (!call.opportunityId) return false;
  const opp = getLinkedOpportunity(call.opportunityId);
  if (opp?.status === "booked") return true;
  return DEMO_BOOKINGS.some((b) => b.opportunityId === call.opportunityId);
}

function hasResponded(call: DemoCallEvent): boolean {
  if (!call.opportunityId) return false;
  const opp = getLinkedOpportunity(call.opportunityId);
  return opp?.status === "responded" || opp?.status === "booked" || opp?.status === "qualified" || false;
}

function isLost(call: DemoCallEvent): boolean {
  if (!call.opportunityId) return false;
  const opp = getLinkedOpportunity(call.opportunityId);
  return opp?.status === "lost" || false;
}

function formatDuration(seconds: number | null): string {
  if (seconds === null) return "Missed";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function getSmsPreview(call: DemoCallEvent): string {
  if (!call.opportunityId) return "—";
  const opp = getLinkedOpportunity(call.opportunityId);
  if (!opp?.description) return "—";
  return opp.description.length > 50
    ? opp.description.slice(0, 50) + "…"
    : opp.description;
}

const statusConfig: Record<string, { label: string; variant: "destructive" | "success" | "warning" | "default" }> = {
  missed: { label: "Missed", variant: "destructive" },
  answered: { label: "Answered", variant: "success" },
  voicemail: { label: "Voicemail", variant: "warning" },
  abandoned: { label: "Abandoned", variant: "destructive" },
};

const oppStatusConfig: Record<string, { label: string; variant: "destructive" | "success" | "warning" | "default" | "info" | "secondary" }> = {
  new: { label: "New", variant: "info" },
  attempted: { label: "Attempted", variant: "warning" },
  responded: { label: "Responded", variant: "success" },
  qualified: { label: "Qualified", variant: "success" },
  booked: { label: "Booked", variant: "success" },
  lost: { label: "Lost", variant: "destructive" },
};

type TabFilter = "all" | "missed" | "after-hours" | "responded" | "booked" | "lost";

export default function CallsPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>("missed");
  const [selectedCall, setSelectedCall] = useState<DemoCallEvent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const sortedCalls = useMemo(
    () => [...DEMO_CALL_EVENTS].sort((a, b) => b.callStartedAt.getTime() - a.callStartedAt.getTime()),
    []
  );

  const filteredCalls = useMemo(() => {
    switch (activeTab) {
      case "missed":
        return sortedCalls.filter((c) => c.status === "missed");
      case "after-hours":
        return sortedCalls.filter((c) => c.isAfterHours);
      case "responded":
        return sortedCalls.filter((c) => hasResponded(c));
      case "booked":
        return sortedCalls.filter((c) => isBooked(c));
      case "lost":
        return sortedCalls.filter((c) => isLost(c));
      default:
        return sortedCalls;
    }
  }, [activeTab, sortedCalls]);

  function openDetail(call: DemoCallEvent) {
    setSelectedCall(call);
    setDialogOpen(true);
  }

  const selectedContact = selectedCall?.contactId
    ? DEMO_CONTACTS.find((c) => c.id === selectedCall.contactId)
    : null;
  const selectedOpp = selectedCall
    ? getLinkedOpportunity(selectedCall.opportunityId)
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calls"
        description="Monitor missed calls and follow-up status"
      />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabFilter)}>
        <TabsList>
          <TabsTrigger value="missed">
            <PhoneMissed className="mr-1.5 h-4 w-4" />
            Missed
          </TabsTrigger>
          <TabsTrigger value="after-hours">
            <Moon className="mr-1.5 h-4 w-4" />
            After Hours
          </TabsTrigger>
          <TabsTrigger value="all">
            <Phone className="mr-1.5 h-4 w-4" />
            All
          </TabsTrigger>
          <TabsTrigger value="responded">
            <MessageSquare className="mr-1.5 h-4 w-4" />
            Responded
          </TabsTrigger>
          <TabsTrigger value="booked">
            <Check className="mr-1.5 h-4 w-4" />
            Booked
          </TabsTrigger>
          <TabsTrigger value="lost">
            <PhoneOff className="mr-1.5 h-4 w-4" />
            Lost
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>Caller</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>After Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Linked Opportunity</TableHead>
                    <TableHead>SMS Preview</TableHead>
                    <TableHead>Booked</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCalls.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                        No calls match this filter.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCalls.map((call) => {
                      const name = getContactName(call.contactId);
                      const opp = getLinkedOpportunity(call.opportunityId);
                      const booked = isBooked(call);
                      const status = statusConfig[call.status] ?? statusConfig.missed;
                      const oppStatus = opp ? oppStatusConfig[opp.status] : null;

                      return (
                        <TableRow key={call.id}>
                          <TableCell className="whitespace-nowrap">
                            {formatDateTime(call.callStartedAt)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {name ?? formatPhone(call.callerNumber)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                call.duration === null && "text-destructive font-medium"
                              )}
                            >
                              {formatDuration(call.duration)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {call.isAfterHours ? (
                              <Badge variant="warning">
                                <Moon className="mr-1 h-3 w-3" />
                                Yes
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">No</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </TableCell>
                          <TableCell>
                            {oppStatus ? (
                              <Badge variant={oppStatus.variant}>{oppStatus.label}</Badge>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                            {getSmsPreview(call)}
                          </TableCell>
                          <TableCell>
                            {booked ? (
                              <Check className="h-5 w-5 text-green-600" />
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDetail(call)}
                            >
                              <Eye className="mr-1.5 h-4 w-4" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Call Details
            </DialogTitle>
            <DialogDescription>
              {selectedCall && formatDateTime(selectedCall.callStartedAt)}
            </DialogDescription>
          </DialogHeader>

          {selectedCall && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Caller</p>
                  <p className="font-medium">
                    {selectedContact
                      ? `${selectedContact.firstName} ${selectedContact.lastName}`
                      : formatPhone(selectedCall.callerNumber)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatPhone(selectedCall.callerNumber)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Duration</p>
                  <p className="font-medium">{formatDuration(selectedCall.duration)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={statusConfig[selectedCall.status]?.variant ?? "default"}>
                    {statusConfig[selectedCall.status]?.label ?? selectedCall.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">After Hours</p>
                  <p className="font-medium">{selectedCall.isAfterHours ? "Yes" : "No"}</p>
                </div>
              </div>

              {selectedCall.intakeSummary && (
                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <FileText className="h-4 w-4" />
                    Intake Summary
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedCall.intakeSummary}
                  </p>
                </div>
              )}

              {selectedCall.transcription && (
                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <MessageSquare className="h-4 w-4" />
                    Transcription
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedCall.transcription}
                  </p>
                </div>
              )}

              {selectedOpp && (
                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4" />
                    Linked Opportunity
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{selectedOpp.title}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={oppStatusConfig[selectedOpp.status]?.variant ?? "default"}>
                        {oppStatusConfig[selectedOpp.status]?.label ?? selectedOpp.status}
                      </Badge>
                      {selectedOpp.estimatedValue && (
                        <span className="text-sm text-muted-foreground">
                          {formatCurrency(selectedOpp.estimatedValue)}
                        </span>
                      )}
                    </div>
                    {selectedOpp.description && (
                      <p className="text-sm text-muted-foreground">
                        {selectedOpp.description}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {selectedContact && (
                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4" />
                    Contact Info
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Email: </span>
                      {selectedContact.email ?? "—"}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type: </span>
                      {selectedContact.type.replace("_", " ")}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Lifetime Value: </span>
                      {formatCurrency(selectedContact.lifetime_value)}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tags: </span>
                      {selectedContact.tags.join(", ") || "—"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {selectedCall && !selectedOpp && (
              <Button>
                <PlusCircle className="mr-1.5 h-4 w-4" />
                Create Opportunity
              </Button>
            )}
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
