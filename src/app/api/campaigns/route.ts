import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const businessId = (session.user as any).businessId;

  try {
    const campaigns = await prisma.campaign.findMany({
      where: { businessId },
      include: {
        steps: { orderBy: { stepNumber: "asc" } },
        _count: { select: { messages: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Failed to fetch campaigns:", error);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}
