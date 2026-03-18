import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ConversionRow {
  workflow: string;
  sent: number;
  converted: number;
  rate: number;
}

interface ConversionSummaryTableProps {
  rows: ConversionRow[];
}

export function ConversionSummaryTable({ rows }: ConversionSummaryTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Workflow</TableHead>
          <TableHead className="text-right">Sent</TableHead>
          <TableHead className="text-right">Converted</TableHead>
          <TableHead className="text-right">Rate</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.workflow}>
            <TableCell className="font-medium">{row.workflow}</TableCell>
            <TableCell className="text-right">{row.sent}</TableCell>
            <TableCell className="text-right">{row.converted}</TableCell>
            <TableCell className="text-right">{row.rate.toFixed(1)}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
