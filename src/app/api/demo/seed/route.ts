import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const key = request.headers.get("x-demo-seed-key");

  if (key !== process.env.DEMO_SEED_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Dynamically import to avoid loading Prisma at build time
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const business = await prisma.business.findFirst({ where: { isDemo: true } });

    if (business) {
      return NextResponse.json({
        message: "Demo data already seeded",
        businessId: business.id,
      });
    }

    return NextResponse.json({
      message: "Run `npm run db:seed` to seed demo data",
    });
  } catch (error) {
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
