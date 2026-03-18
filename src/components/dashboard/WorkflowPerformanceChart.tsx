"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { workflowPerformanceData } from "@/data/dashboardData";

export function WorkflowPerformanceChart() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Workflow Performance</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={workflowPerformanceData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="workflow" tick={{ fontSize: 11, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="sent" name="Sent" fill="#BFDBFE" radius={[4, 4, 0, 0]} />
          <Bar dataKey="converted" name="Converted" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
