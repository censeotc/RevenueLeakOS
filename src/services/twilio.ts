/**
 * Twilio Mock Service Layer
 *
 * In demo/dev mode, all calls are simulated and logged.
 * To switch to real Twilio, set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN
 * environment variables and call setMockMode(false).
 */

export interface SMSRequest {
  to: string;
  from: string;
  body: string;
  opportunityId?: string;
}

export interface SMSResponse {
  sid: string;
  status: "queued" | "sent" | "delivered" | "failed";
  to: string;
  from: string;
  body: string;
  dateCreated: Date;
  isMock: boolean;
}

export interface CallRequest {
  to: string;
  from: string;
  callerId?: string;
}

export interface CallResponse {
  sid: string;
  status: "initiated" | "ringing" | "in-progress" | "completed" | "missed";
  to: string;
  from: string;
  duration: number;
  startedAt: Date;
  isMock: boolean;
}

export interface InboundWebhookPayload {
  MessageSid: string;
  From: string;
  To: string;
  Body: string;
  NumMedia?: string;
}

// ── Mock log store (in-memory for demo) ───────────────────────────────────────

interface MockSMSLog {
  id: string;
  type: "outbound" | "inbound";
  to: string;
  from: string;
  body: string;
  status: SMSResponse["status"];
  timestamp: Date;
  opportunityId?: string;
}

const mockSMSLog: MockSMSLog[] = [];

export function getMockSMSLog(): MockSMSLog[] {
  return [...mockSMSLog].reverse();
}

export function clearMockLog() {
  mockSMSLog.length = 0;
}

// ── Mode control ──────────────────────────────────────────────────────────────

let _mockMode = true;

export function setMockMode(mock: boolean) {
  _mockMode = mock;
}

export function isMockMode() {
  return _mockMode;
}

// ── Send SMS ──────────────────────────────────────────────────────────────────

export async function sendSMS(request: SMSRequest): Promise<SMSResponse> {
  if (_mockMode) {
    const sid = `SM_mock_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    console.log(`[MOCK TWILIO] → SMS to ${request.to}: "${request.body.substring(0, 60)}…"`);

    const response: SMSResponse = {
      sid,
      status: "delivered",
      to: request.to,
      from: request.from,
      body: request.body,
      dateCreated: new Date(),
      isMock: true,
    };

    mockSMSLog.push({
      id: sid,
      type: "outbound",
      to: request.to,
      from: request.from,
      body: request.body,
      status: "delivered",
      timestamp: new Date(),
      opportunityId: request.opportunityId,
    });

    return response;
  }

  // Real Twilio implementation
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error(
      "Real Twilio not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables."
    );
  }

  const params = new URLSearchParams({
    To: request.to,
    From: request.from,
    Body: request.body,
  });

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Twilio error ${res.status}: ${err.message}`);
  }

  const data = await res.json();
  return {
    sid: data.sid,
    status: data.status,
    to: data.to,
    from: data.from,
    body: data.body,
    dateCreated: new Date(data.date_created),
    isMock: false,
  };
}

// ── Simulate inbound SMS ──────────────────────────────────────────────────────

export async function simulateInboundSMS(
  from: string,
  body: string,
  opportunityId?: string
): Promise<{
  from: string;
  body: string;
  receivedAt: Date;
}> {
  const receivedAt = new Date();
  console.log(`[MOCK TWILIO] ← Inbound SMS from ${from}: "${body}"`);

  mockSMSLog.push({
    id: `SM_inbound_${Date.now()}`,
    type: "inbound",
    to: "+13135550100",
    from,
    body,
    status: "delivered",
    timestamp: receivedAt,
    opportunityId,
  });

  return { from, body, receivedAt };
}

// ── Simulate inbound missed call ──────────────────────────────────────────────

export async function simulateInboundCall(
  from: string,
  to: string,
  callerName?: string
): Promise<CallResponse> {
  console.log(`[MOCK TWILIO] ← Missed call from ${from} (${callerName ?? "Unknown"})`);
  return {
    sid: `CA_mock_${Date.now()}`,
    status: "missed",
    to,
    from,
    duration: 0,
    startedAt: new Date(),
    isMock: true,
  };
}

// ── Render SMS template ───────────────────────────────────────────────────────

export function renderTemplate(
  template: string,
  variables: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] ?? `{{${key}}}`);
}

// ── Status helpers ────────────────────────────────────────────────────────────

export function getSMSStatusLabel(status: SMSResponse["status"]): string {
  const labels: Record<string, string> = {
    queued: "Queued",
    sent: "Sent",
    delivered: "Delivered",
    failed: "Failed",
  };
  return labels[status] ?? status;
}
