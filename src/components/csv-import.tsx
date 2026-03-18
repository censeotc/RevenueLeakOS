"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import {
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Loader2,
} from "lucide-react";

type ImportMode = "contacts" | "estimates";

interface ContactRow {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  tags?: string;
  source?: string;
  lifetimeValue?: string;
}

interface EstimateRow {
  estimateNumber: string;
  contactFirstName: string;
  contactLastName: string;
  contactPhone: string;
  amount: string;
  serviceType: string;
  description?: string;
  status?: string;
  sentAt?: string;
}

interface ParsedRow {
  row: number;
  data: Record<string, string>;
  errors: string[];
  valid: boolean;
}

const CONTACT_HEADERS = ["firstName", "lastName", "phone", "email", "address", "city", "state", "zip", "tags", "source", "lifetimeValue"];
const ESTIMATE_HEADERS = ["estimateNumber", "contactFirstName", "contactLastName", "contactPhone", "amount", "serviceType", "description", "status", "sentAt"];

const CONTACT_REQUIRED = ["firstName", "lastName", "phone"];
const ESTIMATE_REQUIRED = ["estimateNumber", "contactPhone", "amount", "serviceType"];

const SAMPLE_CONTACTS_CSV = `firstName,lastName,phone,email,address,city,state,zip,tags,source,lifetimeValue
John,Smith,+13135551234,jsmith@email.com,123 Main St,Detroit,MI,48201,hvac,google,2500
Mary,Jones,+13135555678,mjones@email.com,456 Oak Ave,Grosse Pointe,MI,48236,"hvac,plumbing",referral,4800`;

const SAMPLE_ESTIMATES_CSV = `estimateNumber,contactFirstName,contactLastName,contactPhone,amount,serviceType,description,status,sentAt
EST-2026-011,Tom,Williams,+13135559000,1500,Furnace Repair,Heat exchanger replacement,sent,2026-03-10
EST-2026-012,Alice,Brown,+13135558000,3200,Water Heater,Tankless water heater install,stale,2026-03-01`;

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.trim().split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return { headers: [], rows: [] };

  const parseRow = (line: string): string[] => {
    const result: string[] = [];
    let inQuotes = false;
    let current = "";
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseRow(lines[0]);
  const rows = lines.slice(1).map(parseRow);
  return { headers, rows };
}

