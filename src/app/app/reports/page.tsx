"use client";

import { useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  PieChart as PieChartIcon,
  Clock,
  Download,
  BarChart3,
  Target,
  ArrowRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layout/page-header";
import {
  DEMO_WORKFLOW_PERFORMANCE,
  DEMO_RECOVERY_TREND,
  DEMO_OPPORTUNITIES,
} from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

const WORKFLOW_COLORS = ["#3b82f6", "#8b5cf6", "#10b981"];

const FUNNEL_STAGES = [
  { key: "new", label: "New", color: "bg-slate-500" },
  { key: "attempted", label: "Attempted", color: "bg-blue-500" },
  { key: "responded", label: "Responded", color: "bg-violet-500" },
  { key: "qualified", label: "Qualified", color: "bg-amber-500" },
  { key: "booked", label: "Booked", color: "bg-emerald-500" },
] as const;

export default function ReportsPage() {
  const totalRevenue = useMemo(
    () => DEMO_WORKFLOW_PERFORMANCE.reduce((sum, w) => sum + w.revenue, 0),
    []
  );

  const directRevenue = useMemo(() => {
    return DEMO_OPPORTUNITIES.filter((o) => o.attribution === "direct")
      .reduce((sum, o) => sum + (o.actualValue ?? 0), 0);
  }, []);

  const influencedRevenue = useMemo(() => {
    return DEMO_OPPORTUNITIES.filter((o) => o.attribution === "influenced")
      .reduce((sum, o) => sum + (o.actualValue ?? 0), 0);
  }, []);

  const totalOpportunities = useMemo(
    () => DEMO_WORKFLOW_PERFORMANCE.reduce((sum, w) => sum + w.opportunities, 0),
    []
  );

  const totalRecovered = useMemo(
    () => DEMO_WORKFLOW_PERFORMANCE.reduce((sum, w) => sum + w.recovered, 0),
    []
  );

  const recoveryRate = totalOpportunities > 0
    ? ((totalRecovered / totalOpportunities) * 100).toFixed(1)
    : "0";

  const trendWithTotal = useMemo(
    () =>
      DEMO_RECOVERY_TREND.map((d) => ({
        ...d,
        total: d.missedCall + d.estimateRescue + d.reactivation,
      })),
    []
  );

  const workflowTableData = useMemo(
    () =>
      DEMO_WORKFLOW_PERFORMANCE.map((w) => ({
        ...w,
        conversionRate: w.opportunities > 0
          ? ((w.recovered / w.opportunities) * 100).toFixed(1)
          : "0",
        avgResponseTime:
          w.workflow === "Missed Call Recovery"
            ? "3.8 min"
            : w.workflow === "Estimate Rescue"
              ? "5.2 min"
              : "6.1 min",
      })),
    []
  );

  const responseTimeData = useMemo(
    () => [
      { workflow: "Missed Call", target: 5, actual: 3.8 },
      { workflow: "Estimate Rescue", target: 10, actual: 5.2 },
      { workflow: "Reactivation", target: 15, actual: 6.1 },
    ],
    []
  );

  const avgResponseTime = useMemo(() => {
    const times = responseTimeData.map((d) => d.actual);
    return (times.reduce((a, b) => a + b, 0) / times.length).toFixed(1);
  }, [responseTimeData]);

  const funnelData = useMemo(() => {
    const counts: Record<string, number> = {};
    const statuses = ["new", "attempted", "responded", "qualified", "booked"];
    for (const s of statuses) counts[s] = 0;
    for (const opp of DEMO_OPPORTUNITIES) {
      const idx = statuses.indexOf(opp.status);
      if (idx >= 0) {
        for (let i = 0; i <= idx; i++) {
          counts[statuses[i]]++;
        }
      }
    }
    if (counts["new"] === 0) counts["new"] = DEMO_OPPORTUNITIES.length;
    const total = counts["new"] || 1;
    return FUNNEL_STAGES.map((stage) => ({
      ...stage,
      count: counts[stage.key] || 0,
      percentage: ((counts[stage.key] || 0) / total * 100).toFixed(1),
    }));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Revenue recovery analytics and insights"
      >
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </PageHeader>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="response-time">Response Time</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Total Revenue Recovered
                    </p>
                    <p className="text-2xl font-bold tracking-tight">
                      {formatCurrency(totalRevenue)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Direct Revenue
                    </p>
                    <p className="text-2xl font-bold tracking-tight">
                      {formatCurrency(directRevenue)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Influenced Revenue
                    </p>
                    <p className="text-2xl font-bold tracking-tight">
                      {formatCurrency(influencedRevenue)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <PieChartIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Recovery Rate
                    </p>
                    <p className="text-2xl font-bold tracking-tight">
                      {recoveryRate}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Revenue Recovery Trend (14 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendWithTotal}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v: string) => v.slice(5)}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="missedCall"
                      name="Missed Call"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="estimateRescue"
                      name="Estimate Rescue"
                      stackId="1"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="reactivation"
                      name="Reactivation"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Revenue by Workflow Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DEMO_WORKFLOW_PERFORMANCE} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v: number) =>
                        `$${(v / 1000).toFixed(0)}k`
                      }
                    />
                    <YAxis
                      dataKey="workflow"
                      type="category"
                      tick={{ fontSize: 12 }}
                      width={150}
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Bar dataKey="revenue" name="Revenue" radius={[0, 4, 4, 0]}>
                      {DEMO_WORKFLOW_PERFORMANCE.map((_, idx) => (
                        <Cell key={idx} fill={WORKFLOW_COLORS[idx % WORKFLOW_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflows Tab */}
        <TabsContent value="workflows" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Workflow Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workflow</TableHead>
                    <TableHead className="text-right">Opportunities</TableHead>
                    <TableHead className="text-right">Recovered</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Conversion</TableHead>
                    <TableHead className="text-right">Avg Response</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workflowTableData.map((w) => (
                    <TableRow key={w.workflow}>
                      <TableCell className="font-medium">{w.workflow}</TableCell>
                      <TableCell className="text-right">{w.opportunities}</TableCell>
                      <TableCell className="text-right">{w.recovered}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(w.revenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={Number(w.conversionRate) >= 30 ? "success" : "warning"}>
                          {w.conversionRate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{w.avgResponseTime}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-semibold bg-muted/30">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">{totalOpportunities}</TableCell>
                    <TableCell className="text-right">{totalRecovered}</TableCell>
                    <TableCell className="text-right">{formatCurrency(totalRevenue)}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="info">{recoveryRate}%</Badge>
                    </TableCell>
                    <TableCell className="text-right">{avgResponseTime} min</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Response Time Tab */}
        <TabsContent value="response-time" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Avg Response Time
                    </p>
                    <p className="text-2xl font-bold tracking-tight">
                      {avgResponseTime} min
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Fastest Workflow
                    </p>
                    <p className="text-2xl font-bold tracking-tight">
                      3.8 min
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Missed Call Recovery
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      All Under Target
                    </p>
                    <p className="text-2xl font-bold tracking-tight text-emerald-600">
                      Yes
                    </p>
                    <p className="text-xs text-muted-foreground">
                      3/3 workflows meeting SLA
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Target vs Actual Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="workflow" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      label={{
                        value: "Minutes",
                        angle: -90,
                        position: "insideLeft",
                        style: { fontSize: 12 },
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="target"
                      name="Target"
                      fill="#94a3b8"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="actual"
                      name="Actual"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversion Tab */}
        <TabsContent value="conversion" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Conversion Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mx-auto max-w-2xl space-y-3 py-4">
                {funnelData.map((stage, idx) => {
                  const widthPct = 100 - idx * 15;
                  return (
                    <div key={stage.key} className="flex items-center gap-4">
                      <div className="w-24 text-right">
                        <p className="text-sm font-medium">{stage.label}</p>
                      </div>
                      <div className="flex-1">
                        <div
                          className={`${stage.color} rounded-md py-3 px-4 text-white text-sm font-medium flex items-center justify-between transition-all`}
                          style={{ width: `${widthPct}%` }}
                        >
                          <span>{stage.count} opportunities</span>
                          <span>{stage.percentage}%</span>
                        </div>
                      </div>
                      {idx < funnelData.length - 1 && (
                        <div className="w-8 flex justify-center text-muted-foreground">
                          <ArrowRight className="h-4 w-4 rotate-90" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 rounded-lg bg-muted/50 p-4">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">New → Attempted</p>
                    <p className="text-lg font-bold">
                      {funnelData[0].count > 0
                        ? ((funnelData[1].count / funnelData[0].count) * 100).toFixed(0)
                        : 0}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Attempted → Responded</p>
                    <p className="text-lg font-bold">
                      {funnelData[1].count > 0
                        ? ((funnelData[2].count / funnelData[1].count) * 100).toFixed(0)
                        : 0}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Responded → Qualified</p>
                    <p className="text-lg font-bold">
                      {funnelData[2].count > 0
                        ? ((funnelData[3].count / funnelData[2].count) * 100).toFixed(0)
                        : 0}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Qualified → Booked</p>
                    <p className="text-lg font-bold">
                      {funnelData[3].count > 0
                        ? ((funnelData[4].count / funnelData[3].count) * 100).toFixed(0)
                        : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
