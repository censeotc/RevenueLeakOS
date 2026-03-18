"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { recoveryTrendData } from "@/data/dashboardData";

export function RecoveryTrendChart() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Revenue Recovered (30 days)</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={recoveryTrendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="recoveredGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, "Recovered"]}
          />
          <Area type="monotone" dataKey="recovered" stroke="#3B82F6" strokeWidth={2} fill="url(#recoveredGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
