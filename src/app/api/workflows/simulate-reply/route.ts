import { NextRequest, NextResponse } from "next/server";
import { simulateReply } from "@/services/workflows";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromNumber, message, opportunityId } = body;

    if (!fromNumber || !message || !opportunityId) {
      return NextResponse.json(
        { error: "fromNumber, message, and opportunityId are required" },
        { status: 400 }
      );
    }

    const result = await simulateReply({
      fromNumber,
      body: message,
      opportunityId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Simulate reply error:", error);
    return NextResponse.json({ error: "Simulation failed" }, { status: 500 });
  }
}
