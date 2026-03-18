import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { campaignService } from "@/lib/services/campaignService";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const segment = String(body.segment ?? "no service in 12+ months");

  const result = await campaignService.launchReactivationCampaign({
    businessId: session.user.businessId,
    segment,
    campaignName: body.campaignName ? String(body.campaignName) : undefined,
  });

  return NextResponse.json({ ok: true, ...result });
}
