"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import {
  parseCSV,
  autoMapFields,
  CONTACT_FIELDS,
  ESTIMATE_FIELDS,
  type CSVParseResult,
  type FieldMapping,
} from "@/lib/csv-parser";
import { Upload, X, FileText, Check, AlertCircle, ArrowRight } from "lucide-react";

type ImportType = "contacts" | "estimates";
type ImportStep = "upload" | "mapping" | "preview" | "result";

interface ImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}

interface CSVImportDialogProps {
  type: ImportType;
  open: boolean;
  onClose: () => void;
  onImportComplete?: (result: ImportResult) => void;
}

export function CSVImportDialog({ type, open, onClose, onImportComplete }: CSVImportDialogProps) {
  const [step, setStep] = useState<ImportStep>("upload");
  const [parsed, setParsed] = useState<CSVParseResult | null>(null);
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const targetFields = type === "contacts" ? CONTACT_FIELDS : ESTIMATE_FIELDS;

  const reset = () => {
    setStep("upload");
    setParsed(null);
    setMappings([]);
    setFileName("");
    setResult(null);
  };

  const handleFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const result = parseCSV(text);
        setParsed(result);
        const autoMapped = autoMapFields(result.headers, targetFields);
        setMappings(autoMapped);
        setStep("mapping");
      };
      reader.readAsText(file);
    },
    [targetFields]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file && (file.name.endsWith(".csv") || file.type === "text/csv")) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const updateMapping = (appField: string, csvColumn: string) => {
    setMappings((prev) =>
      prev.map((m) => (m.appField === appField ? { ...m, csvColumn } : m))
    );
  };

  const requiredFieldsMapped = targetFields
    .filter((f) => f.required)
    .every((f) => mappings.find((m) => m.appField === f.key)?.csvColumn);

  const handleImport = () => {
    if (!parsed) return;

    const imported = parsed.rows.length;
    const skipped = parsed.errors.length;
    const importResult: ImportResult = {
      imported,
      skipped,
      errors: parsed.errors.slice(0, 5),
    };

    setResult(importResult);
    setStep("result");
    onImportComplete?.(importResult);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <CardHeader className="shrink-0">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Import {type === "contacts" ? "Contacts" : "Estimates"} from CSV
          </CardTitle>
          <button onClick={() => { reset(); onClose(); }} className="rounded-lg p-1 hover:bg-accent">
            <X className="h-5 w-5" />
          </button>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto">
          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-6">
            {(["upload", "mapping", "preview", "result"] as ImportStep[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                {i > 0 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    step === s
                      ? "bg-primary text-primary-foreground"
                      : ["upload", "mapping", "preview", "result"].indexOf(step) > i
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>
              </div>
            ))}
          </div>

          {/* Upload step */}
          {step === "upload" && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm font-medium mb-1">
                Drag & drop a CSV file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Supports .csv files. Maximum 10,000 rows.
              </p>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={handleInputChange}
              />
              <Button variant="outline" onClick={() => fileRef.current?.click()}>
                Choose File
              </Button>

              <div className="mt-6 text-left">
                <p className="text-xs font-medium text-muted-foreground mb-2">Expected columns:</p>
                <div className="flex flex-wrap gap-1">
                  {targetFields.map((f) => (
                    <span
                      key={f.key}
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        f.required
                          ? "bg-primary/10 text-primary font-medium"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {f.label}{f.required ? " *" : ""}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mapping step */}
          {step === "mapping" && parsed && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {parsed.rowCount} rows, {parsed.headers.length} columns
                  </p>
                </div>
                {parsed.errors.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {parsed.errors.length} warnings
                  </div>
                )}
              </div>

              <div className="border border-border rounded-lg divide-y divide-border">
                {targetFields.map((field) => {
                  const mapping = mappings.find((m) => m.appField === field.key);
                  return (
                    <div key={field.key} className="flex items-center gap-4 px-4 py-3">
                      <div className="w-40 shrink-0">
                        <p className="text-sm font-medium">
                          {field.label}
                          {field.required && <span className="text-destructive ml-0.5">*</span>}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      <select
                        value={mapping?.csvColumn || ""}
                        onChange={(e) => updateMapping(field.key, e.target.value)}
                        className="flex-1 h-9 rounded-lg border border-input px-3 text-sm bg-background"
                      >
                        <option value="">-- Skip --</option>
                        {parsed.headers.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                      {mapping?.csvColumn && (
                        <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={reset}>
                  Back
                </Button>
                <Button onClick={() => setStep("preview")} disabled={!requiredFieldsMapped}>
                  Preview Import
                </Button>
              </div>
            </div>
          )}

          {/* Preview step */}
          {step === "preview" && parsed && (
            <div className="space-y-4">
              <p className="text-sm font-medium">Preview (first 5 rows)</p>
              <div className="overflow-x-auto border border-border rounded-lg">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/50">
                      {mappings
                        .filter((m) => m.csvColumn)
                        .map((m) => (
                          <th key={m.appField} className="px-3 py-2 text-left font-medium text-muted-foreground">
                            {targetFields.find((f) => f.key === m.appField)?.label}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {parsed.rows.slice(0, 5).map((row, i) => (
                      <tr key={i}>
                        {mappings
                          .filter((m) => m.csvColumn)
                          .map((m) => (
                            <td key={m.appField} className="px-3 py-2">
                              {row[m.csvColumn] || "-"}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <p className="text-sm">
                  Ready to import <span className="font-bold">{parsed.rowCount}</span> records
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep("mapping")}>
                    Back
                  </Button>
                  <Button onClick={handleImport}>
                    Import {parsed.rowCount} Records
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Result step */}
          {step === "result" && result && (
            <div className="space-y-4 text-center py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mx-auto">
                <Check className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">Import Complete</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {result.imported} records imported successfully
                </p>
              </div>
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{result.imported}</p>
                  <p className="text-xs text-muted-foreground">Imported</p>
                </div>
                {result.skipped > 0 && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-600">{result.skipped}</p>
                    <p className="text-xs text-muted-foreground">Skipped</p>
                  </div>
                )}
              </div>
              {result.errors.length > 0 && (
                <div className="text-left rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs font-medium text-amber-800 mb-1">Warnings:</p>
                  {result.errors.map((err, i) => (
                    <p key={i} className="text-xs text-amber-700">{err}</p>
                  ))}
                </div>
              )}
              <Button onClick={() => { reset(); onClose(); }}>
                Done
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
