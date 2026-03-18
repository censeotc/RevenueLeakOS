import { NextRequest, NextResponse } from "next/server";
import { createEstimateRescueOpportunity } from "@/services/workflows";
import { DEMO_BUSINESS_ID } from "@/lib/demo-session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { estimateId, contactId, amount, serviceType, contactFirstName } = body;

    if (!estimateId || !contactId) {
      return NextResponse.json(
        { error: "estimateId and contactId are required" },
        { status: 400 }
      );
    }

    const result = createEstimateRescueOpportunity({
      estimateId,
      contactId,
      businessId: DEMO_BUSINESS_ID,
      amount: amount || 0,
      serviceType: serviceType || "Service",
      contactFirstName: contactFirstName || "Customer",
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Estimate rescue error:", error);
    return NextResponse.json({ error: "Workflow failed" }, { status: 500 });
  }
}
