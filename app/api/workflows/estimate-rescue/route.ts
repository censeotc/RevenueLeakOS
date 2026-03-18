import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { campaignService } from "@/lib/services/campaignService";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const estimateId = String(body.estimateId ?? "");
  if (!estimateId) {
    return NextResponse.json({ error: "estimateId is required" }, { status: 400 });
  }

  const opportunity = await campaignService.enrollStaleEstimate({
    businessId: session.user.businessId,
    estimateId,
  });

  await prisma.activityLog.create({
    data: {
      businessId: session.user.businessId,
      opportunityId: opportunity.id,
      contactId: opportunity.contactId,
      eventType: "estimate_enrolled",
      summary: "Estimate enrolled in rescue workflow.",
    },
  });

  return NextResponse.json({ ok: true, opportunityId: opportunity.id });
}
