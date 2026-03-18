import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { campaignStatuses } from "@/lib/domain/types";
import { campaignService } from "@/lib/services/campaignService";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const status = String(body.status ?? "");
  if (!campaignStatuses.includes(status as (typeof campaignStatuses)[number])) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  await campaignService.updateCampaignStatus(id, status as (typeof campaignStatuses)[number]);
  return NextResponse.json({ ok: true });
}
