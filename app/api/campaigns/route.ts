import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { campaignTypes } from "@/lib/domain/types";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const type = String(body.type ?? "");
  if (!name) {
    return NextResponse.json({ error: "Campaign name is required" }, { status: 400 });
  }
  if (!campaignTypes.includes(type as (typeof campaignTypes)[number])) {
    return NextResponse.json({ error: "Invalid campaign type" }, { status: 400 });
  }

  const campaign = await prisma.campaign.create({
    data: {
      businessId: session.user.businessId,
      createdById: session.user.id,
      name,
      type: type as (typeof campaignTypes)[number],
      status: "draft",
      targetSegment: String(body.targetSegment ?? "custom"),
      steps: {
        create: [
          {
            orderIndex: 1,
            channel: "sms",
            delayHours: 0,
            stopOnReply: true,
            stopOnBooking: true,
          },
        ],
      },
    },
  });

  return NextResponse.json({ ok: true, campaignId: campaign.id });
}
