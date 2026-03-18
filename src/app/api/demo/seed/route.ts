import { NextResponse } from "next/server";

import { businessProfile, calls, campaigns, contacts, estimates, integrations, opportunities, reactivationSegments, templates } from "@/data/demoData";

export async function GET() {
  return NextResponse.json({ businessProfile, opportunities, calls, estimates, reactivationSegments, campaigns, contacts, templates, integrations });
}
