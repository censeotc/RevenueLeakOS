import { db } from "@/lib/db";
import { twilioMockService } from "./twilioMockService";
import { interpolateTemplate } from "@/lib/utils";

export interface EnrollContactInput {
  campaignId: string;
  contactId: string;
}

export async function enrollContact(input: EnrollContactInput) {
  return db.campaignEnrollment.upsert({
    where: {
      campaignId_contactId: {
        campaignId: input.campaignId,
        contactId: input.contactId,
      },
    },
    create: {
      campaignId: input.campaignId,
      contactId: input.contactId,
      status: "ACTIVE",
      currentStep: 0,
    },
    update: {
      status: "ACTIVE",
      currentStep: 0,
    },
  });
}

export async function processNextStep(enrollmentId: string) {
  const enrollment = await db.campaignEnrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      campaign: {
        include: {
          steps: { orderBy: { order: "asc" } },
          business: true,
        },
      },
      contact: true,
    },
  });

  if (!enrollment || enrollment.status !== "ACTIVE") return null;

  const { campaign, contact } = enrollment;
  const nextStepIndex = enrollment.currentStep;
  const step = campaign.steps[nextStepIndex];

  if (!step) {
    await db.campaignEnrollment.update({
      where: { id: enrollmentId },
      data: { status: "COMPLETED" },
    });
    return null;
  }

  const variables: Record<string, string> = {
    firstName: contact.firstName,
    lastName: contact.lastName,
    businessName: campaign.business.name,
    businessPhone: campaign.business.phone ?? "",
  };

  const body = interpolateTemplate(step.body, variables);
  const subject = step.subject ? interpolateTemplate(step.subject, variables) : undefined;

  if (step.type === "SMS" && contact.phone) {
    await twilioMockService.sendSms({ to: contact.phone, body });
    await db.call.create({
      data: {
        businessId: campaign.businessId,
        type: "SMS",
        direction: "OUTBOUND",
        status: "DELIVERED",
        body,
        contactId: contact.id,
      },
    });
  }

  await db.campaignEnrollment.update({
    where: { id: enrollmentId },
    data: { currentStep: nextStepIndex + 1 },
  });

  return { step, body, subject };
}

export async function markConverted(enrollmentId: string) {
  return db.campaignEnrollment.update({
    where: { id: enrollmentId },
    data: { status: "CONVERTED", convertedAt: new Date() },
  });
}

export async function getActiveCampaigns(businessId: string) {
  return db.campaign.findMany({
    where: { businessId, status: "ACTIVE" },
    include: {
      steps: { orderBy: { order: "asc" } },
      _count: { select: { enrollments: true } },
    },
  });
}
