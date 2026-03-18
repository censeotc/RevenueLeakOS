"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Missed Call", recovered: 4200, rate: 34 },
  { name: "Est. Follow-up", recovered: 5100, rate: 28 },
  { name: "Reactivation", recovered: 2200, rate: 21 },
  { name: "Win-Back", recovered: 1340, rate: 15 },
];

export function WorkflowComparison() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Revenue by Workflow</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, "Recovered"]}
          />
          <Bar dataKey="recovered" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
