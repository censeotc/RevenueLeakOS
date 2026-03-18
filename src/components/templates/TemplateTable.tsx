import { DataTable } from "@/components/shared/DataTable";
import type { TemplateRecord } from "@/types/revenue";

export function TemplateTable({ templates }: { templates: TemplateRecord[] }) {
  return <DataTable title="Templates" description="Reusable outbound scripts for every workflow." columns={["Name", "Channel", "Status", "Variables"]} rows={templates.map((template) => [template.name, template.channel.toUpperCase(), template.status, template.variables.join(', ')])} />;
}
