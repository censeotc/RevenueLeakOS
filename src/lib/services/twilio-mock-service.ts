import { createId, mutateDemoStore } from "@/lib/data/demo-store";

type SendMessageInput = {
  businessId: string;
  opportunityId: string;
  contactId: string;
  campaignId?: string;
  templateId?: string;
  body: string;
};

type SimulateReplyInput = {
  businessId: string;
  opportunityId: string;
  contactId: string;
  body: string;
};

export const twilioMockService = {
  sendMessage(input: SendMessageInput) {
    const timestamp = new Date().toISOString();

    return mutateDemoStore((store) => {
      store.messageEvents.unshift({
        id: createId("msg"),
        businessId: input.businessId,
        opportunityId: input.opportunityId,
        contactId: input.contactId,
        campaignId: input.campaignId,
        templateId: input.templateId,
        channel: "sms",
        direction: "outbound",
        status: "delivered",
        body: input.body,
        sentAt: timestamp,
        deliveredAt: timestamp,
        createdAt: timestamp,
      });

      store.activityLogs.unshift({
        id: createId("activity"),
        businessId: input.businessId,
        opportunityId: input.opportunityId,
        contactId: input.contactId,
        type: "message",
        title: "Twilio mock SMS sent",
        message: input.body,
        createdAt: timestamp,
      });
    });
  },

  simulateReply(input: SimulateReplyInput) {
    const timestamp = new Date().toISOString();

    return mutateDemoStore((store) => {
      store.messageEvents.unshift({
        id: createId("msg"),
        businessId: input.businessId,
        opportunityId: input.opportunityId,
        contactId: input.contactId,
        channel: "sms",
        direction: "inbound",
        status: "replied",
        body: input.body,
        repliedAt: timestamp,
        createdAt: timestamp,
      });

      store.activityLogs.unshift({
        id: createId("activity"),
        businessId: input.businessId,
        opportunityId: input.opportunityId,
        contactId: input.contactId,
        type: "reply",
        title: "Mock reply received",
        message: input.body,
        createdAt: timestamp,
      });
    });
  },
};
