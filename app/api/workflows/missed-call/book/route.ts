import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { opportunityService } from "@/lib/services/opportunityService";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const opportunityId = String(body.opportunityId ?? "");
  const revenue = Number(body.revenue ?? 1800);
  const serviceType = String(body.serviceType ?? "Service visit");

  if (!opportunityId) {
    return NextResponse.json({ error: "opportunityId is required" }, { status: 400 });
  }

  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
  });

  if (!opportunity) {
    return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
  }

  const booking = await opportunityService.logBooking({
    businessId: session.user.businessId,
    opportunityId,
    contactId: opportunity.contactId,
    sourceType: "missed_call",
    revenue,
    serviceType,
  });

  return NextResponse.json({ ok: true, bookingId: booking.id });
}
