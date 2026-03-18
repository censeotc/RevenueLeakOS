import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const callSid = formData.get("CallSid") as string | null;
    const callStatus = formData.get("CallStatus") as string | null;
    const from = formData.get("From") as string | null;
    const to = formData.get("To") as string | null;

    console.log("[Twilio Webhook]", { callSid, callStatus, from, to });

    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      { headers: { "Content-Type": "text/xml" } }
    );
  } catch (error) {
    console.error("[Twilio Webhook Error]", error);
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      { status: 200, headers: { "Content-Type": "text/xml" } }
    );
  }
}
