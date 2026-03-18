"use client";

import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  opportunityStatuses,
  opportunityTypes,
} from "@/lib/domain/types";
import { currency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type OpportunityRow = {
  id: string;
  type: (typeof opportunityTypes)[number];
  status: (typeof opportunityStatuses)[number];
  title: string;
  serviceType: string | null;
  value: number | null;
  ownerId: string | null;
  ownerName: string | null;
  contactName: string;
  createdAt: string;
  notes: Array<{ id: string; body: string; userName: string; createdAt: string }>;
  activity: Array<{ id: string; summary: string; createdAt: string }>;
};

type Owner = { id: string; name: string };

export function OpportunitiesBoard({
  rows,
  owners,
}: {
  rows: OpportunityRow[];
  owners: Owner[];
}) {
  const [typeFilter, setTypeFilter] = useState<"all" | OpportunityRow["type"]>("all");
  const [selectedId, setSelectedId] = useState(rows[0]?.id ?? "");
  const [noteText, setNoteText] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const filteredRows = useMemo(
    () => rows.filter((row) => (typeFilter === "all" ? true : row.type === typeFilter)),
    [rows, typeFilter],
  );

  const selected = filteredRows.find((row) => row.id === selectedId) ?? filteredRows[0];

  const columns = useMemo<ColumnDef<OpportunityRow>[]>(
    () => [
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <Badge>{row.original.status}</Badge>,
      },
      {
        accessorKey: "title",
        header: "Opportunity",
        cell: ({ row }) => (
          <button
            className="text-left text-sm font-medium text-slate-900 underline-offset-2 hover:underline"
            onClick={() => setSelectedId(row.original.id)}
            type="button"
          >
            {row.original.title}
          </button>
        ),
      },
      { accessorKey: "contactName", header: "Contact" },
      { accessorKey: "ownerName", header: "Owner" },
      {
        accessorKey: "serviceType",
        header: "Service",
      },
      {
        accessorKey: "value",
        header: "Value",
        cell: ({ row }) => (row.original.value ? currency(row.original.value) : "—"),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filteredRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  async function updateStatus(status: OpportunityRow["status"]) {
    if (!selected) return;
    const response = await fetch(`/api/opportunities/${selected.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setStatusMessage(response.ok ? "Status updated." : "Could not update status.");
  }

  async function updateOwner(ownerId: string) {
    if (!selected) return;
    const response = await fetch(`/api/opportunities/${selected.id}/assign`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ownerId }),
    });
    setStatusMessage(response.ok ? "Owner updated." : "Could not update owner.");
  }

  async function addNote() {
    if (!selected || !noteText.trim()) return;
    const response = await fetch(`/api/opportunities/${selected.id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: noteText }),
    });
    if (response.ok) {
      setNoteText("");
      setStatusMessage("Note added. Refresh to view newest timeline.");
    } else {
      setStatusMessage("Could not add note.");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-5">
      <Card className="xl:col-span-3">
        <CardHeader>
          <CardTitle>Opportunity inbox</CardTitle>
          <Tabs value={typeFilter} onValueChange={(value) => setTypeFilter(value as typeof typeFilter)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="missed_call">Missed Call</TabsTrigger>
              <TabsTrigger value="estimate_rescue">Estimate Rescue</TabsTrigger>
              <TabsTrigger value="reactivation">Reactivation</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={row.original.id === selected?.id ? "bg-slate-100" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>{selected?.title ?? "Select an opportunity"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selected ? (
            <>
              <div className="grid gap-2">
                <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
                <Select
                  defaultValue={selected.status}
                  onChange={(event) => updateStatus(event.target.value as OpportunityRow["status"])}
                >
                  {opportunityStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="grid gap-2">
                <p className="text-xs uppercase tracking-wide text-slate-500">Assigned owner</p>
                <Select
                  defaultValue={selected.ownerId ?? ""}
                  onChange={(event) => updateOwner(event.target.value)}
                >
                  <option value="">Unassigned</option>
                  {owners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Notes</p>
                <Textarea
                  className="mt-2"
                  placeholder="Add context about next step..."
                  value={noteText}
                  onChange={(event) => setNoteText(event.target.value)}
                />
                <Button className="mt-2" onClick={addNote}>
                  Add note
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-slate-500">Activity timeline</p>
                {selected.activity.map((event) => (
                  <div key={event.id} className="rounded-md border border-slate-200 p-2">
                    <p className="text-sm text-slate-800">{event.summary}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(event.createdAt).toLocaleString("en-US")}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500">No opportunities match this filter.</p>
          )}
          {statusMessage ? <p className="text-xs text-slate-600">{statusMessage}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
