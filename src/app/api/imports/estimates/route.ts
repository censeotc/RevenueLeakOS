import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const businessId = formData.get("businessId") as string | null;

    if (!file || !businessId) {
      return NextResponse.json({ error: "file and businessId are required" }, { status: 400 });
    }

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json({ error: "Only CSV files are supported" }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/"/g, ""));

    const requiredHeaders = ["amount"];
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
    if (missingHeaders.length > 0) {
      return NextResponse.json(
        { error: `Missing required columns: ${missingHeaders.join(", ")}` },
        { status: 400 }
      );
    }

    const rows = lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
      return headers.reduce<Record<string, string>>((obj, header, i) => {
        obj[header] = values[i] ?? "";
        return obj;
      }, {});
    });

    const { importEstimates } = await import("@/services/importService");
    const result = await importEstimates(businessId, rows);

    return NextResponse.json({
      imported: result.imported,
      skipped: result.skipped,
      errors: result.errors,
    });
  } catch (error) {
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
