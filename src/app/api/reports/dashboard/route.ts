import { NextResponse } from "next/server";

import { getDashboardReport } from "@/services/reportingService";

export async function GET() {
  return NextResponse.json(getDashboardReport());
}
