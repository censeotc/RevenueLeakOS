import { NextRequest, NextResponse } from "next/server";
import { sendSMS } from "@/services/twilioMockService";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { to?: string; from?: string; message?: string };

    if (!body.to || !body.from || !body.message) {
      return NextResponse.json(
        { error: "to, from, and message are required" },
        { status: 400 }
      );
    }

    const result = await sendSMS({
      to: body.to,
      from: body.from,
      body: body.message,
    });

    return NextResponse.json({ message: result });
  } catch {
    return NextResponse.json({ error: "SMS send failed" }, { status: 500 });
  }
}
