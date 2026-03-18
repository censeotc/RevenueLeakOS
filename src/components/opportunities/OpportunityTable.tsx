"use client";

import type { OpportunityRow } from "@/types/revenue";
import { formatCurrency, formatRelativeDate } from "@/lib/formatters";
import { OpportunityStatusBadge } from "./OpportunityStatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OpportunityTableProps {
  opportunities: OpportunityRow[];
  onSelect?: (id: string) => void;
}

export function OpportunityTable({ opportunities, onSelect }: OpportunityTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Contact</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Value</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {opportunities.map((opp) => (
          <TableRow
            key={opp.id}
            className="cursor-pointer"
            onClick={() => onSelect?.(opp.id)}
          >
            <TableCell className="font-medium">{opp.contactName}</TableCell>
            <TableCell className="capitalize">{opp.type.replace(/_/g, " ").toLowerCase()}</TableCell>
            <TableCell><OpportunityStatusBadge status={opp.status} /></TableCell>
            <TableCell className="text-right">{formatCurrency(opp.value)}</TableCell>
            <TableCell>{formatRelativeDate(opp.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
