import {
  CampaignStatus,
  CampaignType,
  ContactStatus,
  OpportunityStatus,
  OpportunityType,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const campaignService = {
  async listCampaigns(businessId: string) {
    return prisma.campaign.findMany({
      where: { businessId },
      include: { steps: { include: { template: true } } },
      orderBy: { updatedAt: "desc" },
    });
  },

  async updateCampaignStatus(campaignId: string, status: CampaignStatus) {
    return prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status,
        startedAt: status === CampaignStatus.active ? new Date() : undefined,
        completedAt: status === CampaignStatus.completed ? new Date() : null,
      },
    });
  },

  async enrollStaleEstimate(input: { businessId: string; estimateId: string }) {
    const estimate = await prisma.estimate.findUnique({
      where: { id: input.estimateId },
      include: { contact: true },
    });

    if (!estimate) {
      throw new Error("Estimate not found");
    }

    const existing = await prisma.opportunity.findFirst({
      where: {
        businessId: input.businessId,
        estimateId: estimate.id,
        type: OpportunityType.estimate_rescue,
      },
    });
    if (existing) {
      return existing;
    }

    await prisma.estimate.update({
      where: { id: estimate.id },
      data: { status: "stale" },
    });

    return prisma.opportunity.create({
      data: {
        businessId: input.businessId,
        contactId: estimate.contactId,
        estimateId: estimate.id,
        type: OpportunityType.estimate_rescue,
        status: OpportunityStatus.new,
        title: `Rescue estimate ${estimate.externalId ?? estimate.id}`,
        description: "Stale estimate enrolled in rescue flow.",
        serviceType: estimate.serviceType,
        value: estimate.amount,
      },
    });
  },

  async launchReactivationCampaign(input: {
    businessId: string;
    segment: string;
    campaignName?: string;
  }) {
    const campaign = await prisma.campaign.create({
      data: {
        businessId: input.businessId,
        type: CampaignType.reactivation,
        status: CampaignStatus.active,
        name: input.campaignName ?? `Reactivation - ${input.segment}`,
        targetSegment: input.segment,
        startedAt: new Date(),
      },
    });

    const dormantContacts = await prisma.contact.findMany({
      where: {
        businessId: input.businessId,
        status: ContactStatus.dormant,
      },
      take: 20,
    });

    const created = await Promise.all(
      dormantContacts.map((contact) =>
        prisma.opportunity.create({
          data: {
            businessId: input.businessId,
            contactId: contact.id,
            type: OpportunityType.reactivation,
            status: OpportunityStatus.new,
            title: `Reactivation outreach for ${contact.fullName}`,
            description: `Segment: ${input.segment}`,
            serviceType: "Maintenance",
            value: 1400,
          },
        }),
      ),
    );

    await prisma.activityLog.create({
      data: {
        businessId: input.businessId,
        eventType: "reactivation_launch",
        summary: `Reactivation campaign launched for segment "${input.segment}"`,
        metadata: {
          campaignId: campaign.id,
          opportunitiesCreated: created.length,
        },
      },
    });

    return { campaign, opportunitiesCreated: created.length };
  },
};
