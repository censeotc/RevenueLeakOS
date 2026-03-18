import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  dashboardSummary as fallbackDashboardSummary,
  demoActivityLogs,
  demoAlerts,
  demoBookings,
  demoBusiness,
  demoCallEvents,
  demoCampaigns,
  demoContacts,
  demoEstimates,
  demoIntegrations,
  demoMessages,
  demoOpportunities,
  demoReportSnapshots,
  demoTemplates,
  demoUsers,
} from "@/lib/demo-data";
import { DEMO_BUSINESS_ID } from "@/lib/demo-session";

export interface PilotDataSnapshot {
  business: typeof demoBusiness;
  users: typeof demoUsers;
  contacts: typeof demoContacts;
  opportunities: typeof demoOpportunities;
  callEvents: typeof demoCallEvents;
  estimates: typeof demoEstimates;
  templates: typeof demoTemplates;
  campaigns: typeof demoCampaigns;
  messages: typeof demoMessages;
  bookings: typeof demoBookings;
  activityLogs: typeof demoActivityLogs;
  integrations: typeof demoIntegrations;
  reportSnapshots: typeof demoReportSnapshots;
  alerts: typeof demoAlerts;
  dashboardSummary: typeof fallbackDashboardSummary;
}

const integrationMeta: Record<
  string,
  {
    name: string;
    description: string;
    icon: string;
  }
> = {
  twilio: { name: "Twilio", description: "SMS and voice communication", icon: "phone" },
  google_calendar: { name: "Google Calendar", description: "Appointment scheduling", icon: "calendar" },
  jobber: { name: "Jobber", description: "Field service management", icon: "briefcase" },
  housecall_pro: { name: "Housecall Pro", description: "Home service business management", icon: "home" },
  service_titan: { name: "ServiceTitan", description: "Trades business management", icon: "wrench" },
  gmail: { name: "Gmail", description: "Email communication", icon: "mail" },
  outlook: { name: "Outlook", description: "Email and calendar", icon: "mail" },
  csv_import: { name: "CSV Import", description: "Bulk data import", icon: "upload" },
};

function buildFallbackSnapshot(): PilotDataSnapshot {
  return {
    business: demoBusiness,
    users: demoUsers,
    contacts: demoContacts,
    opportunities: demoOpportunities,
    callEvents: demoCallEvents,
    estimates: demoEstimates,
    templates: demoTemplates,
    campaigns: demoCampaigns,
    messages: demoMessages,
    bookings: demoBookings,
    activityLogs: demoActivityLogs,
    integrations: demoIntegrations,
    reportSnapshots: demoReportSnapshots,
    alerts: demoAlerts,
    dashboardSummary: fallbackDashboardSummary,
  };
}

function buildDashboardSummary(
  reportSnapshots: PilotDataSnapshot["reportSnapshots"],
  opportunities: PilotDataSnapshot["opportunities"],
  bookings: PilotDataSnapshot["bookings"]
) {
  const currentSnapshot = reportSnapshots[0];

  if (currentSnapshot) {
    return {
      revenueInfluenced: currentSnapshot.revenueInfluenced,
      opportunitiesRecovered: currentSnapshot.opportunitiesRecovered,
      bookingsCreated: currentSnapshot.bookingsCreated,
      avgResponseMinutes: currentSnapshot.avgResponseMinutes,
      estimatesReopened: currentSnapshot.estimatesReopened,
      customersReactivated: currentSnapshot.customersReactivated,
    };
  }

  return {
    revenueInfluenced: bookings.reduce((sum, booking) => sum + (booking.estimatedValue || 0), 0),
    opportunitiesRecovered: opportunities.filter((opportunity) =>
      ["booked", "won"].includes(opportunity.status)
    ).length,
    bookingsCreated: bookings.length,
    avgResponseMinutes: fallbackDashboardSummary.avgResponseMinutes,
    estimatesReopened: opportunities.filter((opportunity) => opportunity.type === "estimate_rescue").length,
    customersReactivated: opportunities.filter((opportunity) => opportunity.type === "reactivation").length,
  };
}

