import type { CallRequest, SMSRequest, SMSResponse } from "./twilio";

export interface InboundSmsPayload {
  from: string;
  body: string;
  receivedAt: Date;
}

export interface MockCallEvent {
  sid: string;
  from: string;
  to: string;
  status: "missed" | "answered";
  duration: number;
  timestamp: Date;
}

export class TwilioMockService {
  async sendSMS(request: SMSRequest): Promise<SMSResponse> {
    console.log(`[MOCK TWILIO] SMS -> ${request.to}: ${request.body.slice(0, 80)}`);

    return {
      sid: `SM_mock_${Date.now()}`,
      status: "delivered",
      to: request.to,
      from: request.from,
      body: request.body,
      dateCreated: new Date(),
    };
  }

  async simulateInboundSMS(from: string, body: string): Promise<InboundSmsPayload> {
    console.log(`[MOCK TWILIO] Inbound SMS <- ${from}: ${body}`);
    return {
      from,
      body,
      receivedAt: new Date(),
    };
  }

  async simulateInboundCall(request: CallRequest): Promise<MockCallEvent> {
    console.log(`[MOCK TWILIO] Missed call <- ${request.from}`);
    return {
      sid: `CA_mock_${Date.now()}`,
      from: request.from,
      to: request.to,
      status: "missed",
      duration: 0,
      timestamp: new Date(),
    };
  }

  buildMissedCallReplyTemplate(firstName: string, businessName: string, businessPhone: string) {
    return `Hi ${firstName}, we missed your call at ${businessName}! We're sorry we couldn't pick up. How can we help? Reply here or call us back at ${businessPhone}.`;
  }
}

export const twilioMockService = new TwilioMockService();
