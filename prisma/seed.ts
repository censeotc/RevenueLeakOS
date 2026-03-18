import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  ActivityType,
  BookingSource,
  BookingStatus,
  CallDirection,
  CallDisposition,
  CampaignStatus,
  ConnectionStatus,
  IntegrationProvider,
  MessageChannel,
  MessageDirection,
  OpportunityStatus,
  OpportunityType,
  PrismaClient,
  TemplateStatus,
  UserRole,
  EstimateStatus,
} from "@prisma/client";

import { createDemoDataset } from "../src/lib/demo-data";
import type {
  ActivityLog,
  Booking,
  CallEvent,
  Campaign,
  Contact,
  Estimate,
  IntegrationConnection,
  MessageEvent,
  Opportunity,
  Template,
} from "../src/types/domain";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run the seed script.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const roleMap: Record<string, UserRole> = {
  owner: UserRole.OWNER,
  manager: UserRole.MANAGER,
  csr: UserRole.CSR,
  readonly: UserRole.READONLY,
};

const opportunityTypeMap: Record<string, OpportunityType> = {
  missed_call: OpportunityType.MISSED_CALL,
  estimate_rescue: OpportunityType.ESTIMATE_RESCUE,
  reactivation: OpportunityType.REACTIVATION,
};

const opportunityStatusMap: Record<string, OpportunityStatus> = {
  open: OpportunityStatus.OPEN,
  attempted: OpportunityStatus.ATTEMPTED,
  responded: OpportunityStatus.RESPONDED,
  booked: OpportunityStatus.BOOKED,
  won: OpportunityStatus.WON,
  lost: OpportunityStatus.LOST,
  closed: OpportunityStatus.CLOSED,
};

const callDirectionMap: Record<string, CallDirection> = {
  inbound: CallDirection.INBOUND,
  outbound: CallDirection.OUTBOUND,
};

const callDispositionMap: Record<string, CallDisposition> = {
  missed: CallDisposition.MISSED,
  after_hours: CallDisposition.AFTER_HOURS,
  abandoned: CallDisposition.ABANDONED,
  responded: CallDisposition.RESPONDED,
  booked: CallDisposition.BOOKED,
  lost: CallDisposition.LOST,
};

const estimateStatusMap: Record<string, EstimateStatus> = {
  open: EstimateStatus.OPEN,
  stale: EstimateStatus.STALE,
  enrolled: EstimateStatus.ENROLLED,
  responded: EstimateStatus.RESPONDED,
  booked: EstimateStatus.BOOKED,
  lost: EstimateStatus.LOST,
};

const campaignStatusMap: Record<string, CampaignStatus> = {
  draft: CampaignStatus.DRAFT,
  active: CampaignStatus.ACTIVE,
  paused: CampaignStatus.PAUSED,
  completed: CampaignStatus.COMPLETED,
};

const templateStatusMap: Record<string, TemplateStatus> = {
  draft: TemplateStatus.DRAFT,
  active: TemplateStatus.ACTIVE,
  archived: TemplateStatus.ARCHIVED,
};

const messageDirectionMap: Record<string, MessageDirection> = {
  inbound: MessageDirection.INBOUND,
  outbound: MessageDirection.OUTBOUND,
};

const messageChannelMap: Record<string, MessageChannel> = {
  sms: MessageChannel.SMS,
  email: MessageChannel.EMAIL,
};

const bookingStatusMap: Record<string, BookingStatus> = {
  scheduled: BookingStatus.SCHEDULED,
  completed: BookingStatus.COMPLETED,
  canceled: BookingStatus.CANCELED,
};

const bookingSourceMap: Record<string, BookingSource> = {
  missed_call: BookingSource.MISSED_CALL,
  estimate_rescue: BookingSource.ESTIMATE_RESCUE,
  reactivation: BookingSource.REACTIVATION,
  manual: BookingSource.MANUAL,
};

