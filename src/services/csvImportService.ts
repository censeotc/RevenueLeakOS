export type ImportEntity = "contacts" | "estimates";

interface CsvPreviewResult {
  headers: string[];
  rows: Record<string, string>[];
  requiredColumns: string[];
  missingColumns: string[];
}

const REQUIRED_COLUMNS: Record<ImportEntity, string[]> = {
  contacts: ["firstName", "lastName", "phone"],
  estimates: ["estimateNumber", "amount", "serviceType", "contactEmail"],
};

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (insideQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === "," && !insideQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

export function previewCsvImport(entity: ImportEntity, csvText: string): CsvPreviewResult {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return {
      headers: [],
      rows: [],
      requiredColumns: REQUIRED_COLUMNS[entity],
      missingColumns: REQUIRED_COLUMNS[entity],
    };
  }

  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1, 11).map((line) => {
    const cells = parseCsvLine(line);
    return headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = cells[index] ?? "";
      return acc;
    }, {});
  });

  const requiredColumns = REQUIRED_COLUMNS[entity];
  const missingColumns = requiredColumns.filter((column) => !headers.includes(column));

  return {
    headers,
    rows,
    requiredColumns,
    missingColumns,
  };
}

export function getCsvTemplate(entity: ImportEntity) {
  if (entity === "contacts") {
    return [
      "firstName,lastName,phone,email,address,city,state,zip,tags",
      "Jane,Doe,+13135550000,jane@example.com,123 Main St,Detroit,MI,48201,residential|hvac",
    ].join("\n");
  }

  return [
    "estimateNumber,amount,serviceType,description,status,sentAt,contactEmail",
    "EST-2026-900,2400,Furnace Repair,Heat exchanger replacement,sent,2026-03-01,jane@example.com",
  ].join("\n");
}
