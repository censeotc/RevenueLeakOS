export interface TwilioMessage {
  sid: string;
  to: string;
  from: string;
  body: string;
  status: TwilioMessageStatus;
  dateCreated: Date;
  dateSent: Date | null;
  dateUpdated: Date;
  direction: "outbound-api" | "inbound";
  price: string | null;
  errorCode: number | null;
  errorMessage: string | null;
}

export type TwilioMessageStatus =
  | "queued"
  | "sending"
  | "sent"
  | "delivered"
  | "undelivered"
  | "failed";

export interface TwilioDeliveryStatus {
  sid: string;
  status: TwilioMessageStatus;
  dateUpdated: Date;
  errorCode: number | null;
  errorMessage: string | null;
}

export interface InboundSMSPayload {
  sid: string;
  from: string;
  to: string;
  body: string;
  dateCreated: Date;
  numMedia: number;
}

let messageCounter = 0;

function generateSid(): string {
  messageCounter++;
  const hex = messageCounter.toString(16).padStart(8, "0");
  return `SM${hex}${"abcdef1234567890abcdef".slice(0, 24)}`;
}

const messageStore = new Map<string, TwilioMessage>();

export async function sendSMS(
  to: string,
  from: string,
  body: string
): Promise<TwilioMessage> {
  const sid = generateSid();
  const now = new Date();

  const message: TwilioMessage = {
    sid,
    to,
    from,
    body,
    status: "sent",
    dateCreated: now,
    dateSent: now,
    dateUpdated: now,
    direction: "outbound-api",
    price: "-0.0075",
    errorCode: null,
    errorMessage: null,
  };

  messageStore.set(sid, message);

  console.log(
    `[TwilioMock] SMS sent | SID: ${sid} | To: ${to} | From: ${from} | Body: "${body.slice(0, 60)}..."`
  );

  // Simulate async delivery status update
  setTimeout(() => {
    const stored = messageStore.get(sid);
    if (stored) {
      stored.status = "delivered";
      stored.dateUpdated = new Date();
    }
  }, 1500);

  return message;
}

export async function simulateInboundSMS(
  from: string,
  to: string,
  body: string
): Promise<InboundSMSPayload> {
  const sid = generateSid();
  const now = new Date();

  const inbound: InboundSMSPayload = {
    sid,
    from,
    to,
    body,
    dateCreated: now,
    numMedia: 0,
  };

  const message: TwilioMessage = {
    sid,
    to,
    from,
    body,
    status: "delivered",
    dateCreated: now,
    dateSent: now,
    dateUpdated: now,
    direction: "inbound",
    price: null,
    errorCode: null,
    errorMessage: null,
  };

  messageStore.set(sid, message);

  console.log(
    `[TwilioMock] Inbound SMS | SID: ${sid} | From: ${from} | To: ${to} | Body: "${body.slice(0, 60)}..."`
  );

  return inbound;
}

export async function getMessageStatus(
  sid: string
): Promise<TwilioDeliveryStatus> {
  const message = messageStore.get(sid);

  if (message) {
    return {
      sid: message.sid,
      status: message.status,
      dateUpdated: message.dateUpdated,
      errorCode: message.errorCode,
      errorMessage: message.errorMessage,
    };
  }

  return {
    sid,
    status: "delivered",
    dateUpdated: new Date(),
    errorCode: null,
    errorMessage: null,
  };
}

export function getStoredMessages(): TwilioMessage[] {
  return Array.from(messageStore.values());
}

export function clearMessageStore(): void {
  messageStore.clear();
  messageCounter = 0;
}