const activityTypeMap: Record<string, ActivityType> = {
  alert: ActivityType.ALERT,
  opportunity_updated: ActivityType.OPPORTUNITY_UPDATED,
  message_sent: ActivityType.MESSAGE_SENT,
  message_received: ActivityType.MESSAGE_RECEIVED,
  booking_created: ActivityType.BOOKING_CREATED,
  campaign_launched: ActivityType.CAMPAIGN_LAUNCHED,
  note_added: ActivityType.NOTE_ADDED,
  call_captured: ActivityType.CALL_CAPTURED,
  estimate_enrolled: ActivityType.ESTIMATE_ENROLLED,
  integration_tested: ActivityType.INTEGRATION_TESTED,
};

const integrationProviderMap: Record<string, IntegrationProvider> = {
  twilio: IntegrationProvider.TWILIO,
  jobber: IntegrationProvider.JOBBER,
  housecall_pro: IntegrationProvider.HOUSECALL_PRO,
  service_titan: IntegrationProvider.SERVICE_TITAN,
  gmail: IntegrationProvider.GMAIL,
  outlook: IntegrationProvider.OUTLOOK,
  google_calendar: IntegrationProvider.GOOGLE_CALENDAR,
  csv_import: IntegrationProvider.CSV_IMPORT,
};

const connectionStatusMap: Record<string, ConnectionStatus> = {
  connected: ConnectionStatus.CONNECTED,
  disconnected: ConnectionStatus.DISCONNECTED,
  error: ConnectionStatus.ERROR,
};

function mapOpportunity(opportunity: Opportunity) {
  return {
    id: opportunity.id,
    businessId: opportunity.businessId,
    contactId: opportunity.contactId,
    ownerUserId: opportunity.ownerUserId,
    campaignId: opportunity.campaignId,
    type: opportunityTypeMap[opportunity.type],
    status: opportunityStatusMap[opportunity.status],
    title: opportunity.title,
    description: opportunity.description,
    priority: opportunity.priority,
    valueCents: opportunity.valueCents,
    directRevenueCents: opportunity.directRevenueCents,
    influencedRevenueCents: opportunity.influencedRevenueCents,
    sourceLabel: opportunity.sourceLabel,
    createdAt: new Date(opportunity.createdAt),
    updatedAt: new Date(opportunity.updatedAt),
    lastTouchedAt: new Date(opportunity.lastTouchedAt),
    closedAt: opportunity.closedAt ? new Date(opportunity.closedAt) : null,
  };
}

function mapContact(contact: Contact) {
  return {
    id: contact.id,
    businessId: contact.businessId,
    locationId: contact.locationId,
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    tags: contact.tags,
    notes: contact.notes,
    lifecycleStage: contact.lifecycleStage,
    lastServiceDate: contact.lastServiceDate ? new Date(contact.lastServiceDate) : null,
    lastEstimateDate: contact.lastEstimateDate ? new Date(contact.lastEstimateDate) : null,
    dormantSince: contact.dormantSince ? new Date(contact.dormantSince) : null,
    membershipRenewalDate: contact.membershipRenewalDate ? new Date(contact.membershipRenewalDate) : null,
    replacementCycleDate: contact.replacementCycleDate ? new Date(contact.replacementCycleDate) : null,
  };
}

function mapCall(call: CallEvent) {
  return {
    id: call.id,
    businessId: call.businessId,
    contactId: call.contactId,
    opportunityId: call.opportunityId,
    fromPhone: call.fromPhone,
    toPhone: call.toPhone,
    direction: callDirectionMap[call.direction],
    disposition: callDispositionMap[call.disposition],
    durationSeconds: call.durationSeconds,
    afterHours: call.afterHours,
    respondedAt: call.respondedAt ? new Date(call.respondedAt) : null,
    bookedAt: call.bookedAt ? new Date(call.bookedAt) : null,
    startedAt: new Date(call.startedAt),
    summary: call.summary,
    smsPreview: call.smsPreview,
    bookingLogged: call.bookingLogged,
  };
}

