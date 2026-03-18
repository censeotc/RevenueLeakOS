"use client";

import { useMemo, useState } from "react";
import { differenceInDays } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { currency } from "@/lib/utils";

type EstimateRow = {
  id: string;
  contactName: string;
  amount: number;
  serviceType: string;
  status: "open" | "stale" | "responded" | "booked" | "lost";
  sentAt: string;
};

export function EstimatesModule({ rows, staleThresholdDays }: { rows: EstimateRow[]; staleThresholdDays: number }) {
  const [statusFilter, setStatusFilter] = useState<EstimateRow["status"] | "all">("stale");
  const [message, setMessage] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      rows.filter((row) =>
        statusFilter === "all" ? true : row.status === statusFilter,
      ),
    [rows, statusFilter],
  );

  async function enroll(estimateId: string) {
    const response = await fetch("/api/workflows/estimate-rescue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estimateId }),
    });
    setMessage(response.ok ? "Estimate enrolled in follow-up." : "Could not enroll estimate.");
  }

  async function updateStatus(estimateId: string, status: EstimateRow["status"]) {
    const response = await fetch(`/api/estimates/${estimateId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setMessage(response.ok ? "Estimate status updated." : "Could not update estimate status.");
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Stale estimate recovery</CardTitle>
        <Select
          className="w-44"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
        >
          <option value="all">All statuses</option>
          <option value="stale">Stale</option>
          <option value="open">Open</option>
          <option value="responded">Responded</option>
          <option value="booked">Booked</option>
          <option value="lost">Lost</option>
        </Select>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Service type</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Controls</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((estimate) => {
              const age = differenceInDays(new Date(), new Date(estimate.sentAt));
              const stale = age >= staleThresholdDays;
              return (
                <TableRow key={estimate.id}>
                  <TableCell>{estimate.contactName}</TableCell>
                  <TableCell>{currency(estimate.amount)}</TableCell>
                  <TableCell>{estimate.serviceType}</TableCell>
                  <TableCell>
                    {age} days {stale ? <Badge variant="warning">stale</Badge> : null}
                  </TableCell>
                  <TableCell>
                    <Badge>{estimate.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => enroll(estimate.id)}>
                        Enroll in follow-up
                      </Button>
                      <Select
                        className="h-8 w-[130px]"
                        value={estimate.status}
                        onChange={(event) =>
                          updateStatus(
                            estimate.id,
                            event.target.value as EstimateRow["status"],
                          )
                        }
                      >
                        <option value="open">open</option>
                        <option value="stale">stale</option>
                        <option value="responded">responded</option>
                        <option value="booked">booked</option>
                        <option value="lost">lost</option>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {message ? <p className="mt-3 text-sm text-slate-600">{message}</p> : null}
      </CardContent>
    </Card>
  );
}
