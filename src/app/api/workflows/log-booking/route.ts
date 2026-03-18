import { NextRequest, NextResponse } from "next/server";
import { logBooking } from "@/services/workflows";
import { DEMO_BUSINESS_ID, DEMO_USER_ID } from "@/lib/demo-session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { opportunityId, contactId, title, serviceType, scheduledAt, estimatedValue } = body;

    if (!opportunityId || !contactId || !title) {
      return NextResponse.json(
        { error: "opportunityId, contactId, and title are required" },
        { status: 400 }
      );
    }

    const result = logBooking({
      opportunityId,
      contactId,
      businessId: DEMO_BUSINESS_ID,
      title,
      serviceType: serviceType || "Service",
      scheduledAt: new Date(scheduledAt || Date.now() + 86400000),
      estimatedValue: estimatedValue || 0,
      bookedById: DEMO_USER_ID,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Log booking error:", error);
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}
