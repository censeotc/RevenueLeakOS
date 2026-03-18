import { NextResponse } from "next/server";

import { parseTwilioPayload } from "@/services/twilioMockService";

export async function POST(request: Request) {
  const payload = await parseTwilioPayload(request);
  return NextResponse.json({ received: true, payload });
}
