import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const callStatus = formData.get("CallStatus") as string | null;
    const messageSid = formData.get("MessageSid") as string | null;
    const from = formData.get("From") as string | null;
    const to = formData.get("To") as string | null;
    const body = formData.get("Body") as string | null;
    const callSid = formData.get("CallSid") as string | null;

    if (messageSid) {
      await handleInboundSms({ messageSid, from, to, body });
    } else if (callSid && callStatus) {
      await handleCallStatusUpdate({ callSid, callStatus, from, to });
    }

    // Twilio expects an empty 200 TwiML response
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      {
        status: 200,
        headers: { "Content-Type": "text/xml" },
      }
    );
  } catch (error) {
    console.error("Twilio webhook error:", error);
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      { status: 200, headers: { "Content-Type": "text/xml" } }
    );
  }
}

async function handleInboundSms({
  messageSid,
  from,
  to,
  body,
}: {
  messageSid: string | null;
  from: string | null;
  to: string | null;
  body: string | null;
}) {
  const { twilioMockService } = await import("@/services/twilioMockService");
  await twilioMockService.handleInboundSms({ messageSid, from, to, body });
}

async function handleCallStatusUpdate({
  callSid,
  callStatus,
  from,
  to,
}: {
  callSid: string;
  callStatus: string;
  from: string | null;
  to: string | null;
}) {
  const { twilioMockService } = await import("@/services/twilioMockService");
  await twilioMockService.handleCallStatus({ callSid, callStatus, from, to });
}
