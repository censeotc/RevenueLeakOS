import { ChannelType, MessageDirection, MessageStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function mockSid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 12)}`;
}

export const twilioMockService = {
  async sendSms(params: {
    businessId: string;
    contactId: string;
    opportunityId?: string;
    campaignId?: string;
    templateId?: string;
    body: string;
  }) {
    const message = await prisma.messageEvent.create({
      data: {
        businessId: params.businessId,
        contactId: params.contactId,
        opportunityId: params.opportunityId,
        campaignId: params.campaignId,
        templateId: params.templateId,
        channel: ChannelType.sms,
        direction: MessageDirection.outbound,
        status: MessageStatus.sent,
        externalId: mockSid("SM"),
        body: params.body,
        sentAt: new Date(),
      },
    });

    await prisma.messageEvent.update({
      where: { id: message.id },
      data: {
        status: MessageStatus.delivered,
        deliveredAt: new Date(),
      },
    });

    return message;
  },

  async simulateInboundReply(params: {
    businessId: string;
    contactId: string;
    opportunityId?: string;
    body: string;
  }) {
    return prisma.messageEvent.create({
      data: {
        businessId: params.businessId,
        contactId: params.contactId,
        opportunityId: params.opportunityId,
        channel: ChannelType.sms,
        direction: MessageDirection.inbound,
        status: MessageStatus.replied,
        externalId: mockSid("MM"),
        body: params.body,
        sentAt: new Date(),
        deliveredAt: new Date(),
      },
    });
  },
};
