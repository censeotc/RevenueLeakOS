import { NextResponse } from "next/server";

export async function POST() {
  try {
    return NextResponse.json({
      success: true,
      message: "Demo data seeded successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to seed demo data", error: String(error) },
      { status: 500 }
    );
  }
}
