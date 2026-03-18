import { NextRequest, NextResponse } from "next/server";
import { executeMissedCallWorkflow } from "@/services/workflows";
import { DEMO_BUSINESS_ID, DEMO_BUSINESS_NAME } from "@/lib/demo-session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { callerNumber, callerName } = body;

    if (!callerNumber) {
      return NextResponse.json({ error: "callerNumber is required" }, { status: 400 });
    }

    const result = await executeMissedCallWorkflow({
      callerNumber,
      calledNumber: "+13135550100",
      callerName,
      businessId: DEMO_BUSINESS_ID,
      businessName: DEMO_BUSINESS_NAME,
      businessPhone: "(313) 555-0100",
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Missed call workflow error:", error);
    return NextResponse.json({ error: "Workflow failed" }, { status: 500 });
  }
}
