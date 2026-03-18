import { NextRequest, NextResponse } from "next/server";
import { previewCsvImport } from "@/services/csvImportService";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      entity?: "contacts" | "estimates";
      csvText?: string;
    };

    if (!body.entity || !body.csvText) {
      return NextResponse.json(
        { error: "entity and csvText are required" },
        { status: 400 }
      );
    }

    if (body.entity !== "contacts" && body.entity !== "estimates") {
      return NextResponse.json({ error: "Unsupported import entity" }, { status: 400 });
    }

    const preview = previewCsvImport(body.entity, body.csvText);
    return NextResponse.json({ preview });
  } catch {
    return NextResponse.json({ error: "Could not parse CSV file" }, { status: 500 });
  }
}
