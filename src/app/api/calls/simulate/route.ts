import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { opportunityService } from "@/lib/services/opportunityService";
import { z } from "zod";

const simulateSchema = z.object({
  callerPhone: z.string().optional(),
  isAfterHours: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const businessId = (session.user as any).businessId;
  if (!businessId) {
    return NextResponse.json({ error: "No business associated with user" }, { status: 400 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const parsed = simulateSchema.safeParse(body);

    // Generate random caller phone if not provided
    const callerPhone =
      parsed.success && parsed.data.callerPhone
        ? parsed.data.callerPhone
        : `+1734555${Math.floor(1000 + Math.random() * 9000)}`;

    const isAfterHours = parsed.success ? parsed.data.isAfterHours ?? false : false;

    const result = await opportunityService.handleMissedCall(businessId, callerPhone, isAfterHours);

    if (!result) {
      return NextResponse.json(
        { message: "Call suppressed (duplicate within 4-hour window)", suppressed: true },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      opportunity: result.opportunity,
      contact: result.contact,
      callEvent: result.callEvent,
      callerPhone,
      message: `Missed call workflow completed for ${callerPhone}`,
    });
  } catch (error) {
    console.error("Failed to simulate missed call:", error);
    return NextResponse.json({ error: "Failed to simulate missed call" }, { status: 500 });
  }
}
