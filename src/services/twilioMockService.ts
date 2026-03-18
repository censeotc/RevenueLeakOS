// Twilio mock service - simulates SMS and call operations for demo mode

export interface SMSPayload {
  to: string;
  from: string;
  body: string;
  contactId?: string;
  opportunityId?: string;
}

export interface SMSResult {
  sid: string;
  status: "queued" | "sent" | "delivered" | "failed";
  to: string;
  from: string;
  body: string;
  sentAt: Date;
}

export interface CallPayload {
  to: string;
  from: string;
  contactId?: string;
  opportunityId?: string;
}

export interface CallResult {
  sid: string;
  to: string;
  from: string;
  status: "initiated" | "ringing" | "in-progress" | "completed" | "failed";
  initiatedAt: Date;
}

export interface InboundCallEvent {
  sid: string;
  from: string;
  to: string;
  status: "missed" | "answered";
  duration: number;
  timestamp: Date;
}

export interface InboundSMSEvent {
  from: string;
  to: string;
  body: string;
  receivedAt: Date;
}

// Simulated delivery log (in-memory for demo)
const smsLog: SMSResult[] = [];
const callLog: CallResult[] = [];

function mockDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendSMS(payload: SMSPayload): Promise<SMSResult> {
  await mockDelay(400);
  const result: SMSResult = {
    sid: `SM_mock_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    status: "delivered",
    to: payload.to,
    from: payload.from,
    body: payload.body,
    sentAt: new Date(),
  };
  smsLog.push(result);
  console.log(`[TwilioMock] SMS sent to ${payload.to}: "${payload.body.substring(0, 60)}..."`);
  return result;
}

export async function initiateCall(payload: CallPayload): Promise<CallResult> {
  await mockDelay(600);
  const result: CallResult = {
    sid: `CA_mock_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    to: payload.to,
    from: payload.from,
    status: "ringing",
    initiatedAt: new Date(),
  };
  callLog.push(result);
  console.log(`[TwilioMock] Outbound call initiated to ${payload.to}`);
  return result;
}

export async function simulateInboundCall(from: string, to: string): Promise<InboundCallEvent> {
  await mockDelay(200);
  return {
    sid: `CA_inbound_${Date.now()}`,
    from,
    to,
    status: "missed",
    duration: 0,
    timestamp: new Date(),
  };
}

export async function simulateInboundSMS(from: string, to: string, body: string): Promise<InboundSMSEvent> {
  await mockDelay(100);
  return {
    from,
    to,
    body,
    receivedAt: new Date(),
  };
}

export function getSMSLog(): SMSResult[] {
  return [...smsLog];
}

export function getCallLog(): CallResult[] {
  return [...callLog];
}

export function buildSMSBody(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (body, [key, value]) => body.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value),
    template
  );
}

// Pre-built message builders
export function buildMissedCallReply(firstName: string, businessName: string, businessPhone: string): string {
  return `Hi ${firstName}, we missed your call at ${businessName}! We're sorry we couldn't pick up. How can we help? Reply here or call us back at ${businessPhone}.`;
}

export function buildEstimateFollowUp(firstName: string, serviceType: string, estimateDate: string): string {
  return `Hi ${firstName}, just checking in on the ${serviceType} estimate we sent on ${estimateDate}. Do you have any questions? We'd love to help get this scheduled.`;
}

export function buildReactivationMessage(firstName: string, businessName: string): string {
  return `Hi ${firstName}, it's been a while since your last service with ${businessName}! We'd love to have you back. Book a tune-up this month and save 15%. Reply YES to schedule.`;
}
