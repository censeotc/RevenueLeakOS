import type { CampaignStatus } from "@prisma/client";
import {
  DEMO_CAMPAIGNS,
  type DemoCampaign,
  type DemoCampaignStep,
} from "@/lib/demo-data";

export interface CampaignWithSteps extends DemoCampaign {
  steps: DemoCampaignStep[];
}

export interface CampaignPerformance {
  campaignId: string;
  name: string;
  sentCount: number;
  deliveredCount: number;
  respondedCount: number;
  bookedCount: number;
  revenue: number;
  responseRate: number;
  bookingRate: number;
  revenuePerMessage: number;
  dailyStats: {
    date: string;
    sent: number;
    responded: number;
    booked: number;
  }[];
}

export async function getCampaigns(
  businessId: string
): Promise<DemoCampaign[]> {
  return DEMO_CAMPAIGNS.filter((c) => c.businessId === businessId);
}

export async function getCampaignById(
  id: string
): Promise<CampaignWithSteps | null> {
  const campaign = DEMO_CAMPAIGNS.find((c) => c.id === id);
  if (!campaign) return null;

  return {
    ...campaign,
    steps: campaign.steps ?? [],
  };
}

export async function createCampaign(data: {
  businessId: string;
  name: string;
  type: DemoCampaign["type"];
  channel?: DemoCampaign["channel"];
  targetSegment?: string;
  steps?: Omit<DemoCampaignStep, "id" | "campaignId" | "createdAt">[];
}): Promise<DemoCampaign> {
  const now = new Date();
  const id = `cmp_${Date.now()}`;

  const campaign: DemoCampaign = {
    id,
    businessId: data.businessId,
    name: data.name,
    type: data.type,
    status: "draft",
    channel: data.channel ?? "sms",
    targetSegment: data.targetSegment ?? null,
    targetCount: 0,
    sentCount: 0,
    respondedCount: 0,
    bookedCount: 0,
    revenue: 0,
    startAt: null,
    endAt: null,
    stopOnReply: true,
    stopOnBooking: true,
    createdAt: now,
    updatedAt: now,
    steps: (data.steps ?? []).map((step, i) => ({
      id: `step_${Date.now()}_${i}`,
      campaignId: id,
      stepOrder: step.stepOrder,
      channel: step.channel,
      templateId: step.templateId,
      delayMinutes: step.delayMinutes,
      subject: step.subject,
      body: step.body,
      createdAt: now,
    })),
  };

  console.log("[CampaignService] Created campaign:", campaign.id, campaign.name);
  return campaign;
}

export async function updateCampaignStatus(
  id: string,
  status: CampaignStatus
): Promise<DemoCampaign | null> {
  const campaign = DEMO_CAMPAIGNS.find((c) => c.id === id);
  if (!campaign) return null;

  const updated: DemoCampaign = {
    ...campaign,
    status,
    updatedAt: new Date(),
    startAt:
      status === "active" && !campaign.startAt ? new Date() : campaign.startAt,
    endAt: status === "completed" ? new Date() : campaign.endAt,
  };

  console.log(
    `[CampaignService] Updated campaign ${id} status to ${status}`
  );
  return updated;
}

export async function getCampaignPerformance(
  id: string
): Promise<CampaignPerformance | null> {
  const campaign = DEMO_CAMPAIGNS.find((c) => c.id === id);
  if (!campaign) return null;

  const deliveredCount = Math.round(campaign.sentCount * 0.96);
  const responseRate =
    campaign.sentCount > 0 ? campaign.respondedCount / campaign.sentCount : 0;
  const bookingRate =
    campaign.respondedCount > 0
      ? campaign.bookedCount / campaign.respondedCount
      : 0;
  const revenuePerMessage =
    campaign.sentCount > 0 ? campaign.revenue / campaign.sentCount : 0;

  const DAY = 24 * 60 * 60 * 1000;
  const dailyStats = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * DAY);
    return {
      date: d.toISOString().slice(0, 10),
      sent: Math.floor(campaign.sentCount / 7) + (i % 3 === 0 ? 2 : 0),
      responded: Math.floor(campaign.respondedCount / 7) + (i % 4 === 0 ? 1 : 0),
      booked: i % 3 === 0 ? Math.ceil(campaign.bookedCount / 4) : 0,
    };
  });

  return {
    campaignId: campaign.id,
    name: campaign.name,
    sentCount: campaign.sentCount,
    deliveredCount,
    respondedCount: campaign.respondedCount,
    bookedCount: campaign.bookedCount,
    revenue: campaign.revenue,
    responseRate: Math.round(responseRate * 100) / 100,
    bookingRate: Math.round(bookingRate * 100) / 100,
    revenuePerMessage: Math.round(revenuePerMessage * 100) / 100,
    dailyStats,
  };
}
