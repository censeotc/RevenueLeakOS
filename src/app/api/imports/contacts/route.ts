import { NextRequest, NextResponse } from "next/server";
import { importContacts } from "@/services/importService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await importContacts("demo-business", body.rows ?? []);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body", detail: String(error) },
      { status: 400 }
    );
  }
}
