import { DataTable } from "@/components/shared/DataTable";
import type { CallRecord } from "@/types/revenue";

export function CallsTable({ calls }: { calls: CallRecord[] }) {
  return (
    <DataTable
      title="Calls"
      description="Recent inbound and outbound call activity linked to recovery workflows."
      columns={["Caller", "Disposition", "Direction", "Started", "Duration"]}
      rows={calls.map((call) => [
        <div key={`${call.id}-caller`}>
          <p className="font-medium text-slate-900">{call.caller}</p>
          <p className="text-xs text-slate-500">{call.phone}</p>
        </div>,
        call.disposition,
        call.direction,
        call.startTime,
        `${call.durationSeconds}s`,
      ])}
    />
  );
}
