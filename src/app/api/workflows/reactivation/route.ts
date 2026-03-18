import { NextRequest, NextResponse } from "next/server";
import { createReactivationOpportunities } from "@/services/workflows";
import { DEMO_BUSINESS_ID } from "@/lib/demo-session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contactIds, segmentName } = body;

    if (!contactIds?.length || !segmentName) {
      return NextResponse.json(
        { error: "contactIds array and segmentName are required" },
        { status: 400 }
      );
    }

    const results = createReactivationOpportunities({
      contactIds,
      businessId: DEMO_BUSINESS_ID,
      segmentName,
    });

    return NextResponse.json({ opportunities: results });
  } catch (error) {
    console.error("Reactivation workflow error:", error);
    return NextResponse.json({ error: "Workflow failed" }, { status: 500 });
  }
}
