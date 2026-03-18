export interface SendSmsPayload {
  to: string;
  body: string;
}

export interface SendSmsResult {
  sid: string;
  status: "queued" | "sent" | "delivered" | "failed";
}

export async function sendSms(payload: SendSmsPayload): Promise<SendSmsResult> {
  console.log(`[TwilioMock] SMS to ${payload.to}: ${payload.body.slice(0, 50)}...`);
  return {
    sid: `SM${Date.now()}`,
    status: "queued",
  };
}

export async function makeCall(to: string): Promise<{ sid: string }> {
  console.log(`[TwilioMock] Call to ${to}`);
  return { sid: `CA${Date.now()}` };
}

export async function getCallStatus(
  _sid: string
): Promise<{ status: string; duration: number }> {
  return { status: "completed", duration: 120 };
}