function mapEstimate(estimate: Estimate) {
  return {
    id: estimate.id,
    businessId: estimate.businessId,
    contactId: estimate.contactId,
    opportunityId: estimate.opportunityId,
    number: estimate.number,
    serviceType: estimate.serviceType,
    amountCents: estimate.amountCents,
    status: estimateStatusMap[estimate.status],
    createdAt: new Date(estimate.createdAt),
    sentAt: new Date(estimate.sentAt),
    staleSince: estimate.staleSince ? new Date(estimate.staleSince) : null,
    enrolledInFollowUp: estimate.enrolledInFollowUp,
    respondedAt: estimate.respondedAt ? new Date(estimate.respondedAt) : null,
    bookedAt: estimate.bookedAt ? new Date(estimate.bookedAt) : null,
    lostAt: estimate.lostAt ? new Date(estimate.lostAt) : null,
  };
}

function mapCampaign(campaign: Campaign) {
  return {
    id: campaign.id,
    businessId: campaign.businessId,
    name: campaign.name,
    type: opportunityTypeMap[campaign.type],
    status: campaignStatusMap[campaign.status],
    audienceLabel: campaign.audienceLabel,
    segmentKey: campaign.segmentKey,
    description: campaign.description,
    createdAt: new Date(campaign.createdAt),
    updatedAt: new Date(campaign.updatedAt),
    launchedAt: campaign.launchedAt ? new Date(campaign.launchedAt) : null,
    completedAt: campaign.completedAt ? new Date(campaign.completedAt) : null,
    metrics: campaign.metrics ?? {},
  };
}

function mapTemplate(template: Template) {
  return {
    id: template.id,
    businessId: template.businessId,
    name: template.name,
    channel: messageChannelMap[template.channel],
    status: templateStatusMap[template.status],
    subject: template.subject,
    body: template.body,
    variables: template.variables,
    archivedAt: template.archivedAt ? new Date(template.archivedAt) : null,
    createdAt: new Date(template.createdAt),
    updatedAt: new Date(template.updatedAt),
  };
}

function mapMessage(message: MessageEvent) {
  return {
    id: message.id,
    businessId: message.businessId,
    contactId: message.contactId,
    opportunityId: message.opportunityId,
    templateId: message.templateId,
    direction: messageDirectionMap[message.direction],
    channel: messageChannelMap[message.channel],
    body: message.body,
    deliveryStatus: message.deliveryStatus,
    sentAt: message.sentAt ? new Date(message.sentAt) : null,
    receivedAt: message.receivedAt ? new Date(message.receivedAt) : null,
  };
}

function mapBooking(booking: Booking) {
  return {
    id: booking.id,
    businessId: booking.businessId,
    contactId: booking.contactId,
    opportunityId: booking.opportunityId,
    bookedAt: new Date(booking.bookedAt),
    serviceDate: new Date(booking.serviceDate),
    valueCents: booking.valueCents,
    status: bookingStatusMap[booking.status],
    source: bookingSourceMap[booking.source],
    notes: booking.notes,
  };
}

function mapActivity(activity: ActivityLog) {
  return {
    id: activity.id,
    businessId: activity.businessId,
    type: activityTypeMap[activity.type],
    title: activity.title,
    detail: activity.detail,
    severity: activity.severity,
    entityType: activity.entityType,
    entityId: activity.entityId,
    createdAt: new Date(activity.createdAt),
  };
}

function mapIntegration(connection: IntegrationConnection) {
  return {
    id: connection.id,
    businessId: connection.businessId,
    provider: integrationProviderMap[connection.provider],
    status: connectionStatusMap[connection.status],
    accountLabel: connection.accountLabel,
    connectedAt: connection.connectedAt ? new Date(connection.connectedAt) : null,
    lastTestedAt: connection.lastTestedAt ? new Date(connection.lastTestedAt) : null,
    metadata: connection.metadata ?? {},
  };
}

