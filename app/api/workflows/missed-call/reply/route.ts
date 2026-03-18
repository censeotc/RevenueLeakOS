import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { twilioMockService } from "@/lib/services/twilioMockService";
import { opportunityService } from "@/lib/services/opportunityService";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const opportunityId = String(body.opportunityId ?? "");
  const reply = String(body.reply ?? "Yes, please call me this afternoon.");

  if (!opportunityId) {
    return NextResponse.json({ error: "opportunityId is required" }, { status: 400 });
  }

  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
  });

  if (!opportunity) {
    return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
  }

  await twilioMockService.simulateInboundReply({
    businessId: session.user.businessId,
    contactId: opportunity.contactId,
    opportunityId,
    body: reply,
  });

  await opportunityService.updateStatus(opportunityId, "responded");

  return NextResponse.json({ ok: true });
}
