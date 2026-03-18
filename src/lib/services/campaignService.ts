import { prisma } from "@/lib/prisma";
import { twilioMockService } from "./twilioMockService";

export const campaignService = {
  async launch(campaignId: string) {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        steps: { orderBy: { stepNumber: "asc" } },
        business: true,
      },
    });
    if (!campaign) throw new Error("Campaign not found");

    const step = campaign.steps[0];
    if (!step) throw new Error("Campaign has no steps");

    // For reactivation campaigns, find dormant contacts
    const contacts = await prisma.contact.findMany({
      where: {
        businessId: campaign.businessId,
        status: "dormant",
      },
      take: 50,
    });

    let sentCount = 0;
    for (const contact of contacts) {
      const body = twilioMockService.formatReactivationMessage(
        `${contact.firstName} ${contact.lastName}`,
        campaign.business.name
      );
      await twilioMockService.sendSMS({
        to: contact.phone,
        body,
        businessId: campaign.businessId,
      });
      sentCount++;
    }

    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: "active",
        sentCount: { increment: sentCount },
        targetCount: contacts.length,
      },
    });

    return { sentCount, targetCount: contacts.length };
  },

  async pause(campaignId: string) {
    return prisma.campaign.update({
      where: { id: campaignId },
      data: { status: "paused" },
    });
  },

  async complete(campaignId: string) {
    return prisma.campaign.update({
      where: { id: campaignId },
      data: { status: "completed", completedAt: new Date() },
    });
  },
};
