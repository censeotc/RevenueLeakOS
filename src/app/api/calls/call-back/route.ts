import { NextRequest, NextResponse } from "next/server";
import { placeOutboundCall } from "@/services/twilioMockService";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { to?: string; from?: string };

    if (!body.to || !body.from) {
      return NextResponse.json({ error: "to and from are required" }, { status: 400 });
    }

    const call = await placeOutboundCall({ to: body.to, from: body.from });
    return NextResponse.json({ call });
  } catch {
    return NextResponse.json({ error: "Call simulation failed" }, { status: 500 });
  }
}
