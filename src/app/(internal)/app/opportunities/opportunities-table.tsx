"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";

import { StatusBadge } from "@/components/app-shell/status-badge";
import { DataTable } from "@/components/tables/data-table";
import type { OpportunityWithRelations } from "@/lib/domain/types";
import { formatCurrency } from "@/lib/utils";

type OpportunityRow = OpportunityWithRelations;

export function OpportunitiesTable({
  data,
  currentType,
}: {
  data: OpportunityRow[];
  currentType: string;
}) {
  const columns: ColumnDef<OpportunityRow>[] = [
    {
      accessorKey: "title",
      header: "Opportunity",
      cell: ({ row }) => (
        <div>
          <Link
            href={`/app/opportunities?type=${currentType}&id=${row.original.id}`}
            className="font-medium text-slate-900 hover:text-sky-700"
          >
            {row.original.title}
          </Link>
          <p className="text-xs text-slate-500">{row.original.type.replace(/_/g, " ")}</p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge value={row.original.status} />,
    },
    {
      accessorKey: "owner",
      header: "Owner",
      cell: ({ row }) => row.original.owner?.name ?? "Unassigned",
    },
    {
      accessorKey: "contact",
      header: "Contact",
      cell: ({ row }) => (
        <div>
          <div>{`${row.original.contact.firstName} ${row.original.contact.lastName}`}</div>
          <div className="text-xs text-slate-500">{row.original.contact.phone}</div>
        </div>
      ),
    },
    {
      accessorKey: "serviceType",
      header: "Service type",
    },
    {
      accessorKey: "value",
      header: "Value",
      cell: ({ row }) => formatCurrency(row.original.value),
    },
  ];

  return <DataTable columns={columns} data={data} />;
}
