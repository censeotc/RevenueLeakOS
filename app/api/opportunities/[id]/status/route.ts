import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { opportunityStatuses } from "@/lib/domain/types";
import { opportunityService } from "@/lib/services/opportunityService";

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
  if (!opportunityStatuses.includes(status as (typeof opportunityStatuses)[number])) {
    return NextResponse.json({ error: "Invalid opportunity status" }, { status: 400 });
  }

  await opportunityService.updateStatus(id, status as (typeof opportunityStatuses)[number]);
  return NextResponse.json({ ok: true });
}
