import { NextRequest, NextResponse } from "next/server";
import {
  getCsvImportScaffold,
  parseCsvPreview,
  type CsvImportEntity,
} from "@/services/csv-import";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const entity = body.entity as CsvImportEntity;
    const csvText = body.csvText as string;

    if (!entity || !["contacts", "estimates"].includes(entity)) {
      return NextResponse.json({ error: "A valid entity is required" }, { status: 400 });
    }

    if (!csvText) {
      return NextResponse.json({ error: "csvText is required" }, { status: 400 });
    }

    return NextResponse.json({
      scaffold: getCsvImportScaffold(entity),
      previewRows: parseCsvPreview(csvText),
    });
  } catch (error) {
    console.error("CSV import preview error:", error);
    return NextResponse.json({ error: "Unable to preview CSV import" }, { status: 500 });
  }
}
