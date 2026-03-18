"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Upload,
  UserPlus,
  Users,
  UserCheck,
  UserMinus,
  UserX,
  Eye,
  FileSpreadsheet,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
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
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/layout/page-header";
import {
  DEMO_CONTACTS,
  DEMO_OPPORTUNITIES,
  type DemoContact,
} from "@/lib/demo-data";
import { formatCurrency, formatDate, formatPhone } from "@/lib/utils";

const TYPE_BADGE: Record<string, { variant: "info" | "success" | "warning"; label: string }> = {
  lead: { variant: "info", label: "Lead" },
  customer: { variant: "success", label: "Customer" },
  former_customer: { variant: "warning", label: "Former" },
};

const STATUS_BADGE: Record<string, { variant: "success" | "warning" | "secondary"; label: string }> = {
  active: { variant: "success", label: "Active" },
  dormant: { variant: "warning", label: "Dormant" },
  archived: { variant: "secondary", label: "Archived" },
};

const IMPORT_STEPS = [
  { label: "Upload CSV", description: "Select your CSV file to import" },
  { label: "Detect Headers", description: "Auto-detect column headers" },
  { label: "Map Fields", description: "Map CSV columns to contact fields" },
  { label: "Validate", description: "Check for errors and duplicates" },
  { label: "Preview", description: "Review data before importing" },
  { label: "Import", description: "Import contacts into the system" },
  { label: "Results", description: "View import summary" },
];

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const [viewContact, setViewContact] = useState<DemoContact | null>(null);
  const [showImport, setShowImport] = useState(false);

  const filteredContacts = useMemo(() => {
    if (!search.trim()) return DEMO_CONTACTS;
    const q = search.toLowerCase();
    return DEMO_CONTACTS.filter(
      (c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        formatPhone(c.phone).toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
    );
  }, [search]);

  const stats = useMemo(() => {
    const total = DEMO_CONTACTS.length;
    const active = DEMO_CONTACTS.filter((c) => c.status === "active").length;
    const dormant = DEMO_CONTACTS.filter((c) => c.status === "dormant").length;
    const leads = DEMO_CONTACTS.filter((c) => c.type === "lead").length;
    return { total, active, dormant, leads };
  }, []);

  const contactOpportunities = useMemo(() => {
    if (!viewContact) return [];
    return DEMO_OPPORTUNITIES.filter((o) => o.contactId === viewContact.id);
  }, [viewContact]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contacts"
        description="Manage your customer database"
      >
        <Button variant="outline" size="sm" onClick={() => setShowImport(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Import CSV
        </Button>
        <Button size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </PageHeader>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, phone, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Contacts</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <UserMinus className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Dormant</p>
                <p className="text-2xl font-bold">{stats.dormant}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                <UserX className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Leads</p>
                <p className="text-2xl font-bold">{stats.leads}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contacts Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell text-right">Lifetime Value</TableHead>
                <TableHead className="hidden xl:table-cell">Tags</TableHead>
                <TableHead className="hidden lg:table-cell">Last Service</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => {
                const typeBadge = TYPE_BADGE[contact.type] ?? { variant: "secondary" as const, label: contact.type };
                const statusBadge = STATUS_BADGE[contact.status] ?? { variant: "secondary" as const, label: contact.status };
                return (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">
                      {contact.firstName} {contact.lastName}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatPhone(contact.phone)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {contact.email ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={typeBadge.variant}>{typeBadge.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-right font-medium">
                      {formatCurrency(contact.lifetime_value)}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                            {tag}
                          </Badge>
                        ))}
                        {contact.tags.length > 3 && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            +{contact.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {contact.lastServiceAt
                        ? formatDate(contact.lastServiceAt)
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewContact(contact)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredContacts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No contacts found matching &quot;{search}&quot;
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Contact Dialog */}
      <Dialog open={!!viewContact} onOpenChange={(open) => !open && setViewContact(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {viewContact && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {viewContact.firstName} {viewContact.lastName}
                </DialogTitle>
                <DialogDescription>
                  Contact details and activity
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{formatPhone(viewContact.phone)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{viewContact.email ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <Badge variant={TYPE_BADGE[viewContact.type]?.variant ?? "secondary"}>
                      {TYPE_BADGE[viewContact.type]?.label ?? viewContact.type}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge variant={STATUS_BADGE[viewContact.status]?.variant ?? "secondary"}>
                      {STATUS_BADGE[viewContact.status]?.label ?? viewContact.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Address</p>
                    <p className="font-medium">
                      {viewContact.address}, {viewContact.city}, {viewContact.state} {viewContact.zip}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Lifetime Value</p>
                    <p className="font-medium">{formatCurrency(viewContact.lifetime_value)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Source</p>
                    <p className="font-medium capitalize">{viewContact.source.replace(/_/g, " ")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Service</p>
                    <p className="font-medium">
                      {viewContact.lastServiceAt ? formatDate(viewContact.lastServiceAt) : "Never"}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Tags */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {viewContact.tags.length > 0 ? (
                      viewContact.tags.map((tag) => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No tags</p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Notes */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">
                    {viewContact.notes ?? "No notes"}
                  </p>
                </div>

                <Separator />

                {/* Linked Opportunities */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">
                    Linked Opportunities ({contactOpportunities.length})
                  </h4>
                  {contactOpportunities.length > 0 ? (
                    <div className="space-y-2">
                      {contactOpportunities.map((opp) => (
                        <div
                          key={opp.id}
                          className="flex items-center justify-between rounded-md border p-3 text-sm"
                        >
                          <div>
                            <p className="font-medium">{opp.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {opp.type.replace(/_/g, " ")} · {formatDate(opp.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {opp.estimatedValue && (
                              <span className="text-sm font-medium">
                                {formatCurrency(opp.estimatedValue)}
                              </span>
                            )}
                            <Badge
                              variant={
                                opp.status === "booked"
                                  ? "success"
                                  : opp.status === "lost"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {opp.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No linked opportunities
                    </p>
                  )}
                </div>

                <Separator />

                {/* Activity Timeline Placeholder */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Activity Timeline</h4>
                  <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                    Activity timeline will appear here when integrations are connected.
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Import CSV Dialog */}
      <Dialog open={showImport} onOpenChange={setShowImport}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Import Contacts from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file to import contacts into your database.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Import Steps */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Import Flow</h4>
              <div className="space-y-1">
                {IMPORT_STEPS.map((step, idx) => (
                  <div key={step.label} className="flex items-center gap-3 text-sm">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <span className="font-medium">{step.label}</span>
                      <span className="text-muted-foreground"> — {step.description}</span>
                    </div>
                    {idx < IMPORT_STEPS.length - 1 && (
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Upload Area */}
            <div className="rounded-lg border-2 border-dashed p-8 text-center">
              <FileSpreadsheet className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">
                Drop your CSV file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports .csv and .xlsx files up to 10MB
              </p>
              <Button variant="outline" size="sm" className="mt-4">
                Browse Files
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImport(false)}>
              Cancel
            </Button>
            <Button disabled>
              <ArrowRight className="mr-2 h-4 w-4" />
              Next Step
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
