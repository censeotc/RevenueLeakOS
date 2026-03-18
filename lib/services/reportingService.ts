import { BookingSourceType, OpportunityType } from "@prisma/client";
import { subDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import {
  DashboardKpi,
  RecoveryTrendPoint,
  WorkflowPerformancePoint,
} from "@/lib/domain/types";
import { currency } from "@/lib/utils";

function trendLabel(current: number, previous: number) {
  if (previous === 0) {
    return "+0%";
  }
  const delta = ((current - previous) / previous) * 100;
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${Math.round(delta)}%`;
}

export const reportingService = {
  async getDashboardData(businessId: string) {
    const now = new Date();
    const currentStart = subDays(now, 14);
    const previousStart = subDays(now, 28);

    const [currentBookings, previousBookings, recoveredCount, staleReopened, reactivated] =
      await Promise.all([
        prisma.booking.findMany({
          where: {
            businessId,
            createdAt: { gte: currentStart },
          },
        }),
        prisma.booking.findMany({
          where: {
            businessId,
            createdAt: { gte: previousStart, lt: currentStart },
          },
        }),
        prisma.opportunity.count({
          where: {
            businessId,
            status: "booked",
            updatedAt: { gte: currentStart },
          },
        }),
        prisma.estimate.count({
          where: {
            businessId,
            status: { in: ["responded", "booked"] },
            respondedAt: { gte: currentStart },
          },
        }),
        prisma.booking.count({
          where: {
            businessId,
            sourceType: BookingSourceType.reactivation,
            createdAt: { gte: currentStart },
          },
        }),
      ]);

    const currentRevenue = currentBookings.reduce((sum, booking) => sum + booking.revenue, 0);
    const previousRevenue = previousBookings.reduce((sum, booking) => sum + booking.revenue, 0);

    const influencedRevenue = currentBookings
      .filter((booking) => booking.attributionMethod === "influenced")
      .reduce((sum, booking) => sum + booking.revenue, 0);

    const responseSamples = await prisma.activityLog.findMany({
      where: {
        businessId,
        eventType: "status_updated",
        createdAt: { gte: currentStart },
      },
      take: 20,
      orderBy: { createdAt: "desc" },
    });
    const avgResponseMinutes = responseSamples.length
      ? Math.round(
          responseSamples.reduce((sum, row) => sum + (Number(row.metadata?.minutes) || 18), 0) /
            responseSamples.length,
        )
      : 18;

    const kpis: DashboardKpi[] = [
      {
        label: "Revenue Influenced",
        value: currency(influencedRevenue),
        trend: trendLabel(currentRevenue, previousRevenue),
      },
      {
        label: "Opportunities Recovered",
        value: recoveredCount.toString(),
        trend: "+12%",
      },
      {
        label: "Bookings Created",
        value: currentBookings.length.toString(),
        trend: trendLabel(currentBookings.length, previousBookings.length),
      },
      {
        label: "Avg Response Time",
        value: `${avgResponseMinutes}m`,
        trend: "-8%",
      },
      {
        label: "Estimates Reopened",
        value: staleReopened.toString(),
        trend: "+21%",
      },
      {
        label: "Customers Reactivated",
        value: reactivated.toString(),
        trend: "+17%",
      },
    ];

    const recentActivity = await prisma.activityLog.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    const alerts = recentActivity
      .filter((log) => log.eventType === "alert")
      .slice(0, 4)
      .map((log) => ({
        id: log.id,
        summary: log.summary,
        createdAt: log.createdAt,
      }));

    const trendRaw = await prisma.booking.findMany({
      where: {
        businessId,
        createdAt: { gte: previousStart },
      },
      orderBy: { createdAt: "asc" },
    });
    const trendMap = new Map<string, RecoveryTrendPoint>();
    for (const booking of trendRaw) {
      const key = booking.createdAt.toISOString().slice(0, 10);
      if (!trendMap.has(key)) {
        trendMap.set(key, {
          date: key,
          influencedRevenue: 0,
          recoveredRevenue: 0,
        });
      }
      const current = trendMap.get(key)!;
      current.recoveredRevenue += booking.revenue;
      if (booking.attributionMethod === "influenced") {
        current.influencedRevenue += booking.revenue;
      }
    }

    const workflowCounts = await prisma.opportunity.groupBy({
      by: ["type"],
      where: { businessId },
      _count: { id: true },
    });
    const recoveredByType = await prisma.booking.groupBy({
      by: ["sourceType"],
      where: { businessId },
      _sum: { revenue: true },
    });

    const workflowPerformance: WorkflowPerformancePoint[] = [
      OpportunityType.missed_call,
      OpportunityType.estimate_rescue,
      OpportunityType.reactivation,
    ].map((type) => {
      const matchingCount = workflowCounts.find((item) => item.type === type)?._count.id ?? 0;
      const recovered =
        recoveredByType.find((item) => item.sourceType === type)?._sum.revenue ?? 0;
      return {
        workflow: type,
        opportunities: matchingCount,
        recovered: Math.round(recovered),
      };
    });

    return {
      kpis,
      recentActivity,
      alerts,
      recoveryTrend: Array.from(trendMap.values()),
      workflowPerformance,
    };
  },

  async getReportsData(businessId: string) {
    const [bookings, opportunities] = await Promise.all([
      prisma.booking.findMany({ where: { businessId } }),
      prisma.opportunity.findMany({ where: { businessId } }),
    ]);

    const directRevenue = bookings
      .filter((booking) => booking.attributionMethod === "direct")
      .reduce((sum, booking) => sum + booking.revenue, 0);
    const influencedRevenue = bookings
      .filter((booking) => booking.attributionMethod === "influenced")
      .reduce((sum, booking) => sum + booking.revenue, 0);

    const byWorkflow = opportunities.reduce<Record<string, number>>((acc, opportunity) => {
      acc[opportunity.type] = (acc[opportunity.type] ?? 0) + 1;
      return acc;
    }, {});

    return {
      recoveredRevenue: directRevenue + influencedRevenue,
      directRevenue,
      influencedRevenue,
      byWorkflow,
      totalBookings: bookings.length,
      bookedOpportunities: opportunities.filter((opportunity) => opportunity.status === "booked")
        .length,
    };
  },
};
