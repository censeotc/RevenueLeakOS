import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { opportunityService } from "@/lib/services/opportunityService";
import { z } from "zod";

const createSchema = z.object({
  contactId: z.string(),
  type: z.enum(["missed_call", "estimate_rescue", "reactivation"]),
  title: z.string().min(1),
  serviceType: z.string().optional(),
  estimatedValue: z.number().optional(),
  description: z.string().optional(),
  assignedToId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const businessId = (session.user as any).businessId;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? undefined;
  const status = searchParams.get("status") ?? undefined;

  try {
    const opportunities = await opportunityService.getByBusiness(businessId, { type, status });
    return NextResponse.json(opportunities);
  } catch (error) {
    console.error("Failed to fetch opportunities:", error);
    return NextResponse.json({ error: "Failed to fetch opportunities" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const businessId = (session.user as any).businessId;

  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const opportunity = await opportunityService.create({
      businessId,
      ...parsed.data,
    });

    return NextResponse.json(opportunity, { status: 201 });
  } catch (error) {
    console.error("Failed to create opportunity:", error);
    return NextResponse.json({ error: "Failed to create opportunity" }, { status: 500 });
  }
}
