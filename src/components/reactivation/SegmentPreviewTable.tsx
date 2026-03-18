import type { ContactRow } from "@/types/revenue";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SegmentPreviewTableProps {
  contacts: ContactRow[];
}

export function SegmentPreviewTable({ contacts }: SegmentPreviewTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Last Job</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => (
          <TableRow key={contact.id}>
            <TableCell className="font-medium">{contact.firstName} {contact.lastName}</TableCell>
            <TableCell>{contact.email ?? "—"}</TableCell>
            <TableCell>{contact.phone ?? "—"}</TableCell>
            <TableCell>{contact.lastJobAt ? new Date(contact.lastJobAt).toLocaleDateString() : "—"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
