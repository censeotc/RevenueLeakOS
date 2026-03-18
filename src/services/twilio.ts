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

let mockMode = true;

export function setMockMode(mock: boolean) {
  mockMode = mock;
}

export async function sendSMS(request: SMSRequest): Promise<SMSResponse> {
  if (mockMode) {
    console.log(`[MOCK TWILIO] Sending SMS to ${request.to}: ${request.body.substring(0, 50)}...`);
    return {
      sid: `SM_mock_${Date.now()}`,
      status: "delivered",
      to: request.to,
      from: request.from,
      body: request.body,
      dateCreated: new Date(),
    };
  }

  // Real Twilio implementation would go here
  throw new Error("Real Twilio not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.");
}

export async function simulateInboundSMS(from: string, body: string): Promise<{
  from: string;
  body: string;
  receivedAt: Date;
}> {
  console.log(`[MOCK TWILIO] Simulating inbound SMS from ${from}: ${body}`);
  return {
    from,
    body,
    receivedAt: new Date(),
  };
}

export async function simulateInboundCall(from: string, to: string): Promise<{
  sid: string;
  from: string;
  to: string;
  status: "missed" | "answered";
  duration: number;
  timestamp: Date;
}> {
  console.log(`[MOCK TWILIO] Simulating inbound call from ${from}`);
  return {
    sid: `CA_mock_${Date.now()}`,
    from,
    to,
    status: "missed",
    duration: 0,
    timestamp: new Date(),
  };
}
