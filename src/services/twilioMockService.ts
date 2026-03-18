/**
 * Twilio integration service.
 * In development/demo mode, calls are mocked and logged.
 * In production, wire up the real Twilio SDK.
 */

export interface SmsPayload {
  to: string;
  body: string;
  from?: string;
}

export interface CallPayload {
  to: string;
  from?: string;
  twiml?: string;
}

export interface InboundSmsEvent {
  messageSid: string | null;
  from: string | null;
  to: string | null;
  body: string | null;
}

export interface CallStatusEvent {
  callSid: string;
  callStatus: string;
  from: string | null;
  to: string | null;
}

class TwilioMockService {
  private readonly isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  async sendSms(payload: SmsPayload): Promise<{ sid: string; status: string }> {
    if (this.isDemo) {
      const sid = `SM_MOCK_${Date.now()}`;
      console.log(`[DEMO] SMS to ${payload.to}: ${payload.body}`);
      return { sid, status: "delivered" };
    }

    const { default: twilio } = await import("twilio");
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );

    const message = await client.messages.create({
      to: payload.to,
      from: payload.from ?? process.env.TWILIO_PHONE_NUMBER!,
      body: payload.body,
    });

    return { sid: message.sid, status: message.status };
  }

  async initiateCall(payload: CallPayload): Promise<{ sid: string; status: string }> {
    if (this.isDemo) {
      const sid = `CA_MOCK_${Date.now()}`;
      console.log(`[DEMO] Call to ${payload.to}`);
      return { sid, status: "initiated" };
    }

    const { default: twilio } = await import("twilio");
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );

    const call = await client.calls.create({
      to: payload.to,
      from: payload.from ?? process.env.TWILIO_PHONE_NUMBER!,
      twiml: payload.twiml ?? "<Response><Say>Hello</Say></Response>",
    });

    return { sid: call.sid, status: call.status };
  }

  async handleInboundSms(event: InboundSmsEvent): Promise<void> {
    if (this.isDemo) {
      console.log(`[DEMO] Inbound SMS from ${event.from}: ${event.body}`);
      return;
    }

    // TODO: look up contact by phone, update thread, check for opt-out keywords
    if (event.body?.toLowerCase().includes("stop")) {
      console.log(`Opt-out request from ${event.from}`);
    }
  }

  async handleCallStatus(event: CallStatusEvent): Promise<void> {
    if (this.isDemo) {
      console.log(`[DEMO] Call status: ${event.callSid} → ${event.callStatus}`);
      return;
    }

    if (event.callStatus === "no-answer" || event.callStatus === "busy") {
      // TODO: create missed call opportunity for inbound calls
    }
  }

  generateMissedCallTwiml(businessName: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Thank you for calling ${businessName}. We're not able to take your call right now, but we'll text you shortly. Goodbye!</Say>
</Response>`;
  }
}

export const twilioMockService = new TwilioMockService();
