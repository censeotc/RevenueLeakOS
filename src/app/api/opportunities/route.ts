import { NextRequest, NextResponse } from "next/server";
import { listOpportunities } from "@/services/opportunityService";
import type { OpportunityStatus } from "@/types/revenue";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status") as OpportunityStatus | null;
  const type = searchParams.get("type");

  const opportunities = await listOpportunities("demo-business", {
    status: status ?? undefined,
    type: type ?? undefined,
  });

  return NextResponse.json(opportunities);
}
