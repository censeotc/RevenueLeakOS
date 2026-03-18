"use client";

import { useState, useMemo } from "react";
import {
  FileText,
  DollarSign,
  Clock,
  AlertTriangle,
  Send,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate, daysAgo } from "@/lib/utils";
import {
  DEMO_ESTIMATES,
  DEMO_CONTACTS,
  type DemoEstimate,
} from "@/lib/demo-data";

type EstimateFilter = "all" | "open" | "stale" | "responded" | "booked" | "lost";

const statusConfig: Record<
  string,
  { label: string; variant: "info" | "warning" | "success" | "destructive" | "default" }
> = {
  open: { label: "Open", variant: "info" },
  stale: { label: "Stale", variant: "warning" },
  responded: { label: "Responded", variant: "success" },
  booked: { label: "Booked", variant: "success" },
  lost: { label: "Lost", variant: "destructive" },
};

function getContactName(contactId: string): string {
  const contact = DEMO_CONTACTS.find((c) => c.id === contactId);
  return contact ? `${contact.firstName} ${contact.lastName}` : "Unknown";
}

export default function EstimatesPage() {
  const [statusFilter, setStatusFilter] = useState<EstimateFilter>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [estimateStatuses, setEstimateStatuses] = useState<Record<string, string>>({});
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [enrollTarget, setEnrollTarget] = useState<DemoEstimate | null>(null);

  const serviceTypes = useMemo(() => {
    const types = new Set(DEMO_ESTIMATES.map((e) => e.serviceType));
    return Array.from(types).sort();
  }, []);

  function getStatus(est: DemoEstimate): string {
    return estimateStatuses[est.id] ?? est.status;
  }

  const filteredEstimates = useMemo(() => {
    return DEMO_ESTIMATES.filter((est) => {
      const status = getStatus(est);
      if (statusFilter !== "all" && status !== statusFilter) return false;
      if (serviceFilter !== "all" && est.serviceType !== serviceFilter) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, serviceFilter, estimateStatuses]);

  const staleEstimates = DEMO_ESTIMATES.filter((e) => getStatus(e) === "stale");
  const totalEstimates = DEMO_ESTIMATES.length;
  const staleCount = staleEstimates.length;
  const staleValue = staleEstimates.reduce((sum, e) => sum + e.amount, 0);
  const avgStaleAge =
    staleCount > 0
      ? Math.round(
          staleEstimates.reduce((sum, e) => sum + daysAgo(e.sentAt), 0) / staleCount
        )
      : 0;

  function handleStatusChange(estimateId: string, newStatus: string) {
    setEstimateStatuses((prev) => ({ ...prev, [estimateId]: newStatus }));
  }

  function openEnrollDialog(est: DemoEstimate) {
    setEnrollTarget(est);
    setEnrollDialogOpen(true);
  }

  function confirmEnroll() {
    if (enrollTarget) {
      handleStatusChange(enrollTarget.id, "responded");
    }
    setEnrollDialogOpen(false);
    setEnrollTarget(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Estimates"
        description="Recover revenue from stale and aging estimates"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Estimates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalEstimates}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Stale Estimates</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">{staleCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Stale Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(staleValue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Stale Age</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{avgStaleAge} days</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as EstimateFilter)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="stale">Stale</SelectItem>
              <SelectItem value="responded">Responded</SelectItem>
              <SelectItem value="booked">Booked</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Service:</span>
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              {serviceTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Sent Date</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Stale Since</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEstimates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    No estimates match the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEstimates.map((est) => {
                  const currentStatus = getStatus(est);
                  const config = statusConfig[currentStatus] ?? statusConfig.open;
                  const age = daysAgo(est.sentAt);

                  return (
                    <TableRow key={est.id}>
                      <TableCell className="font-medium">{est.title}</TableCell>
                      <TableCell>{getContactName(est.contactId)}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(est.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </TableCell>
                      <TableCell>{est.serviceType}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(est.sentAt)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "font-medium",
                            age > 14 && "text-red-600",
                            age > 7 && age <= 14 && "text-amber-600"
                          )}
                        >
                          {age}d
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {est.staleSince ? formatDate(est.staleSince) : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {currentStatus === "stale" && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => openEnrollDialog(est)}
                            >
                              <Send className="mr-1.5 h-4 w-4" />
                              Enroll in Follow-up
                            </Button>
                          )}
                          <Select
                            value={currentStatus}
                            onValueChange={(v) => handleStatusChange(est.id, v)}
                          >
                            <SelectTrigger className="h-9 w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">Open</SelectItem>
                              <SelectItem value="stale">Stale</SelectItem>
                              <SelectItem value="responded">Responded</SelectItem>
                              <SelectItem value="booked">Booked</SelectItem>
                              <SelectItem value="lost">Lost</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Enroll in Follow-up
            </DialogTitle>
            <DialogDescription>
              This will add the estimate to the automated follow-up sequence.
            </DialogDescription>
          </DialogHeader>
          {enrollTarget && (
            <div className="space-y-3">
              <div className="rounded-lg border p-3">
                <p className="font-medium">{enrollTarget.title}</p>
                <p className="text-sm text-muted-foreground">
                  {getContactName(enrollTarget.contactId)} &middot;{" "}
                  {formatCurrency(enrollTarget.amount)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Stale for {enrollTarget.staleSince ? daysAgo(enrollTarget.staleSince) : 0} days
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                The customer will receive an SMS follow-up within 5 minutes, with a
                second reminder in 3 days if no response is received.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEnrollDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmEnroll}>
              <CheckCircle2 className="mr-1.5 h-4 w-4" />
              Confirm Enrollment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
