import { db } from "@/lib/db";

export interface ReportPeriod {
  start: Date;
  end: Date;
  label: string;
}

export function getPeriodDates(period: "7d" | "30d" | "90d"): ReportPeriod {
  const end = new Date();
  const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;
  const start = new Date(end.getTime() - days * 86400000);
  return { start, end, label: period };
}

export async function getDashboardMetrics(businessId: string, period: "7d" | "30d" | "90d") {
  const { start } = getPeriodDates(period);

  const [wonOps, openCount, totalCount, estimateCount] = await Promise.all([
    db.opportunity.findMany({
      where: {
        businessId,
        status: "WON",
        recoveredAt: { gte: start },
      },
      select: { value: true, type: true, recoveredAt: true },
    }),
    db.opportunity.count({ where: { businessId, status: "OPEN" } }),
    db.opportunity.count({ where: { businessId, createdAt: { gte: start } } }),
    db.estimate.count({ where: { businessId, createdAt: { gte: start } } }),
  ]);

  const revenueRecovered = wonOps.reduce((sum, o) => sum + o.value, 0);

  const revenueByType = wonOps.reduce(
    (acc, o) => {
      acc[o.type] = (acc[o.type] ?? 0) + o.value;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    revenueRecovered,
    openCount,
    totalCount,
    estimateCount,
    wonCount: wonOps.length,
    revenueByType,
    period,
  };
}

export async function getConversionRates(businessId: string, period: "7d" | "30d" | "90d") {
  const { start } = getPeriodDates(period);

  const [total, won] = await Promise.all([
    db.opportunity.count({ where: { businessId, createdAt: { gte: start } } }),
    db.opportunity.count({ where: { businessId, status: "WON", createdAt: { gte: start } } }),
  ]);

  return {
    total,
    won,
    rate: total > 0 ? (won / total) * 100 : 0,
  };
}

export async function getWorkflowPerformance(businessId: string, period: "7d" | "30d" | "90d") {
  const { start } = getPeriodDates(period);

  const enrollments = await db.campaignEnrollment.findMany({
    where: {
      campaign: { businessId },
      createdAt: { gte: start },
    },
    include: { campaign: { select: { name: true, type: true } } },
  });

  const grouped = enrollments.reduce(
    (acc, e) => {
      const key = e.campaign.name;
      if (!acc[key]) acc[key] = { enrolled: 0, converted: 0 };
      acc[key].enrolled++;
      if (e.status === "CONVERTED") acc[key].converted++;
      return acc;
    },
    {} as Record<string, { enrolled: number; converted: number }>
  );

  return Object.entries(grouped).map(([name, stats]) => ({
    name,
    ...stats,
    conversionRate: stats.enrolled > 0 ? (stats.converted / stats.enrolled) * 100 : 0,
  }));
}
