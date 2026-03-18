import type { MessageEvent } from "@/types/domain";
import { BUSINESS_ID, addActivity, getStore, nextId, iso } from "@/lib/demo-data";

export interface TwilioMockSendSmsInput {
  contactId: string;
  opportunityId?: string;
  templateId?: string;
  body: string;
}

export const twilioMockService = {
  sendSms(input: TwilioMockSendSmsInput) {
    const message: MessageEvent = {
      id: nextId("msg"),
      businessId: BUSINESS_ID,
      contactId: input.contactId,
      opportunityId: input.opportunityId,
      templateId: input.templateId,
      direction: "outbound",
      channel: "sms",
      body: input.body,
      deliveryStatus: "delivered",
      sentAt: iso(new Date()),
    };

    getStore().messageEvents.unshift(message);
    addActivity({
      type: "message_sent",
      title: "Mock Twilio SMS sent",
      detail: input.body,
      entityType: "message",
      entityId: message.id,
    });

    return message;
  },

  getRecentThread(opportunityId: string, limit = 6) {
    return getStore().messageEvents
      .filter((message) => message.opportunityId === opportunityId)
      .slice(0, limit);
  },
};
