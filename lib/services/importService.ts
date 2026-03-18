import { parse } from "csv-parse/sync";

type Row = Record<string, string>;

function normalizeHeaders(headers: string[]) {
  return headers.map((header) => header.trim().toLowerCase());
}

export const importService = {
  detectHeaders(csvText: string) {
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Row[];
    const first = records[0] ?? {};
    return Object.keys(first);
  },

  mapFields(headers: string[], kind: "contacts" | "estimates") {
    const normalized = normalizeHeaders(headers);
    if (kind === "contacts") {
      return {
        firstName: headers[normalized.indexOf("first_name")] ?? headers[0] ?? "",
        lastName: headers[normalized.indexOf("last_name")] ?? headers[1] ?? "",
        phone: headers[normalized.indexOf("phone")] ?? headers[2] ?? "",
        email: headers[normalized.indexOf("email")] ?? "",
      };
    }
    return {
      contactEmail: headers[normalized.indexOf("contact_email")] ?? headers[0] ?? "",
      amount: headers[normalized.indexOf("amount")] ?? headers[1] ?? "",
      serviceType: headers[normalized.indexOf("service_type")] ?? headers[2] ?? "",
      sentAt: headers[normalized.indexOf("sent_at")] ?? "",
    };
  },

  validateRows(csvText: string, requiredFields: string[]) {
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Row[];

    const errors: Array<{ row: number; message: string }> = [];
    records.forEach((record, index) => {
      for (const field of requiredFields) {
        if (!record[field]) {
          errors.push({
            row: index + 2,
            message: `Missing required field "${field}"`,
          });
        }
      }
    });

    return {
      totalRows: records.length,
      errors,
      preview: records.slice(0, 5),
    };
  },
};
