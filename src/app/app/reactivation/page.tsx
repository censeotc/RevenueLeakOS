"use client";

import { useState, useMemo } from "react";
import {
  Users,
  DollarSign,
  Rocket,
  Target,
  Calendar,
  Tag,
  UserCheck,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { formatCurrency, formatDate, formatPhone, daysAgo } from "@/lib/utils";
import {
  DEMO_REACTIVATION_SEGMENTS,
  DEMO_CONTACTS,
} from "@/lib/demo-data";

const dormantContacts = DEMO_CONTACTS.filter((c) => c.status === "dormant");

const statusConfig: Record<string, { label: string; variant: "destructive" | "success" | "warning" | "default" | "info" | "secondary" }> = {
  active: { label: "Active", variant: "success" },
  dormant: { label: "Dormant", variant: "warning" },
  do_not_contact: { label: "Do Not Contact", variant: "destructive" },
};

export default function ReactivationPage() {
  const [selectedSegmentId, setSelectedSegmentId] = useState(
    DEMO_REACTIVATION_SEGMENTS[0]?.id ?? ""
  );
  const [launchDialogOpen, setLaunchDialogOpen] = useState(false);
  const [launchTarget, setLaunchTarget] = useState<string | null>(null);

  const selectedSegment = DEMO_REACTIVATION_SEGMENTS.find(
    (s) => s.id === selectedSegmentId
  );

  const previewContacts = useMemo(() => {
    return dormantContacts;
  }, []);

  const totalEstimatedValue = DEMO_REACTIVATION_SEGMENTS.reduce(
    (sum, s) => sum + s.estimatedValue,
    0
  );
  const totalContactCount = DEMO_REACTIVATION_SEGMENTS.reduce(
    (sum, s) => sum + s.contactCount,
    0
  );

  function handleLaunchCampaign(segmentId: string) {
    setLaunchTarget(segmentId);
    setLaunchDialogOpen(true);
  }

  function handleLaunchAll() {
    setLaunchTarget("all");
    setLaunchDialogOpen(true);
  }

  const launchSegment = launchTarget
    ? DEMO_REACTIVATION_SEGMENTS.find((s) => s.id === launchTarget)
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Reactivation"
        description="Re-engage dormant customers and recover lifetime value"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DEMO_REACTIVATION_SEGMENTS.map((segment) => (
          <Card
            key={segment.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              selectedSegmentId === segment.id && "ring-2 ring-primary"
            )}
            onClick={() => setSelectedSegmentId(segment.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{segment.name}</CardTitle>
              <CardDescription>{segment.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{segment.contactCount} contacts</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                  <DollarSign className="h-4 w-4" />
                  <span>{formatCurrency(segment.estimatedValue)}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-mono bg-muted/50 rounded px-2 py-1">
                {segment.criteria}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLaunchCampaign(segment.id);
                }}
              >
                <Rocket className="mr-1.5 h-4 w-4" />
                Launch Campaign
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Preview: {selectedSegment?.name ?? "Select a segment"}
              </CardTitle>
              <CardDescription className="mt-1">
                Dormant contacts that would match this segment
              </CardDescription>
            </div>
            {selectedSegment && (
              <Badge variant="info">
                {previewContacts.length} contacts shown
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Last Service Date</TableHead>
                <TableHead>Lifetime Value</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewContacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No dormant contacts found for this segment.
                  </TableCell>
                </TableRow>
              ) : (
                previewContacts.map((contact) => {
                  const config = statusConfig[contact.status] ?? {
                    label: contact.status,
                    variant: "default" as const,
                  };

                  return (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-muted-foreground" />
                          {contact.firstName} {contact.lastName}
                        </div>
                      </TableCell>
                      <TableCell>{formatPhone(contact.phone)}</TableCell>
                      <TableCell>
                        {contact.lastServiceAt ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{formatDate(contact.lastServiceAt)}</span>
                            <span className="text-muted-foreground">
                              ({daysAgo(contact.lastServiceAt)}d ago)
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(contact.lifetime_value)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {contact.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              <Tag className="mr-1 h-3 w-3" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-semibold">Reactivation Summary</h3>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm text-muted-foreground">
                  Total Estimated Value:{" "}
                  <span className="font-semibold text-foreground">
                    {formatCurrency(totalEstimatedValue)}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-muted-foreground">
                  Total Contacts:{" "}
                  <span className="font-semibold text-foreground">
                    {totalContactCount}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <Button size="lg" onClick={handleLaunchAll}>
            <Rocket className="mr-2 h-5 w-5" />
            Launch Reactivation Campaign
          </Button>
        </CardContent>
      </Card>

      <Dialog open={launchDialogOpen} onOpenChange={setLaunchDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              {launchTarget === "all"
                ? "Launch All Campaigns"
                : "Launch Campaign"}
            </DialogTitle>
            <DialogDescription>
              {launchTarget === "all"
                ? "This will launch reactivation campaigns for all segments."
                : `This will launch a campaign for the "${launchSegment?.name}" segment.`}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border p-4 space-y-2">
            {launchTarget === "all" ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Segments:</span>
                  <span className="font-medium">
                    {DEMO_REACTIVATION_SEGMENTS.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Contacts:</span>
                  <span className="font-medium">{totalContactCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Value:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(totalEstimatedValue)}
                  </span>
                </div>
              </>
            ) : launchSegment ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Segment:</span>
                  <span className="font-medium">{launchSegment.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Contacts:</span>
                  <span className="font-medium">{launchSegment.contactCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Value:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(launchSegment.estimatedValue)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Criteria:</span>
                  <span className="font-mono text-xs">{launchSegment.criteria}</span>
                </div>
              </>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLaunchDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setLaunchDialogOpen(false)}>
              <Rocket className="mr-1.5 h-4 w-4" />
              Confirm Launch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