function buildAlerts(
  business: PilotDataSnapshot["business"],
  contacts: PilotDataSnapshot["contacts"],
  opportunities: PilotDataSnapshot["opportunities"],
  estimates: PilotDataSnapshot["estimates"],
  campaigns: PilotDataSnapshot["campaigns"]
): PilotDataSnapshot["alerts"] {
  const contactsById = new Map(contacts.map((contact) => [contact.id, contact]));
  const alerts: PilotDataSnapshot["alerts"] = [];

  opportunities
    .filter((opportunity) => opportunity.type === "missed_call" && opportunity.status === "new")
    .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())
    .slice(0, 2)
    .forEach((opportunity, index) => {
      const contact = contactsById.get(opportunity.contactId);
      alerts.push({
        id: `alert_missed_${opportunity.id}`,
        type: "missed_call",
        title: index === 0 ? "New missed call" : "Missed call still open",
        description: `${contact?.firstName || "Customer"} ${contact?.lastName || ""} called ${Math.max(
          1,
          Math.round((Date.now() - opportunity.createdAt.getTime()) / 3600000)
        )} hour${Date.now() - opportunity.createdAt.getTime() >= 7200000 ? "s" : ""} ago`,
        timestamp: opportunity.createdAt,
        read: false,
        linkTo: "/opportunities",
      });
    });

  const stalestEstimate = estimates
    .filter((estimate) => estimate.status === "stale")
    .sort((left, right) => left.sentAt.getTime() - right.sentAt.getTime())[0];

  if (stalestEstimate) {
    const contact = contactsById.get(stalestEstimate.contactId);
    alerts.push({
      id: `alert_estimate_${stalestEstimate.id}`,
      type: "stale_estimate",
      title: "Estimate going stale",
      description: `${stalestEstimate.estimateNumber || "Estimate"} for ${
        contact ? `${contact.firstName} ${contact.lastName}` : "customer"
      }`,
      timestamp: stalestEstimate.sentAt,
      read: false,
      linkTo: "/estimates",
    });
  }

  const highValueOpportunity = opportunities.find(
    (opportunity) =>
      opportunity.estimatedValue >= business.highValueThreshold &&
      ["responded", "contacted", "in_progress"].includes(opportunity.status)
  );

  if (highValueOpportunity) {
    const contact = contactsById.get(highValueOpportunity.contactId);
    alerts.push({
      id: `alert_high_value_${highValueOpportunity.id}`,
      type: "high_value",
      title: "High-value opportunity",
      description: `${contact ? `${contact.firstName} ${contact.lastName}` : "Customer"} is active on a ${highValueOpportunity.type.replaceAll("_", " ")}`,
      timestamp: highValueOpportunity.createdAt,
      read: true,
      linkTo: "/opportunities",
    });
  }

  const leadingCampaign = campaigns
    .filter((campaign) => campaign.status === "active")
    .sort((left, right) => right.bookedCount - left.bookedCount)[0];

  if (leadingCampaign) {
    alerts.push({
      id: `alert_campaign_${leadingCampaign.id}`,
      type: "campaign_complete",
      title: "Campaign milestone",
      description: `${leadingCampaign.name}: ${leadingCampaign.bookedCount} bookings from ${leadingCampaign.targetCount} targets`,
      timestamp: new Date(),
      read: true,
      linkTo: "/campaigns",
    });
  }

  return alerts.length > 0 ? alerts : demoAlerts;
}

