"use client";

import type { EstimateRow } from "@/types/revenue";
import { formatCurrency, formatRelativeDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface EstimatesTableProps {
  estimates: EstimateRow[];
  onSelect?: (id: string) => void;
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  APPROVED: "default",
  DECLINED: "destructive",
  EXPIRED: "secondary",
  FOLLOW_UP: "default",
};

export function EstimatesTable({ estimates, onSelect }: EstimatesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Number</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Issued</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {estimates.map((est) => (
          <TableRow
            key={est.id}
            className="cursor-pointer"
            onClick={() => onSelect?.(est.id)}
          >
            <TableCell className="font-medium">{est.number}</TableCell>
            <TableCell>{est.contactName}</TableCell>
            <TableCell>
              <Badge variant={statusVariant[est.status] ?? "outline"}>{est.status}</Badge>
            </TableCell>
            <TableCell className="text-right">{formatCurrency(est.amount)}</TableCell>
            <TableCell>{formatRelativeDate(est.issuedAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
