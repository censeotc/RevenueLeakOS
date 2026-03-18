"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { CSVImportDialog } from "@/components/csv-import-dialog";
import { demoEstimates, getContactById } from "@/lib/demo-data";
import { formatCurrency, daysSince } from "@/lib/utils";
import { FileText, Clock, AlertTriangle, CheckCircle, Upload } from "lucide-react";

type StatusFilter = "all" | "stale" | "sent" | "viewed" | "follow_up" | "booked" | "expired";

export default function EstimatesPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [importOpen, setImportOpen] = useState(false);

  const filtered = statusFilter === "all"
    ? demoEstimates
    : demoEstimates.filter((e) => e.status === statusFilter);

  const staleCount = demoEstimates.filter((e) => e.status === "stale").length;
  const totalStaleValue = demoEstimates
    .filter((e) => e.status === "stale")
    .reduce((sum, e) => sum + e.amount, 0);

  const handleEnroll = (id: string) => {
    setEnrolledIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      <TopBar title="Estimates" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg p-2 bg-amber-50">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{staleCount}</p>
                  <p className="text-xs text-muted-foreground">Stale Estimates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg p-2 bg-red-50">
                  <Clock className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(totalStaleValue)}</p>
                  <p className="text-xs text-muted-foreground">At Risk Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg p-2 bg-blue-50">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{demoEstimates.length}</p>
                  <p className="text-xs text-muted-foreground">Total Estimates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg p-2 bg-green-50">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{demoEstimates.filter((e) => e.status === "booked").length}</p>
                  <p className="text-xs text-muted-foreground">Booked</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {(["all", "stale", "sent", "viewed", "follow_up", "booked", "expired"] as StatusFilter[]).map((s) => (
              <Button
                key={s}
                variant={statusFilter === s ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(s)}
              >
                {s === "all" ? "All" : s === "follow_up" ? "Follow Up" : s.charAt(0).toUpperCase() + s.slice(1)}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
            <Upload className="h-4 w-4 mr-1" />
            CSV Import
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Estimate #</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Contact</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Service</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Amount</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Age</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Follow-ups</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((est) => {
                  const contact = getContactById(est.contactId);
                  const age = daysSince(est.sentAt);
                  const enrolled = enrolledIds.has(est.id);
                  return (
                    <tr key={est.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{est.estimateNumber}</td>
                      <td className="px-4 py-3">
                        {contact ? `${contact.firstName} ${contact.lastName}` : "-"}
                        {contact?.phone && (
                          <div className="text-xs text-muted-foreground">{contact.phone}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div>{est.serviceType}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{est.description}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold">{formatCurrency(est.amount)}</td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${age > 7 ? "text-red-600" : age > 3 ? "text-amber-600" : "text-muted-foreground"}`}>
                          {age}d
                        </span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={est.status} /></td>
                      <td className="px-4 py-3 text-muted-foreground">{est.followUpCount || 0}</td>
                      <td className="px-4 py-3">
                        {(est.status === "stale" || est.status === "sent" || est.status === "viewed") && (
                          <Button
                            size="sm"
                            variant={enrolled ? "secondary" : "outline"}
                            onClick={() => handleEnroll(est.id)}
                          >
                            {enrolled ? "Enrolled" : "Enroll in Follow-Up"}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <CSVImportDialog type="estimates" open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}
