"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RecoveryTrendPoint } from "@/lib/domain/types";
import { currency } from "@/lib/utils";

export function RecoveryTrendChart({ data }: { data: RecoveryTrendPoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip
            formatter={(value) => currency(Number(value ?? 0))}
            contentStyle={{ borderRadius: 12, borderColor: "#cbd5e1" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="recoveredRevenue"
            name="Recovered Revenue"
            stroke="#0f172a"
            strokeWidth={3}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="influencedRevenue"
            name="Influenced Revenue"
            stroke="#0284c7"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
