import { db } from "@/lib/db";
import type { OpportunityStatus, OpportunityType } from "@/types/revenue";

export interface CreateOpportunityInput {
  businessId: string;
  type: OpportunityType;
  value?: number;
  description?: string;
  contactId?: string;
  estimateId?: string;
  sourceRef?: string;
  dueAt?: Date;
}

export async function createOpportunity(input: CreateOpportunityInput) {
  return db.opportunity.create({
    data: {
      businessId: input.businessId,
      type: input.type as never,
      value: input.value ?? 0,
      description: input.description,
      contactId: input.contactId,
      estimateId: input.estimateId,
      sourceRef: input.sourceRef,
      dueAt: input.dueAt,
    },
    include: { contact: true, estimate: true },
  });
}

export async function updateOpportunityStatus(
  opportunityId: string,
  status: OpportunityStatus
) {
  const data: Record<string, unknown> = { status };
  if (status === "WON") {
    data.recoveredAt = new Date();
  }
  return db.opportunity.update({
    where: { id: opportunityId },
    data: data as never,
  });
}

export async function getOpenOpportunities(businessId: string, limit = 50) {
  return db.opportunity.findMany({
    where: { businessId, status: "OPEN" },
    include: { contact: true, estimate: true },
    orderBy: { value: "desc" },
    take: limit,
  });
}

export async function getOpportunityById(id: string) {
  return db.opportunity.findUnique({
    where: { id },
    include: {
      contact: true,
      estimate: true,
      notes: {
        include: { author: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function addOpportunityNote(
  opportunityId: string,
  content: string,
  authorId?: string
) {
  return db.opportunityNote.create({
    data: { opportunityId, content, authorId },
    include: { author: true },
  });
}

export async function dismissOpportunity(opportunityId: string) {
  return updateOpportunityStatus(opportunityId, "DISMISSED");
}
