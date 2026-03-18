import { twilioMockService } from "./twilio-mock";

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

export interface TwilioService {
  sendSMS(request: SMSRequest): Promise<SMSResponse>;
  simulateInboundSMS(from: string, body: string): Promise<{
    from: string;
    body: string;
    receivedAt: Date;
  }>;
  simulateInboundCall(request: CallRequest): Promise<{
    sid: string;
    from: string;
    to: string;
    status: "missed" | "answered";
    duration: number;
    timestamp: Date;
  }>;
}

let mockMode = true;
const mockService: TwilioService = twilioMockService;

export function setMockMode(mock: boolean) {
  mockMode = mock;
}

export function getTwilioService(): TwilioService {
  if (mockMode) {
    return mockService;
  }

  throw new Error("Real Twilio not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.");
}

export async function sendSMS(request: SMSRequest): Promise<SMSResponse> {
  return getTwilioService().sendSMS(request);
}

export async function simulateInboundSMS(from: string, body: string): Promise<{
  from: string;
  body: string;
  receivedAt: Date;
}> {
  return getTwilioService().simulateInboundSMS(from, body);
}

export async function simulateInboundCall(from: string, to: string): Promise<{
  sid: string;
  from: string;
  to: string;
  status: "missed" | "answered";
  duration: number;
  timestamp: Date;
}> {
  return getTwilioService().simulateInboundCall({ from, to });
}
