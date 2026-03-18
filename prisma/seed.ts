import { hash } from "bcryptjs";
import { Prisma, PrismaClient } from "@prisma/client";

import { buildDemoTenantData } from "@/lib/demo/build-demo-tenant";

const prisma = new PrismaClient();

async function main() {
  const data = buildDemoTenantData();

  await prisma.$transaction([
    prisma.activityLog.deleteMany(),
    prisma.booking.deleteMany(),
    prisma.messageEvent.deleteMany(),
    prisma.campaignStep.deleteMany(),
    prisma.campaign.deleteMany(),
    prisma.template.deleteMany(),
    prisma.callEvent.deleteMany(),
    prisma.estimate.deleteMany(),
    prisma.opportunityNote.deleteMany(),
    prisma.opportunity.deleteMany(),
    prisma.integrationConnection.deleteMany(),
    prisma.reportSnapshot.deleteMany(),
    prisma.contact.deleteMany(),
    prisma.location.deleteMany(),
    prisma.user.deleteMany(),
    prisma.business.deleteMany(),
  ]);

  await prisma.business.create({
    data: {
      id: data.business.id,
      name: data.business.name,
      industry: data.business.industry,
      timezone: data.business.timezone,
      staleEstimateDays: data.business.staleEstimateDays,
      attributionWindowDays: data.business.attributionWindowDays,
      highValueThreshold: data.business.highValueThreshold,
      duplicateMissedCallSuppressionHours:
        data.business.duplicateMissedCallSuppressionHours,
    },
  });

  for (const user of data.users) {
    await prisma.user.create({
      data: {
        id: user.id,
        businessId: user.businessId,
        name: user.name,
        email: user.email,
        passwordHash: await hash(user.password, 10),
        role: user.role,
      },
    });
  }

  await prisma.location.createMany({ data: data.locations });
  await prisma.contact.createMany({ data: data.contacts });
  await prisma.template.createMany({ data: data.templates });
  await prisma.campaign.createMany({ data: data.campaigns });
  await prisma.campaignStep.createMany({ data: data.campaignSteps });
  await prisma.opportunity.createMany({ data: data.opportunities });
  await prisma.opportunityNote.createMany({ data: data.opportunityNotes });
  await prisma.callEvent.createMany({ data: data.callEvents });
  await prisma.estimate.createMany({ data: data.estimates });
  await prisma.messageEvent.createMany({ data: data.messageEvents });
  await prisma.booking.createMany({ data: data.bookings });
  await prisma.activityLog.createMany({
    data: data.activityLogs.map((activity) => ({
      ...activity,
      metadata: activity.metadata as Prisma.InputJsonValue | undefined,
    })),
  });
  await prisma.integrationConnection.createMany({
    data: data.integrationConnections.map((integration) => ({
      ...integration,
      config: integration.config as Prisma.InputJsonValue | undefined,
    })),
  });

  for (const snapshot of data.reportSnapshots) {
    await prisma.reportSnapshot.create({
      data: {
        ...snapshot,
        workflowBreakdown: snapshot.workflowBreakdown,
        trend: snapshot.trend,
      },
    });
  }

  console.log("Seeded demo tenant:", data.business.name);
  console.log("Demo users:");
  for (const user of data.users) {
    console.log(`- ${user.email} / ${user.password} (${user.role})`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
