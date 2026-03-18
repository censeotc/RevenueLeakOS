import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const limit = parseInt(searchParams.get("limit") ?? "50", 10);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const [opportunities, total] = await Promise.all([
      prisma.opportunity.findMany({
        where,
        include: {
          contact: true,
          estimate: true,
          notes: { orderBy: { createdAt: "desc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.opportunity.count({ where }),
    ]);

    return NextResponse.json({ opportunities, total, limit, offset });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch opportunities" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, ...rest } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const opportunity = await prisma.opportunity.update({
      where: { id },
      data: { status, ...rest, updatedAt: new Date() },
    });

    return NextResponse.json(opportunity);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update opportunity" }, { status: 500 });
  }
}
