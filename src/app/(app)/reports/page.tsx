"use client";

import { DollarSign, Target, Calendar, TrendingUp, Clock, BarChart2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const MONTHLY_DATA = [
  { month: "Jan", direct: 18200, influenced: 28400, bookings: 12 },
  { month: "Feb", direct: 21500, influenced: 34100, bookings: 16 },
  { month: "Mar", direct: 19800, influenced: 31200, bookings: 14 },
  { month: "Apr", direct: 32400, influenced: 51800, bookings: 22 },
  { month: "May", direct: 41200, influenced: 68400, bookings: 22 },
  { month: "Jun", direct: 48300, influenced: 74500, bookings: 28 },
];

const WORKFLOW_DATA = [
  { name: "Missed Call", opportunities: 42, booked: 11, revenue: 24800, convRate: 26.2 },
  { name: "Estimate Rescue", opportunities: 28, booked: 9, revenue: 31500, convRate: 32.1 },
  { name: "Reactivation", opportunities: 65, booked: 8, revenue: 18200, convRate: 12.3 },
];

const ATTRIBUTION_DATA = [
  { name: "Direct", value: 48300, color: "#3b82f6" },
  { name: "Influenced", value: 26200, color: "#8b5cf6" },
];

const RESPONSE_TIME_DATA = [
  { day: "Mon", avgMin: 3.8 },
  { day: "Tue", avgMin: 4.1 },
  { day: "Wed", avgMin: 3.5 },
  { day: "Thu", avgMin: 5.2 },
  { day: "Fri", avgMin: 4.8 },
  { day: "Sat", avgMin: 6.1 },
  { day: "Sun", avgMin: 7.4 },
];

export default function ReportsPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-500 text-sm mt-1">Revenue recovery performance — June 2025</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Revenue Influenced", value: "$74,500", change: "+8.9%", positive: true },
          { label: "Direct Revenue", value: "$48,300", change: "+17.2%", positive: true },
          { label: "Bookings", value: "28", change: "+27.3%", positive: true },
          { label: "Opportunities", value: "45", change: "+18.4%", positive: true },
          { label: "Avg Response", value: "4.2 min", change: "-10.6%", positive: true },
          { label: "Conv. Rate", value: "22.4%", change: "+3.1pp", positive: true },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <p className="text-xl font-bold text-slate-900">{kpi.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{kpi.label}</p>
              <p className={`text-xs font-medium mt-1 ${kpi.positive ? "text-green-600" : "text-red-600"}`}>
                {kpi.change} vs last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue trend */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Recovery Trend — 6 Months</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={MONTHLY_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="direct" fill="#3b82f6" name="Direct Revenue" radius={[3, 3, 0, 0]} />
              <Bar dataKey="influenced" fill="#dbeafe" name="Influenced Revenue" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Workflow comparison */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Workflow Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">Workflow</th>
                    <th className="text-right py-2 text-xs font-semibold text-slate-500 uppercase">Opps</th>
                    <th className="text-right py-2 text-xs font-semibold text-slate-500 uppercase">Booked</th>
                    <th className="text-right py-2 text-xs font-semibold text-slate-500 uppercase">Conv.</th>
                    <th className="text-right py-2 text-xs font-semibold text-slate-500 uppercase">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {WORKFLOW_DATA.map((row) => (
                    <tr key={row.name} className="border-b border-slate-100">
                      <td className="py-3 font-medium text-slate-800">{row.name}</td>
                      <td className="py-3 text-right text-slate-600">{row.opportunities}</td>
                      <td className="py-3 text-right text-slate-600">{row.booked}</td>
                      <td className="py-3 text-right">
                        <span className={`font-semibold ${row.convRate > 20 ? "text-green-600" : "text-slate-700"}`}>
                          {row.convRate}%
                        </span>
                      </td>
                      <td className="py-3 text-right font-semibold text-slate-900">{formatCurrency(row.revenue)}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50">
                    <td className="py-3 font-semibold text-slate-800">Total</td>
                    <td className="py-3 text-right font-semibold">135</td>
                    <td className="py-3 text-right font-semibold">28</td>
                    <td className="py-3 text-right font-semibold text-blue-600">20.7%</td>
                    <td className="py-3 text-right font-semibold text-slate-900">$74,500</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Attribution pie */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Attribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={ATTRIBUTION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {ATTRIBUTION_DATA.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {ATTRIBUTION_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-800">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Response time */}
      <Card>
        <CardHeader>
          <CardTitle>Average Response Time by Day of Week</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={RESPONSE_TIME_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} unit=" min" domain={[0, 10]} />
              <Tooltip formatter={(v: number) => [`${v} min`, "Avg Response"]} contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
              <Line type="monotone" dataKey="avgMin" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} name="Avg Response" />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-400 mt-2">Lower is better. Weekend response times are higher due to after-hours volume.</p>
        </CardContent>
      </Card>
    </div>
  );
}
