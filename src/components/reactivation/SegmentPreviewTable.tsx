import type { ContactPreview } from "@/types/revenue";

interface SegmentPreviewTableProps {
  contacts: ContactPreview[];
}

export function SegmentPreviewTable({ contacts }: SegmentPreviewTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Contact</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Last Job</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Lifetime Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {contacts.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3">
                <p className="font-medium text-slate-900">{c.name}</p>
                <p className="text-xs text-slate-400">{c.phone}</p>
              </td>
              <td className="px-4 py-3 text-slate-500 text-xs">{c.lastJobDate}</td>
              <td className="px-4 py-3 text-right font-medium text-slate-900">
                ${c.lifetimeValue?.toLocaleString() ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
