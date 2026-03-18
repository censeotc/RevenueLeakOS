export type TwilioMessageInput = {
  to: string;
  from: string;
  body: string;
};

export type TwilioMessageResult = {
  sid: string;
  status: "queued" | "sent";
  to: string;
  from: string;
  body: string;
  createdAt: Date;
};

export interface TwilioService {
  sendSms(input: TwilioMessageInput): Promise<TwilioMessageResult>;
}

class MockTwilioService implements TwilioService {
  async sendSms(input: TwilioMessageInput): Promise<TwilioMessageResult> {
    const sid = `SM${Math.random().toString(16).slice(2, 14).toUpperCase()}`;
    const createdAt = new Date();

    return {
      sid,
      status: "sent",
      to: input.to,
      from: input.from,
      body: input.body,
      createdAt,
    };
  }
}

export const twilioService: TwilioService = new MockTwilioService();

export function normalizePhone(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  if (digits.startsWith("1") && digits.length === 11) {
    return `+${digits}`;
  }
  return value.startsWith("+") ? value : `+${digits}`;
}
