"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type CallRow = {
  id: string;
  startedAt: string;
  fromNumber: string;
  intakeSummary: string | null;
  isMissed: boolean;
  isAfterHours: boolean;
  isAbandoned: boolean;
  opportunityStatus: string | null;
  contactName: string | null;
  smsPreview: string | null;
  hasBooking: boolean;
};

type CallTab = "missed" | "after-hours" | "abandoned" | "responded" | "booked" | "lost";

export function CallsModule({ rows }: { rows: CallRow[] }) {
  const [tab, setTab] = useState<CallTab>("missed");

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (tab === "missed") return row.isMissed;
      if (tab === "after-hours") return row.isAfterHours;
      if (tab === "abandoned") return row.isAbandoned;
      if (tab === "responded") return row.opportunityStatus === "responded";
      if (tab === "booked") return row.hasBooking || row.opportunityStatus === "booked";
      return row.opportunityStatus === "lost";
    });
  }, [rows, tab]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call events</CardTitle>
        <Tabs value={tab} onValueChange={(value) => setTab(value as CallTab)}>
          <TabsList className="flex h-auto flex-wrap gap-1 bg-transparent p-0">
            <TabsTrigger value="missed">Missed</TabsTrigger>
            <TabsTrigger value="after-hours">After-hours</TabsTrigger>
            <TabsTrigger value="abandoned">Abandoned</TabsTrigger>
            <TabsTrigger value="responded">Responded</TabsTrigger>
            <TabsTrigger value="booked">Booked</TabsTrigger>
            <TabsTrigger value="lost">Lost</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Caller</TableHead>
              <TableHead>Linked opportunity</TableHead>
              <TableHead>SMS preview</TableHead>
              <TableHead>Booking</TableHead>
              <TableHead>Intake summary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{new Date(row.startedAt).toLocaleString("en-US")}</TableCell>
                <TableCell>
                  <p className="font-medium text-slate-900">{row.contactName ?? "Unknown caller"}</p>
                  <p className="text-xs text-slate-500">{row.fromNumber}</p>
                </TableCell>
                <TableCell>
                  <Badge>{row.opportunityStatus ?? "unlinked"}</Badge>
                </TableCell>
                <TableCell className="max-w-xs text-xs text-slate-600">
                  {row.smsPreview ?? "No thread yet"}
                </TableCell>
                <TableCell>{row.hasBooking ? <Badge variant="success">Booked</Badge> : "—"}</TableCell>
                <TableCell className="max-w-sm text-xs text-slate-600">{row.intakeSummary}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
