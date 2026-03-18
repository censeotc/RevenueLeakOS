import { prisma } from "@/lib/prisma";
import { getDashboardData, getReportsData } from "@/lib/services/revenueleak";

type WalkthroughStep = {
  key:
    | "missed_call"
    | "opportunity_created"
    | "sms_sent"
    | "reply_received"
    | "booking_logged"
    | "dashboard_updated";
  label: string;
  done: boolean;
  detail: string;
  timestamp: Date | null;
};

type DemoWalkthroughData = {
  opportunityId: string | null;
  contactName: string | null;
  opportunityTitle: string | null;
  steps: WalkthroughStep[];
  kpis: {
    bookingsCreated: number;
    opportunitiesRecovered: number;
    revenueInfluenced: number;
  };
};

export async function getBusinessProfile(businessId: string) {
  return prisma.business.findUnique({
    where: { id: businessId },
    select: {
      id: true,
      name: true,
      timezone: true,
      staleEstimateDays: true,
      attributionWindowDays: true,
    },
  });
}

export async function getDemoWalkthroughData(
  businessId: string,
): Promise<DemoWalkthroughData> {
  const [workflowOpportunity, dashboardData] = await Promise.all([
    prisma.opportunity.findFirst({
      where: { businessId, type: "missed_call" },
      include: {
        contact: true,
        callEvents: { orderBy: { occurredAt: "desc" }, take: 1 },
        messageEvents: { orderBy: { createdAt: "asc" } },
        bookings: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { lastActivityAt: "desc" },
    }),
    getDashboardData(businessId),
  ]);

  const latestCallEvent = workflowOpportunity?.callEvents[0] ?? null;
  const outboundSms =
    workflowOpportunity?.messageEvents.find((message) => message.direction === "outbound") ?? null;
  const inboundReply =
    workflowOpportunity?.messageEvents.find((message) => message.direction === "inbound") ?? null;
  const latestBooking = workflowOpportunity?.bookings[0] ?? null;

  return {
    opportunityId: workflowOpportunity?.id ?? null,
    contactName: workflowOpportunity?.contact
      ? `${workflowOpportunity.contact.firstName} ${workflowOpportunity.contact.lastName}`
      : null,
    opportunityTitle: workflowOpportunity?.title ?? null,
    steps: [
      {
        key: "missed_call",
        label: "Missed call captured",
        done: Boolean(latestCallEvent),
        detail: latestCallEvent
          ? `${latestCallEvent.fromNumber} -> ${latestCallEvent.toNumber}`
          : "No missed call event captured yet.",
        timestamp: latestCallEvent?.occurredAt ?? null,
      },
      {
        key: "opportunity_created",
        label: "Opportunity created",
        done: Boolean(workflowOpportunity),
        detail: workflowOpportunity?.title ?? "No missed-call opportunity found yet.",
        timestamp: workflowOpportunity?.createdAt ?? null,
      },
      {
        key: "sms_sent",
        label: "SMS sent",
        done: Boolean(outboundSms),
        detail: outboundSms?.body ?? "No outbound SMS sent yet.",
        timestamp: outboundSms?.sentAt ?? outboundSms?.createdAt ?? null,
      },
      {
        key: "reply_received",
        label: "Reply received",
        done: Boolean(inboundReply),
        detail: inboundReply?.body ?? "No inbound SMS reply received yet.",
        timestamp: inboundReply?.receivedAt ?? inboundReply?.createdAt ?? null,
      },
      {
        key: "booking_logged",
        label: "Booking logged",
        done: Boolean(latestBooking),
        detail: latestBooking
          ? `Revenue: $${Number(latestBooking.revenue).toFixed(2)}`
          : "No booking logged for this opportunity yet.",
        timestamp: latestBooking?.createdAt ?? null,
      },
      {
        key: "dashboard_updated",
        label: "Dashboard updated",
        done: dashboardData.kpis.bookingsCreated > 0,
        detail:
          dashboardData.kpis.bookingsCreated > 0
            ? `Bookings ${dashboardData.kpis.bookingsCreated} • Influenced $${dashboardData.kpis.revenueInfluenced.toFixed(2)}`
            : "Dashboard KPIs are waiting for a completed booking.",
        timestamp:
          dashboardData.recentActivity.find((item) => item.action === "booking_created")?.createdAt ?? null,
      },
    ],
    kpis: {
      bookingsCreated: dashboardData.kpis.bookingsCreated,
      opportunitiesRecovered: dashboardData.kpis.opportunitiesRecovered,
      revenueInfluenced: dashboardData.kpis.revenueInfluenced,
    },
  };
}

export const reportingService = {
  getDashboardData,
  getReportsData,
  getBusinessProfile,
  getDemoWalkthroughData,
};

export { getDashboardData, getReportsData };
