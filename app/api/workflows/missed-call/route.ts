import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { opportunityService } from "@/lib/services/opportunityService";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const fromNumber = String(body.fromNumber ?? "");
  const toNumber = String(body.toNumber ?? "+13135550111");

  if (!fromNumber) {
    return NextResponse.json({ error: "fromNumber is required" }, { status: 400 });
  }

  const result = await opportunityService.runMissedCallWorkflow({
    businessId: session.user.businessId,
    fromNumber,
    toNumber,
    intakeSummary: body.intakeSummary ? String(body.intakeSummary) : undefined,
  });

  return NextResponse.json(result);
}
