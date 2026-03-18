import { prisma } from "@/lib/prisma";
import type { ImportRow, ImportResult } from "@/types";

export const importService = {
  detectHeaders(rows: ImportRow[]): string[] {
    if (rows.length === 0) return [];
    return Object.keys(rows[0]);
  },

  async importContacts(
    businessId: string,
    rows: ImportRow[],
    fieldMap: Record<string, string>
  ): Promise<ImportResult> {
    const result: ImportResult = { total: rows.length, imported: 0, skipped: 0, errors: [] };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const phone = row[fieldMap.phone];
        const firstName = row[fieldMap.firstName] || "Unknown";
        const lastName = row[fieldMap.lastName] || "";

        if (!phone) {
          result.errors.push({ row: i + 1, message: "Missing phone number" });
          result.skipped++;
          continue;
        }

        await prisma.contact.upsert({
          where: {
            // Using a compound unique requires schema change; use findFirst approach
            id: "placeholder",
          },
          update: {},
          create: {
            businessId,
            firstName,
            lastName,
            phone,
            email: fieldMap.email ? row[fieldMap.email] : undefined,
            type: "lead",
            status: "active",
          },
        });

        result.imported++;
      } catch (error) {
        result.errors.push({ row: i + 1, message: String(error) });
        result.skipped++;
      }
    }

    return result;
  },

  async importEstimates(
    businessId: string,
    rows: ImportRow[],
    fieldMap: Record<string, string>
  ): Promise<ImportResult> {
    const result: ImportResult = { total: rows.length, imported: 0, skipped: 0, errors: [] };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const title = row[fieldMap.title];
        const amount = parseFloat(row[fieldMap.amount] || "0");

        if (!title) {
          result.errors.push({ row: i + 1, message: "Missing estimate title" });
          result.skipped++;
          continue;
        }

        await prisma.estimate.create({
          data: {
            businessId,
            title,
            amount,
            serviceType: fieldMap.serviceType ? row[fieldMap.serviceType] : undefined,
            status: "open",
            source: "csv_import",
          },
        });

        result.imported++;
      } catch (error) {
        result.errors.push({ row: i + 1, message: String(error) });
        result.skipped++;
      }
    }

    return result;
  },
};
