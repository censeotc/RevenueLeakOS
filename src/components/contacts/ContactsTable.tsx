"use client";

import type { ContactRow } from "@/types/revenue";
import { ContactTags } from "./ContactTags";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ContactsTableProps {
  contacts: ContactRow[];
  onSelect?: (id: string) => void;
}

export function ContactsTable({ contacts, onSelect }: ContactsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead>Source</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => (
          <TableRow
            key={contact.id}
            className="cursor-pointer"
            onClick={() => onSelect?.(contact.id)}
          >
            <TableCell className="font-medium">{contact.firstName} {contact.lastName}</TableCell>
            <TableCell>{contact.email ?? "—"}</TableCell>
            <TableCell>{contact.phone ?? "—"}</TableCell>
            <TableCell><ContactTags tags={contact.tags} /></TableCell>
            <TableCell className="capitalize">{contact.source ?? "—"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
