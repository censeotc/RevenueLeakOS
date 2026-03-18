"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { formatCurrency } from "@/lib/utils";

type WorkflowPerformanceChartProps = {
  data: Array<{
    type: string;
    recoveredRevenue: number;
    bookings: number;
    conversionRate: number;
  }>;
};

export function WorkflowPerformanceChart({ data }: WorkflowPerformanceChartProps) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="type" tickFormatter={(value) => value.replace(/_/g, " ")} />
          <YAxis tickFormatter={(value) => formatCurrency(value)} />
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Bar dataKey="recoveredRevenue" fill="#0f172a" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
