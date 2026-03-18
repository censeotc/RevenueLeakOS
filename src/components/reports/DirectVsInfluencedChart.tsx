"use client";

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Direct", value: 8200, color: "#3B82F6" },
  { name: "Influenced", value: 4640, color: "#8B5CF6" },
];

export function DirectVsInfluencedChart() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Direct vs Influenced Revenue</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            formatter={(value) => <span style={{ color: "#64748B" }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
