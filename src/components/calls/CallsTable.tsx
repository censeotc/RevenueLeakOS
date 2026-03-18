"use client";

import type { CallRow } from "@/types/revenue";
import { formatDuration, formatPhone, formatRelativeDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CallsTableProps {
  calls: CallRow[];
  onSelect?: (id: string) => void;
}

export function CallsTable({ calls, onSelect }: CallsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Direction</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {calls.map((call) => (
          <TableRow
            key={call.id}
            className="cursor-pointer"
            onClick={() => onSelect?.(call.id)}
          >
            <TableCell className="capitalize">{call.direction.toLowerCase()}</TableCell>
            <TableCell>{formatPhone(call.from)}</TableCell>
            <TableCell>{formatPhone(call.to)}</TableCell>
            <TableCell>
              <Badge variant={call.status === "MISSED" ? "destructive" : "secondary"}>
                {call.status}
              </Badge>
            </TableCell>
            <TableCell>{formatDuration(call.duration)}</TableCell>
            <TableCell>{call.contactName ?? "Unknown"}</TableCell>
            <TableCell>{formatRelativeDate(call.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
