"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  detectHeaders,
  suggestMapping,
  type ImportMode,
  validateCsvRows,
} from "@/lib/services/import-service";

const sampleCsv = {
  contacts:
    "firstName,lastName,email,phone,type,status\nAvery,Stone,avery@example.com,(248) 555-2020,lead,active\nMonica,Dean,monica@example.com,(248) 555-2021,customer,active",
  estimates:
    "estimateNumber,serviceType,amount,sentAt,contactEmail\nEST-2001,Furnace replacement,7200,2026-03-05,avery@example.com\nEST-2002,Water heater install,2900,2026-03-08,monica@example.com",
} as const;

const stepLabels = [
  "Upload",
  "Detect headers",
  "Map fields",
  "Validate rows",
  "Preview",
  "Import",
  "Success / errors",
];

export function CsvImportScaffold({ mode }: { mode: ImportMode }) {
  const [csvText, setCsvText] = useState<string>(sampleCsv[mode]);
  const [importResult, setImportResult] = useState<{ success: number; errors: number } | null>(null);

  const headers = useMemo(() => detectHeaders(csvText), [csvText]);
  const mapping = useMemo(() => suggestMapping(headers, mode), [headers, mode]);
  const validation = useMemo(() => validateCsvRows(csvText, mode), [csvText, mode]);
  const validRows = validation.filter((row) => row.isValid);
  const errorRows = validation.filter((row) => !row.isValid);

  async function onUploadFile(file: File | null) {
    if (!file) return;
    const text = await file.text();
    setCsvText(text);
    setImportResult(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "contacts" ? "Contacts CSV import" : "Estimates CSV import"}</CardTitle>
        <CardDescription>
          Upload, detect headers, map fields, validate rows, preview, import, and review success or errors.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-2 md:grid-cols-7">
          {stepLabels.map((step, index) => (
            <div
              key={step}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center text-xs font-medium text-slate-600"
            >
              {index + 1}. {step}
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.9fr,1.1fr]">
          <div className="space-y-3">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <UploadCloud className="mb-2 h-6 w-6 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Upload CSV</span>
              <span className="mt-1 text-xs text-slate-500">or use the sample dataset below</span>
              <Input className="mt-4" type="file" accept=".csv,text/csv" onChange={(event) => onUploadFile(event.target.files?.[0] ?? null)} />
            </label>
            <Textarea value={csvText} onChange={(event) => setCsvText(event.target.value)} />
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="font-medium text-slate-900">Detected headers</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {headers.map((header) => (
                  <span key={header} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                    {header}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="font-medium text-slate-900">Field mapping</p>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                {Object.entries(mapping).map(([header, mapped]) => (
                  <div key={header} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                    <span>{header}</span>
                    <span className="font-medium text-slate-900">{mapped || "Unmapped"}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="font-medium text-slate-900">Validation preview</p>
              <p className="mt-2 text-sm text-slate-500">
                {validRows.length} valid rows · {errorRows.length} rows with issues
              </p>
              <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
                {validation.map((row) => (
                  <div key={row.rowNumber} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span>Row {row.rowNumber}</span>
                      <span className={row.isValid ? "text-emerald-700" : "text-red-600"}>
                        {row.isValid ? "Valid" : row.errors.join(", ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                className="mt-4"
                onClick={() =>
                  setImportResult({
                    success: validRows.length,
                    errors: errorRows.length,
                  })
                }
                type="button"
              >
                Run import
              </Button>
            </div>

            {importResult ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Import finished</span>
                </div>
                <p className="mt-2 text-sm text-emerald-700">
                  {importResult.success} rows imported successfully, {importResult.errors} rows need correction.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