function validateRow(
  row: string[],
  headers: string[],
  required: string[],
  rowIndex: number
): ParsedRow {
  const data: Record<string, string> = {};
  headers.forEach((h, i) => {
    data[h] = row[i] ?? "";
  });

  const errors: string[] = [];
  required.forEach((field) => {
    if (!data[field]?.trim()) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  return { row: rowIndex + 2, data, errors, valid: errors.length === 0 };
}

interface CSVImportProps {
  mode: ImportMode;
  onClose: () => void;
  onImport?: (rows: ParsedRow[]) => void;
}

export function CSVImport({ mode, onClose, onImport }: CSVImportProps) {
  const { success, error: toastError, warning } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [step, setStep] = useState<"upload" | "preview" | "done">("upload");
  const [importing, setImporting] = useState(false);

  const expectedHeaders = mode === "contacts" ? CONTACT_HEADERS : ESTIMATE_HEADERS;
  const requiredHeaders = mode === "contacts" ? CONTACT_REQUIRED : ESTIMATE_REQUIRED;
  const sampleCSV = mode === "contacts" ? SAMPLE_CONTACTS_CSV : SAMPLE_ESTIMATES_CSV;

  const processFile = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      toastError("Invalid file", "Please upload a .csv file");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { headers: h, rows } = parseCSV(text);
      setHeaders(h);

      const missing = requiredHeaders.filter((r) => !h.includes(r));
      if (missing.length > 0) {
        toastError("Missing columns", `Required: ${missing.join(", ")}`);
        return;
      }

      const parsed = rows.map((row, i) => validateRow(row, h, requiredHeaders, i));
      setParsedRows(parsed);
      setStep("preview");
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleImport = async () => {
    const valid = parsedRows.filter((r) => r.valid);
    const invalid = parsedRows.filter((r) => !r.valid);

    setImporting(true);
    await new Promise((res) => setTimeout(res, 1200));
    setImporting(false);
    setStep("done");

    if (invalid.length > 0) {
      warning(`Imported ${valid.length} rows`, `${invalid.length} rows skipped due to errors`);
    } else {
      success(`Import complete`, `${valid.length} ${mode} imported successfully`);
    }

    onImport?.(valid);
  };

  const downloadSample = () => {
    const blob = new Blob([sampleCSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sample_${mode}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const validCount = parsedRows.filter((r) => r.valid).length;
  const invalidCount = parsedRows.filter((r) => !r.valid).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4 shrink-0">
          <CardTitle className="text-base flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import {mode === "contacts" ? "Contacts" : "Estimates"} from CSV
          </CardTitle>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </CardHeader>

        <div className="overflow-y-auto flex-1">
          <CardContent className="pt-4 space-y-4">
            {step === "upload" && (
              <>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors",
                    isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
                  )}
                >
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium">Drop your CSV file here</p>
                  <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Required columns:</p>
                  <div className="flex flex-wrap gap-1">
                    {requiredHeaders.map((h) => (
                      <span key={h} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">
                        {h}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Optional: {expectedHeaders.filter((h) => !requiredHeaders.includes(h)).join(", ")}
                  </p>
                </div>

                <Button variant="outline" size="sm" onClick={downloadSample} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Sample CSV
                </Button>
              </>
            )}

            {step === "preview" && (
              <>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{fileName}</p>
                    <p className="text-xs text-muted-foreground">{parsedRows.length} rows found</p>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <span className="text-green-600 font-medium">{validCount} valid</span>
                    {invalidCount > 0 && (
                      <span className="text-red-600 font-medium">{invalidCount} errors</span>
                    )}
                  </div>
                </div>

                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto max-h-64">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-muted/50 border-b border-border">
                          <th className="px-3 py-2 text-left font-medium text-muted-foreground w-8">Row</th>
                          <th className="px-3 py-2 text-left font-medium text-muted-foreground w-8">✓</th>
                          {headers.slice(0, 4).map((h) => (
                            <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground">{h}</th>
                          ))}
                          {headers.length > 4 && (
                            <th className="px-3 py-2 text-left font-medium text-muted-foreground">...</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {parsedRows.map((row) => (
                          <tr key={row.row} className={cn("hover:bg-muted/20", !row.valid && "bg-red-50/50")}>
                            <td className="px-3 py-2 text-muted-foreground">{row.row}</td>
                            <td className="px-3 py-2">
                              {row.valid ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                              ) : (
                                <AlertCircle className="h-3.5 w-3.5 text-red-500" aria-label={row.errors.join(", ")} />
                              )}
                            </td>
                            {headers.slice(0, 4).map((h) => (
                              <td key={h} className="px-3 py-2 max-w-[120px] truncate">{row.data[h] || "-"}</td>
                            ))}
                            {headers.length > 4 && <td className="px-3 py-2 text-muted-foreground">…</td>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {invalidCount > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-red-700">Rows with errors (will be skipped):</p>
                    {parsedRows.filter((r) => !r.valid).map((r) => (
                      <p key={r.row} className="text-xs text-red-600">Row {r.row}: {r.errors.join(", ")}</p>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setStep("upload")} className="flex-1">
                    Back
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={handleImport}
                    disabled={validCount === 0 || importing}
                  >
                    {importing ? (
                      <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Importing...</>
                    ) : (
                      `Import ${validCount} ${mode}`
                    )}
                  </Button>
                </div>
              </>
            )}

            {step === "done" && (
              <div className="text-center py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold">Import Complete</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {validCount} {mode} imported successfully
                  {invalidCount > 0 && `, ${invalidCount} skipped`}
                </p>
                <Button size="sm" className="mt-6" onClick={onClose}>
                  Done
                </Button>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
