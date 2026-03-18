export interface SMSRequest {
  to: string;
  from: string;
  body: string;
}

export interface SMSResponse {
  sid: string;
  status: "queued" | "sent" | "delivered" | "failed";
  to: string;
  from: string;
  body: string;
  dateCreated: Date;
}

export interface CallRequest {
  to: string;
  from: string;
}

export interface CallResponse {
  sid: string;
  from: string;
  to: string;
  status: "missed" | "answered" | "busy" | "no-answer" | "failed";
  duration: number;
  timestamp: Date;
}

export interface WebhookEvent {
  type: "sms.inbound" | "sms.status" | "call.inbound" | "call.status";
  sid: string;
  timestamp: Date;
  payload: Record<string, unknown>;
}

export interface MessageLogEntry {
  sid: string;
  direction: "inbound" | "outbound";
  channel: "sms" | "voice";
  from: string;
  to: string;
  body?: string;
  status: string;
  timestamp: Date;
}

class TwilioMockService {
  private mockMode = true;
  private messageLog: MessageLogEntry[] = [];
  private webhookListeners: Array<(event: WebhookEvent) => void> = [];

  setMockMode(mock: boolean) {
    this.mockMode = mock;
  }

  isMockMode() {
    return this.mockMode;
  }

  onWebhook(listener: (event: WebhookEvent) => void) {
    this.webhookListeners.push(listener);
    return () => {
      this.webhookListeners = this.webhookListeners.filter((l) => l !== listener);
    };
  }

  private emitWebhook(event: WebhookEvent) {
    this.webhookListeners.forEach((l) => l(event));
  }

  getMessageLog(): MessageLogEntry[] {
    return [...this.messageLog];
  }

  clearMessageLog() {
    this.messageLog = [];
  }

  async sendSMS(request: SMSRequest): Promise<SMSResponse> {
    if (!this.mockMode) {
      throw new Error("Real Twilio not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.");
    }

    const sid = `SM_mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date();

    console.log(`[MOCK TWILIO] SMS -> ${request.to}: ${request.body.substring(0, 60)}...`);

    const response: SMSResponse = {
      sid,
      status: "delivered",
      to: request.to,
      from: request.from,
      body: request.body,
      dateCreated: now,
    };

    this.messageLog.push({
      sid,
      direction: "outbound",
      channel: "sms",
      from: request.from,
      to: request.to,
      body: request.body,
      status: "delivered",
      timestamp: now,
    });

    this.emitWebhook({
      type: "sms.status",
      sid,
      timestamp: now,
      payload: { status: "delivered", to: request.to },
    });

    return response;
  }

  async simulateInboundSMS(from: string, to: string, body: string): Promise<{
    sid: string;
    from: string;
    to: string;
    body: string;
    receivedAt: Date;
  }> {
    const sid = `SM_in_mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date();

    console.log(`[MOCK TWILIO] SMS <- ${from}: ${body}`);

    this.messageLog.push({
      sid,
      direction: "inbound",
      channel: "sms",
      from,
      to,
      body,
      status: "received",
      timestamp: now,
    });

    this.emitWebhook({
      type: "sms.inbound",
      sid,
      timestamp: now,
      payload: { from, to, body },
    });

    return { sid, from, to, body, receivedAt: now };
  }

  async simulateInboundCall(from: string, to: string, options?: {
    status?: "missed" | "answered";
    duration?: number;
  }): Promise<CallResponse> {
    const sid = `CA_mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date();
    const status = options?.status || "missed";
    const duration = options?.duration || 0;

    console.log(`[MOCK TWILIO] Call <- ${from} (${status})`);

    this.messageLog.push({
      sid,
      direction: "inbound",
      channel: "voice",
      from,
      to,
      status,
      timestamp: now,
    });

    this.emitWebhook({
      type: "call.inbound",
      sid,
      timestamp: now,
      payload: { from, to, status, duration },
    });

    return { sid, from, to, status, duration, timestamp: now };
  }

  async makeCall(request: CallRequest): Promise<CallResponse> {
    if (!this.mockMode) {
      throw new Error("Real Twilio not configured.");
    }

    const sid = `CA_out_mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date();

    console.log(`[MOCK TWILIO] Call -> ${request.to}`);

    this.messageLog.push({
      sid,
      direction: "outbound",
      channel: "voice",
      from: request.from,
      to: request.to,
      status: "answered",
      timestamp: now,
    });

    return {
      sid,
      from: request.from,
      to: request.to,
      status: "answered",
      duration: 0,
      timestamp: now,
    };
  }

  async lookupNumber(phone: string): Promise<{
    valid: boolean;
    carrier: string;
    type: "mobile" | "landline" | "voip";
  }> {
    return {
      valid: true,
      carrier: "Mock Carrier",
      type: "mobile",
    };
  }

  getDeliveryStats(): {
    sent: number;
    delivered: number;
    failed: number;
    received: number;
  } {
    const outbound = this.messageLog.filter((m) => m.direction === "outbound" && m.channel === "sms");
    const inbound = this.messageLog.filter((m) => m.direction === "inbound" && m.channel === "sms");

    return {
      sent: outbound.length,
      delivered: outbound.filter((m) => m.status === "delivered").length,
      failed: outbound.filter((m) => m.status === "failed").length,
      received: inbound.length,
    };
  }
}

export const twilioService = new TwilioMockService();

export async function sendSMS(request: SMSRequest): Promise<SMSResponse> {
  return twilioService.sendSMS(request);
}

export async function simulateInboundSMS(from: string, body: string): Promise<{
  from: string;
  body: string;
  receivedAt: Date;
}> {
  const result = await twilioService.simulateInboundSMS(from, "", body);
  return { from: result.from, body: result.body, receivedAt: result.receivedAt };
}

export async function simulateInboundCall(from: string, to: string): Promise<CallResponse> {
  return twilioService.simulateInboundCall(from, to);
}