async function main() {
  const dataset = createDemoDataset();
  const passwordHash = await bcrypt.hash(process.env.DEMO_USER_PASSWORD ?? "demo1234", 10);

  await prisma.business.deleteMany({ where: { id: dataset.business.id } });

  await prisma.business.create({
    data: {
      id: dataset.business.id,
      name: dataset.business.name,
      timezone: dataset.business.timezone,
      staleEstimateDays: dataset.business.staleEstimateDays,
      attributionWindowDays: dataset.business.attributionWindowDays,
      highValueThreshold: dataset.business.highValueThreshold,
      duplicateMissedCallWindowHours: dataset.business.duplicateMissedCallWindowHours,
      phone: dataset.business.phone,
      website: dataset.business.website,
    },
  });

  await prisma.location.createMany({
    data: dataset.locations.map((location) => ({
      id: location.id,
      businessId: location.businessId,
      name: location.name,
      address1: location.address1,
      city: location.city,
      state: location.state,
      postalCode: location.postalCode,
      isPrimary: location.isPrimary,
    })),
  });

  await prisma.user.createMany({
    data: dataset.users.map((user) => ({
      id: user.id,
      businessId: user.businessId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: roleMap[user.role],
      passwordHash: user.role === "owner" ? passwordHash : null,
    })),
  });

  await prisma.contact.createMany({ data: dataset.contacts.map(mapContact) });
  await prisma.template.createMany({ data: dataset.templates.map(mapTemplate) });
  await prisma.campaign.createMany({ data: dataset.campaigns.map(mapCampaign) });
  await prisma.campaignStep.createMany({
    data: dataset.campaignSteps.map((step) => ({
      id: step.id,
      campaignId: step.campaignId,
      stepOrder: step.stepOrder,
      channel: messageChannelMap[step.channel],
      delayHours: step.delayHours,
      templateId: step.templateId,
      bodyPreview: step.bodyPreview,
    })),
  });
  await prisma.opportunity.createMany({ data: dataset.opportunities.map(mapOpportunity) });
  await prisma.opportunityNote.createMany({
    data: dataset.opportunityNotes.map((note) => ({
      id: note.id,
      opportunityId: note.opportunityId,
      authorUserId: note.authorUserId,
      body: note.body,
      createdAt: new Date(note.createdAt),
    })),
  });
  await prisma.callEvent.createMany({ data: dataset.callEvents.map(mapCall) });
  await prisma.estimate.createMany({ data: dataset.estimates.map(mapEstimate) });
  await prisma.messageEvent.createMany({ data: dataset.messageEvents.map(mapMessage) });
  await prisma.booking.createMany({ data: dataset.bookings.map(mapBooking) });
  await prisma.activityLog.createMany({ data: dataset.activityLogs.map(mapActivity) });
  await prisma.integrationConnection.createMany({ data: dataset.integrationConnections.map(mapIntegration) });
  await prisma.reportSnapshot.createMany({
    data: dataset.reportSnapshots.map((snapshot) => ({
      id: snapshot.id,
      businessId: snapshot.businessId,
      snapshotDate: new Date(snapshot.snapshotDate),
      directRevenueCents: snapshot.directRevenueCents,
      influencedRevenueCents: snapshot.influencedRevenueCents,
      recoveredOpportunities: snapshot.recoveredOpportunities,
      bookingsCreated: snapshot.bookingsCreated,
      avgResponseTimeMinutes: snapshot.avgResponseTimeMinutes,
      estimatesReopened: snapshot.estimatesReopened,
      customersReactivated: snapshot.customersReactivated,
      workflowBreakdown: snapshot.workflowBreakdown,
    })),
  });

  console.log(
    `Seeded ${dataset.business.name} with ${dataset.contacts.length} contacts, ${dataset.opportunities.length} opportunities, and ${dataset.bookings.length} bookings.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
