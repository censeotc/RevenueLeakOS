import { db } from "@/lib/db";

export interface ImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}

export async function importContacts(
  businessId: string,
  rows: Record<string, string>[]
): Promise<ImportResult> {
  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const row of rows) {
    const firstName = row["firstname"] ?? row["first_name"] ?? row["firstName"] ?? "";
    const lastName = row["lastname"] ?? row["last_name"] ?? row["lastName"] ?? "";

    if (!firstName || !lastName) {
      skipped++;
      continue;
    }

    try {
      await db.contact.create({
        data: {
          businessId,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: row["email"]?.trim() || null,
          phone: row["phone"]?.trim() || null,
          address: row["address"]?.trim() || null,
          city: row["city"]?.trim() || null,
          state: row["state"]?.trim() || null,
          zip: row["zip"]?.trim() || null,
          source: "csv_import",
        },
      });
      imported++;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      errors.push(`Row ${imported + skipped + 1}: ${msg}`);
      skipped++;
    }
  }

  return { imported, skipped, errors };
}

export async function importEstimates(
  businessId: string,
  rows: Record<string, string>[]
): Promise<ImportResult> {
  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const row of rows) {
    const amountStr = row["amount"] ?? "";
    const amount = parseFloat(amountStr.replace(/[$,]/g, ""));

    if (isNaN(amount)) {
      skipped++;
      errors.push(`Row ${imported + skipped}: invalid amount "${amountStr}"`);
      continue;
    }

    try {
      await db.estimate.create({
        data: {
          businessId,
          externalId: row["id"] ?? row["externalid"] ?? null,
          title: row["title"] ?? row["description"] ?? null,
          amount,
          status: "PENDING",
          notes: row["notes"] ?? null,
        },
      });
      imported++;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      errors.push(`Row ${imported + skipped + 1}: ${msg}`);
      skipped++;
    }
  }

  return { imported, skipped, errors };
}
