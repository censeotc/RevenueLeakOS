import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { estimateStatuses } from "@/lib/domain/types";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const status = String(body.status ?? "");
  if (!estimateStatuses.includes(status as (typeof estimateStatuses)[number])) {
    return NextResponse.json({ error: "Invalid estimate status" }, { status: 400 });
  }

  await prisma.estimate.update({
    where: { id },
    data: {
      status: status as (typeof estimateStatuses)[number],
      respondedAt: status === "responded" ? new Date() : undefined,
      bookedAt: status === "booked" ? new Date() : undefined,
      lostAt: status === "lost" ? new Date() : undefined,
    },
  });

  return NextResponse.json({ ok: true });
}
