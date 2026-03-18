import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get("businessId");
  const period = searchParams.get("period") ?? "30d";

  if (!businessId) {
    return NextResponse.json({ error: "businessId is required" }, { status: 400 });
  }

  try {
    const { PrismaClient, OpportunityStatus } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [wonOpportunities, openOpportunities, totalOpportunities, estimatesCount] = await Promise.all([
      prisma.opportunity.findMany({
        where: { businessId, status: OpportunityStatus.WON, recoveredAt: { gte: since } },
        select: { value: true, type: true, recoveredAt: true },
      }),
      prisma.opportunity.count({
        where: { businessId, status: OpportunityStatus.OPEN },
      }),
      prisma.opportunity.count({
        where: { businessId, createdAt: { gte: since } },
      }),
      prisma.estimate.count({
        where: { businessId, createdAt: { gte: since } },
      }),
    ]);

    const revenueRecovered = wonOpportunities.reduce((sum, o) => sum + o.value, 0);

    return NextResponse.json({
      revenueRecovered,
      openOpportunities,
      totalOpportunities,
      estimatesCount,
      wonCount: wonOpportunities.length,
      period,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
