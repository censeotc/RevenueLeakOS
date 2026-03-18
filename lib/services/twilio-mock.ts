import {
  normalizePhone,
  twilioService,
  type TwilioMessageInput,
  type TwilioMessageResult,
} from "@/lib/services/twilioService";

export type MockTwilioMessageInput = TwilioMessageInput;
export type MockTwilioMessageResult = TwilioMessageResult;

// Backward-compatible shim while callers migrate to twilioService directly.
export async function sendMockSms(
  input: MockTwilioMessageInput,
): Promise<MockTwilioMessageResult> {
  return twilioService.sendSms(input);
}

export { normalizePhone };
