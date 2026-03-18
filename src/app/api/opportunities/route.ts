import { NextResponse } from "next/server";

import { getOpportunitySnapshot } from "@/services/opportunityService";

export async function GET() {
  return NextResponse.json(getOpportunitySnapshot());
}
