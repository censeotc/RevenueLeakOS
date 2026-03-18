import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export interface OnboardingBusinessInput {
  name: string;
  industry: string;
  phone: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  timezone: string;
  ownerUserId: string;
}

export async function completeBusinessProfile(input: OnboardingBusinessInput) {
  const baseSlug = slugify(input.name);
  let slug = baseSlug;
  let attempt = 0;

  // Ensure unique slug
  while (await db.business.findUnique({ where: { slug } })) {
    attempt++;
    slug = `${baseSlug}-${attempt}`;
  }

  const business = await db.business.create({
    data: {
      name: input.name,
      slug,
      phone: input.phone,
      website: input.website,
      address: input.address,
      city: input.city,
      state: input.state,
      zip: input.zip,
      timezone: input.timezone,
    },
  });

  // Update user's business association
  await db.user.update({
    where: { id: input.ownerUserId },
    data: { businessId: business.id },
  });

  // Create default settings
  await db.businessSettings.create({
    data: {
      businessId: business.id,
      autoEnrollEstimates: true,
      smsOptInRequired: false,
      notifyOnOpportunity: true,
      notifyOnConversion: true,
    },
  });

  return business;
}

export async function seedSystemTemplates(businessId: string) {
  const systemTemplates = [
    {
      name: "Missed Call Recovery",
      type: "SMS" as const,
      body: "Hi {{firstName}}, sorry we missed your call! This is {{businessName}}. We're available now — reply or call us at {{businessPhone}}.",
      variables: ["firstName", "businessName", "businessPhone"],
    },
    {
      name: "Estimate Follow-Up #1",
      type: "SMS" as const,
      body: "Hi {{firstName}}, this is {{businessName}}. Following up on the estimate we sent for {{estimateTitle}}. Any questions? Reply or call {{businessPhone}}.",
      variables: ["firstName", "businessName", "estimateTitle", "businessPhone"],
    },
    {
      name: "Estimate Follow-Up #2",
      type: "SMS" as const,
      body: "Hi {{firstName}}, just one more follow-up on your estimate (${{estimateAmount}}). We'd love to get this scheduled — reply or call {{businessPhone}}!",
      variables: ["firstName", "estimateAmount", "businessPhone"],
    },
    {
      name: "Review Request",
      type: "SMS" as const,
      body: "Hi {{firstName}}, thanks for choosing {{businessName}}! Could you leave us a quick review? {{reviewLink}} — it really helps!",
      variables: ["firstName", "businessName", "reviewLink"],
    },
  ];

  await db.template.createMany({
    data: systemTemplates.map((t) => ({
      ...t,
      businessId,
      isSystem: true,
    })),
    skipDuplicates: true,
  });
}
