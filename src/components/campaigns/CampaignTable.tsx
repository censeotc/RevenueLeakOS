"use client";

import type { CampaignRow } from "@/types/revenue";
import { formatRelativeDate } from "@/lib/formatters";
import { CampaignStatusBadge } from "./CampaignStatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CampaignTableProps {
  campaigns: CampaignRow[];
  onSelect?: (id: string) => void;
}

export function CampaignTable({ campaigns, onSelect }: CampaignTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Steps</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((campaign) => (
          <TableRow
            key={campaign.id}
            className="cursor-pointer"
            onClick={() => onSelect?.(campaign.id)}
          >
            <TableCell className="font-medium">{campaign.name}</TableCell>
            <TableCell className="capitalize">{campaign.type.replace(/_/g, " ").toLowerCase()}</TableCell>
            <TableCell><CampaignStatusBadge status={campaign.status} /></TableCell>
            <TableCell className="text-right">{campaign.stepsCount}</TableCell>
            <TableCell>{formatRelativeDate(campaign.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
