import type { z } from "zod";

import { contactImportRowSchema } from "@/lib/validators/contact";
import { estimateImportRowSchema } from "@/lib/validators/estimate";

export function summarizeContactImport(rows: z.infer<typeof contactImportRowSchema>[]) {
  return { importedRows: rows.length, uniquePhones: new Set(rows.map((row) => row.phone)).size };
}
export function summarizeEstimateImport(rows: z.infer<typeof estimateImportRowSchema>[]) {
  return { importedRows: rows.length, totalPipelineCents: rows.reduce((sum, row) => sum + row.amountCents, 0) };
}
