import { createId, mutateDemoStore } from "@/lib/data/demo-store";
import { getDormantSegments } from "@/lib/data/selectors";
import { opportunityService } from "@/lib/services/opportunity-service";

type SaveCampaignInput = {
  name: string;
  type: "missed_call_followup" | "estimate_rescue" | "reactivation";
  segmentName?: string;
  channel: "sms" | "email";
  goal?: string;
};

export const campaignService = {
  saveCampaign(input: SaveCampaignInput) {
    const timestamp = new Date().toISOString();

    return mutateDemoStore((store) => {
      const campaignId = createId("camp");
      store.campaigns.unshift({
        id: campaignId,
        businessId: store.business.id,
        name: input.name,
        type: input.type,
        status: "draft",
        segmentName: input.segmentName,
        channel: input.channel,
        goal: input.goal,
      });

      store.campaignSteps.push({
        id: createId("step"),
        campaignId,
        position: 1,
        title: "Initial outreach",
        channel: input.channel,
        delayHours: 0,
        stopOnReply: true,
        stopOnBooking: true,
      });

      store.activityLogs.unshift({
        id: createId("activity"),
        businessId: store.business.id,
        campaignId,
        type: "campaign",
        title: "Campaign created",
        message: `${input.name} saved as draft.`,
        createdAt: timestamp,
      });
    });
  },

  updateCampaignStatus(campaignId: string, status: "draft" | "scheduled" | "active" | "paused" | "completed") {
    return mutateDemoStore((store) => {
      const campaign = store.campaigns.find((item) => item.id === campaignId);
      if (!campaign) return;
      campaign.status = status;
      if (status === "active") {
        campaign.launchedAt = new Date().toISOString();
      }
      if (status === "completed") {
        campaign.completedAt = new Date().toISOString();
      }
    });
  },

  launchReactivationCampaign(segmentId: string) {
    const segment = getDormantSegments().find((item) => item.id === segmentId);
    if (!segment) return;

    const timestamp = new Date().toISOString();

    mutateDemoStore((store) => {
      const campaignId = createId("camp");
      store.campaigns.unshift({
        id: campaignId,
        businessId: store.business.id,
        name: `${segment.name} Launch`,
        type: "reactivation",
        status: "active",
        segmentName: segment.name,
        channel: "sms",
        goal: "Recover dormant demand",
        launchedAt: timestamp,
      });

      store.campaignSteps.push(
        {
          id: createId("step"),
          campaignId,
          position: 1,
          title: "Initial SMS offer",
          channel: "sms",
          delayHours: 0,
          stopOnReply: true,
          stopOnBooking: true,
        },
        {
          id: createId("step"),
          campaignId,
          position: 2,
          title: "Reminder follow-up",
          channel: "sms",
          delayHours: 48,
          stopOnReply: true,
          stopOnBooking: true,
        },
      );

      store.activityLogs.unshift({
        id: createId("activity"),
        businessId: store.business.id,
        campaignId,
        type: "campaign",
        title: "Reactivation campaign launched",
        message: `${segment.name} launched for ${segment.contacts.length} contacts.`,
        createdAt: timestamp,
      });
    });

    opportunityService.createReactivationOpportunities(segmentId);
  },

  duplicateTemplate(templateId: string) {
    return mutateDemoStore((store) => {
      const template = store.templates.find((item) => item.id === templateId);
      if (!template) return;
      store.templates.unshift({
        ...template,
        id: createId("tpl"),
        name: `${template.name} Copy`,
      });
    });
  },

  archiveTemplate(templateId: string) {
    return mutateDemoStore((store) => {
      const template = store.templates.find((item) => item.id === templateId);
      if (!template) return;
      template.isArchived = true;
    });
  },

  setIntegrationStatus(
    integrationId: string,
    status: "connected" | "disconnected" | "error" | "pending",
  ) {
    return mutateDemoStore((store) => {
      const integration = store.integrationConnections.find((item) => item.id === integrationId);
      if (!integration) return;
      integration.status = status;
      integration.lastSyncAt = new Date().toISOString();
      integration.errorMessage = status === "error" ? "Mock connection test failed." : undefined;
    });
  },
};
