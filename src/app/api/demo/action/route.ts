import { NextResponse } from "next/server";

import { performDemoAction } from "@/lib/demo-data";

export async function POST(request: Request) {
  const payload = await request.json();
  const result = performDemoAction(payload);
  return NextResponse.json({ ok: true, result });
}
