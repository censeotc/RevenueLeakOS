const rows = [
  { workflow: "Missed Call Text-Back", sent: 48, replied: 19, converted: 12, rate: "25%", revenue: "$28,800" },
  { workflow: "Estimate Follow-Up", sent: 62, replied: 24, converted: 17, rate: "27%", revenue: "$51,000" },
  { workflow: "Reactivation Campaign", sent: 124, replied: 38, converted: 26, rate: "21%", revenue: "$31,200" },
  { workflow: "Win-Back Sequence", sent: 89, replied: 21, converted: 13, rate: "15%", revenue: "$15,600" },
];

export function ConversionSummaryTable() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900">Conversion Summary (Last 90 Days)</h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Workflow</th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Sent</th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Replied</th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Converted</th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Conv. Rate</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Revenue</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {rows.map((row) => (
            <tr key={row.workflow} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 font-medium text-slate-900">{row.workflow}</td>
              <td className="px-4 py-3 text-center text-slate-600">{row.sent}</td>
              <td className="px-4 py-3 text-center text-slate-600">{row.replied}</td>
              <td className="px-4 py-3 text-center font-medium text-slate-900">{row.converted}</td>
              <td className="px-4 py-3 text-center">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  {row.rate}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-semibold text-slate-900">{row.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
