export interface MockSMSRequest {
  to: string;
  from: string;
  body: string;
}

export interface MockSMSResponse {
  sid: string;
  status: "queued" | "sent" | "delivered" | "failed";
  to: string;
  from: string;
  body: string;
  dateCreated: Date;
}

export interface MockCallRequest {
  to: string;
  from: string;
}

export interface MockCallResponse {
  sid: string;
  from: string;
  to: string;
  status: "missed" | "answered";
  duration: number;
  timestamp: Date;
}

const smsLog: MockSMSResponse[] = [];
const callLog: MockCallResponse[] = [];

export async function sendSMS(request: MockSMSRequest): Promise<MockSMSResponse> {
  const response: MockSMSResponse = {
    sid: `SM_mock_${Date.now()}`,
    status: "delivered",
    to: request.to,
    from: request.from,
    body: request.body,
    dateCreated: new Date(),
  };

  smsLog.unshift(response);
  return response;
}

export async function simulateInboundSMS(from: string, body: string) {
  return {
    from,
    body,
    receivedAt: new Date(),
  };
}

export async function simulateInboundCall(from: string, to: string): Promise<MockCallResponse> {
  const response: MockCallResponse = {
    sid: `CA_mock_${Date.now()}`,
    from,
    to,
    status: "missed",
    duration: 0,
    timestamp: new Date(),
  };

  callLog.unshift(response);
  return response;
}

export async function placeOutboundCall(request: MockCallRequest): Promise<MockCallResponse> {
  const response: MockCallResponse = {
    sid: `CA_out_${Date.now()}`,
    from: request.from,
    to: request.to,
    status: "answered",
    duration: 95,
    timestamp: new Date(),
  };

  callLog.unshift(response);
  return response;
}

export function getRecentMockSms(limit = 25) {
  return smsLog.slice(0, limit);
}

export function getRecentMockCalls(limit = 25) {
  return callLog.slice(0, limit);
}
