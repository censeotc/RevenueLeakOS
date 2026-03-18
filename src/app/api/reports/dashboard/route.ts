import { NextResponse } from "next/server";
import { getDashboardData } from "@/services/reportingService";

export async function GET() {
  const data = await getDashboardData("demo-business");
  return NextResponse.json(data);
}
