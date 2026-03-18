import { prisma } from "@/lib/prisma";
import type { SendSMSInput, SMSResult } from "@/types";

/**
 * Mock Twilio service layer.
 * In production, replace with real Twilio SDK calls.
 * All methods persist to MessageEvent for a realistic audit trail.
 */
export const twilioMockService = {
  async sendSMS(input: SendSMSInput): Promise<SMSResult> {
    const mockMessageId = `SM${Math.random().toString(36).slice(2, 18).toUpperCase()}`;

    await prisma.messageEvent.create({
      data: {
        businessId: input.businessId,
        opportunityId: input.opportunityId ?? null,
        contactPhone: input.to,
        direction: "outbound",
        channel: "sms",
        body: input.body,
        status: "delivered",
        externalId: mockMessageId,
        sentAt: new Date(),
        deliveredAt: new Date(Date.now() + 2000),
      },
    });

    console.log(`[TwilioMock] SMS sent to ${input.to}: "${input.body.slice(0, 60)}..."`);

    return {
      success: true,
      messageId: mockMessageId,
    };
  },

  async simulateReply(opportunityId: string, from: string, body: string, businessId: string): Promise<void> {
    await prisma.messageEvent.create({
      data: {
        businessId,
        opportunityId,
        contactPhone: from,
        direction: "inbound",
        channel: "sms",
        body,
        status: "delivered",
        externalId: `SM${Math.random().toString(36).slice(2, 18).toUpperCase()}`,
        sentAt: new Date(),
        deliveredAt: new Date(),
      },
    });

    await prisma.opportunity.update({
      where: { id: opportunityId },
      data: { status: "responded", lastContactAt: new Date() },
    });

    console.log(`[TwilioMock] Simulated reply from ${from}: "${body}"`);
  },

  formatMissedCallMessage(contactName: string, businessName: string): string {
    return `Hi ${contactName.split(" ")[0]}, this is ${businessName}. We missed your call! We'd love to help — reply here or call us back at your convenience.`;
  },

  formatEstimateFollowUp(contactName: string, estimateTitle: string, amount: number, businessName: string): string {
    const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);
    return `Hi ${contactName.split(" ")[0]}, following up on your estimate for ${estimateTitle} (${formatted}). Any questions? We're happy to walk you through it. — ${businessName}`;
  },

  formatReactivationMessage(contactName: string, businessName: string): string {
    return `Hi ${contactName.split(" ")[0]}! It's been a while since we last saw you. ${businessName} would love to help with any upcoming service needs. Reply to chat or call us anytime.`;
  },
};
