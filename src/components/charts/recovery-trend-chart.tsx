"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "@/lib/utils";

type RecoveryTrendChartProps = {
  data: Array<{
    date: string;
    direct: number;
    influenced: number;
    opportunities: number;
  }>;
};

export function RecoveryTrendChart({ data }: RecoveryTrendChartProps) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(value) => formatCurrency(value)} />
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Legend />
          <Area type="monotone" dataKey="direct" stackId="1" stroke="#0284c7" fill="#7dd3fc" />
          <Area type="monotone" dataKey="influenced" stackId="1" stroke="#0f172a" fill="#94a3b8" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
