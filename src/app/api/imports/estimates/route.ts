import { NextRequest, NextResponse } from "next/server";
import { importEstimates } from "@/services/importService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await importEstimates("demo-business", body.rows ?? []);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body", detail: String(error) },
      { status: 400 }
    );
  }
}