export async function getPilotDataSnapshot(
  businessId = DEMO_BUSINESS_ID
): Promise<PilotDataSnapshot> {
  noStore();

  if (!process.env.DATABASE_URL) {
    return buildFallbackSnapshot();
  }

  try {
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return buildFallbackSnapshot();
    }

    const [
      users,
      contacts,
      opportunities,
      callEvents,
      estimates,
      templates,
      campaigns,
      messages,
      bookings,
      activityLogs,
      integrations,
      reportSnapshots,
    ] = await Promise.all([
      prisma.user.findMany({ where: { businessId }, orderBy: [{ role: "asc" }, { name: "asc" }] }),
      prisma.contact.findMany({ where: { businessId }, orderBy: [{ firstName: "asc" }, { lastName: "asc" }] }),
      prisma.opportunity.findMany({ where: { businessId }, orderBy: { createdAt: "desc" } }),
      prisma.callEvent.findMany({ where: { businessId }, orderBy: { callTime: "desc" } }),
      prisma.estimate.findMany({ where: { businessId }, orderBy: { sentAt: "desc" } }),
      prisma.template.findMany({ where: { businessId }, orderBy: { name: "asc" } }),
      prisma.campaign.findMany({
        where: { businessId },
        include: {
          steps: {
            orderBy: { stepOrder: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.messageEvent.findMany({ where: { businessId }, orderBy: { sentAt: "desc" } }),
      prisma.booking.findMany({ where: { businessId }, orderBy: { scheduledAt: "desc" } }),
      prisma.activityLog.findMany({ where: { businessId }, orderBy: { createdAt: "desc" } }),
      prisma.integrationConnection.findMany({ where: { businessId }, orderBy: { provider: "asc" } }),
      prisma.reportSnapshot.findMany({ where: { businessId }, orderBy: { periodEnd: "desc" } }),
    ]);

    const snapshot: PilotDataSnapshot = {
      business: {
        id: business.id,
        name: business.name,
        phone: business.phone || "",
        email: business.email || "",
        timezone: business.timezone,
        staleEstimateDays: business.staleEstimateDays,
        attributionWindowDays: business.attributionWindowDays,
        highValueThreshold: business.highValueThreshold,
        missedCallSuppressionHours: business.missedCallSuppressionHours,
        address: business.address || "",
        city: business.city || "",
        state: business.state || "",
        zip: business.zip || "",
      },
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || "",
      })),
      contacts: contacts.map((contact) => ({
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phone: contact.phone || "",
        email: contact.email || "",
        address: contact.address || "",
        city: contact.city || "",
        state: contact.state || "",
        zip: contact.zip || "",
        tags: contact.tags,
        source: contact.source || "import",
        lastServiceDate: contact.lastServiceDate || undefined,
        lifetimeValue: contact.lifetimeValue,
      })),
      opportunities: opportunities.map((opportunity) => ({
        id: opportunity.id,
        type: opportunity.type,
        status: opportunity.status,
        title: opportunity.title,
        description: opportunity.description || "",
        estimatedValue: opportunity.estimatedValue,
        actualValue: opportunity.actualValue,
        source: opportunity.source || "workflow",
        contactId: opportunity.contactId,
        assignedToId: opportunity.assignedToId,
        createdAt: opportunity.createdAt,
        resolvedAt: opportunity.resolvedAt,
      })),
      callEvents: callEvents.map((callEvent) => ({
        id: callEvent.id,
        callerNumber: callEvent.callerNumber,
        calledNumber: callEvent.calledNumber,
        direction: callEvent.direction,
        status: callEvent.status,
        duration: callEvent.duration,
        callerName: callEvent.callerName,
        callTime: callEvent.callTime,
        contactId: callEvent.contactId,
        opportunityId: callEvent.opportunityId,
      })),
      estimates: estimates.map((estimate) => ({
        id: estimate.id,
        estimateNumber: estimate.estimateNumber || null,
        amount: estimate.amount,
        serviceType: estimate.serviceType,
        description: estimate.description || "",
        status: estimate.status,
        sentAt: estimate.sentAt,
        viewedAt: estimate.viewedAt,
        followUpCount: estimate.followUpCount,
        contactId: estimate.contactId,
        opportunityId: estimate.opportunityId,
      })),
      templates: templates.map((template) => ({
        id: template.id,
        name: template.name,
        type: template.type,
        subject: template.subject,
        body: template.body,
        variables: template.variables,
        isArchived: template.isArchived,
      })),
      campaigns: campaigns.map((campaign) => ({
        id: campaign.id,
        name: campaign.name,
        description: campaign.description || "",
        type: campaign.type,
        status: campaign.status,
        targetCount: campaign.targetCount,
        sentCount: campaign.sentCount,
        responseCount: campaign.responseCount,
        bookedCount: campaign.bookedCount,
        steps: campaign.steps.map((step) => ({
          id: step.id,
          stepOrder: step.stepOrder,
          type: step.type,
          templateId: step.templateId,
          delayHours: step.delayHours,
        })),
      })),
      messages: messages.map((message) => ({
        id: message.id,
        channel: message.channel,
        direction: message.direction,
        toNumber: message.toNumber,
        fromNumber: message.fromNumber,
        body: message.body,
        contactId: message.contactId,
        opportunityId: message.opportunityId,
        sentAt: message.sentAt,
      })),
      bookings: bookings.map((booking) => ({
        id: booking.id,
        title: booking.title,
        description: booking.description || "",
        scheduledAt: booking.scheduledAt,
        duration: booking.duration,
        serviceType: booking.serviceType || "Service",
        estimatedValue: booking.estimatedValue || 0,
        status: booking.status,
        contactId: booking.contactId,
        opportunityId: booking.opportunityId,
        bookedById: booking.bookedById,
      })),
      activityLogs: activityLogs.map((activityLog) => ({
        id: activityLog.id,
        action: activityLog.action,
        entityType: activityLog.entityType,
        entityId: activityLog.entityId,
        metadata: activityLog.metadata ? JSON.parse(activityLog.metadata) : {},
        createdAt: activityLog.createdAt,
      })),
      integrations: integrations.map((integration) => ({
        provider: integration.provider,
        status: integration.status,
        lastSyncAt: integration.lastSyncAt,
        name: integrationMeta[integration.provider]?.name || integration.provider,
        description:
          integrationMeta[integration.provider]?.description || "Pilot integration connection",
        icon: integrationMeta[integration.provider]?.icon || "plug",
      })),
      reportSnapshots: reportSnapshots.map((snapshotRow) => ({
        periodStart: snapshotRow.periodStart,
        periodEnd: snapshotRow.periodEnd,
        revenueInfluenced: snapshotRow.revenueInfluenced,
        revenueRecovered: snapshotRow.revenueRecovered,
        opportunitiesCreated: snapshotRow.opportunitiesCreated,
        opportunitiesRecovered: snapshotRow.opportunitiesRecovered,
        bookingsCreated: snapshotRow.bookingsCreated,
        avgResponseMinutes: snapshotRow.avgResponseMinutes,
        estimatesReopened: snapshotRow.estimatesReopened,
        customersReactivated: snapshotRow.customersReactivated,
        missedCallsHandled: snapshotRow.missedCallsHandled,
        conversionRate: snapshotRow.conversionRate,
      })),
      alerts: demoAlerts,
      dashboardSummary: fallbackDashboardSummary,
    };

    snapshot.dashboardSummary = buildDashboardSummary(
      snapshot.reportSnapshots,
      snapshot.opportunities,
      snapshot.bookings
    );
    snapshot.alerts = buildAlerts(
      snapshot.business,
      snapshot.contacts,
      snapshot.opportunities,
      snapshot.estimates,
      snapshot.campaigns
    );

    return snapshot;
  } catch (error) {
    console.warn("Falling back to in-repo demo data because seeded data was unavailable", error);
    return buildFallbackSnapshot();
  }
}
