import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { integrationProviders } from "@/lib/domain/types";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const provider = String(body.provider ?? "");
  const action = String(body.action ?? "");
  if (!integrationProviders.includes(provider as (typeof integrationProviders)[number])) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }

  const existing = await prisma.integrationConnection.findUnique({
    where: {
      businessId_provider: {
        businessId: session.user.businessId,
        provider: provider as (typeof integrationProviders)[number],
      },
    },
  });

  if (!existing) {
    return NextResponse.json({ error: "Connection not found" }, { status: 404 });
  }

  if (action === "connect") {
    await prisma.integrationConnection.update({
      where: { id: existing.id },
      data: { status: "connected", connectedAt: new Date(), errorMessage: null },
    });
  } else if (action === "disconnect") {
    await prisma.integrationConnection.update({
      where: { id: existing.id },
      data: { status: "disconnected", errorMessage: null },
    });
  } else if (action === "test") {
    await prisma.integrationConnection.update({
      where: { id: existing.id },
      data: {
        lastTestAt: new Date(),
        lastSyncAt: new Date(),
      },
    });
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
