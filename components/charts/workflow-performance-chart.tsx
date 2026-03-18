"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { WorkflowPerformancePoint } from "@/lib/domain/types";
import { currency } from "@/lib/utils";

export function WorkflowPerformanceChart({
  data,
}: {
  data: WorkflowPerformancePoint[];
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="workflow" stroke="#64748b" fontSize={12} />
          <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
          <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} />
          <Tooltip
            formatter={(value, name) =>
              name === "recovered"
                ? currency(Number(value ?? 0))
                : Number(value ?? 0).toLocaleString("en-US")
            }
            contentStyle={{ borderRadius: 12, borderColor: "#cbd5e1" }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="opportunities" fill="#475569" radius={[8, 8, 0, 0]} />
          <Bar yAxisId="right" dataKey="recovered" fill="#16a34a" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
