import { DataTable } from "@/components/shared/DataTable";
import type { ConversionSummary } from "@/types/revenue";

export function ConversionSummaryTable({ rows }: { rows: ConversionSummary[] }) {
  return <DataTable title="Conversion summary" description="Top-of-funnel movement by workflow." columns={["Workflow", "Leads", "Responses", "Bookings", "Win rate"]} rows={rows.map((row) => [row.workflow, String(row.leads), String(row.responses), String(row.bookings), `${row.winRate}%`])} />;
}
