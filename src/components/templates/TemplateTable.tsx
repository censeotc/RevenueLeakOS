"use client";

import type { TemplateRow } from "@/types/revenue";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TemplateTableProps {
  templates: TemplateRow[];
  onSelect?: (id: string) => void;
}

export function TemplateTable({ templates, onSelect }: TemplateTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Channel</TableHead>
          <TableHead>Variables</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {templates.map((template) => (
          <TableRow
            key={template.id}
            className="cursor-pointer"
            onClick={() => onSelect?.(template.id)}
          >
            <TableCell className="font-medium">{template.name}</TableCell>
            <TableCell className="uppercase">{template.channel}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {template.variables.map((v) => (
                  <Badge key={v} variant="secondary" className="text-xs">
                    {`{{${v}}}`}
                  </Badge>
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
