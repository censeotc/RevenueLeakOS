"use client";

import { useState, useRef } from "react";
import { Button } from "./button";
import { Upload, Download, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImportResult {
  ok: boolean;
  imported: number;
  skipped: number;
  total: number;
  errors: Array<{ row: number; message: string }>;
  preview?: unknown[];
}

interface CSVImportModalProps {
  entityType: "contacts" | "estimates";
  onClose: () => void;
  onSuccess?: (result: ImportResult) => void;
}

export function CSVImportModal({ entityType, onClose, onSuccess }: CSVImportModalProps) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const label = entityType === "contacts" ? "Contacts" : "Estimates";
  const apiPath = `/api/import/${entityType}`;

  const handleFile = (f: File) => {
    if (!f.name.endsWith(".csv")) {
      setError("Please select a .csv file");
      return;
    }
    setFile(f);
    setError(null);
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(apiPath, { method: "POST", body: fd });
      const data: ImportResult = await res.json();
      if (!res.ok) throw new Error((data as unknown as { error: string }).error || "Import failed");
      setResult(data);
      onSuccess?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    window.location.href = `${apiPath}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-border bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold">Import {label}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upload a CSV file to bulk import {label.toLowerCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Template download */}
          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
            <div>
              <p className="text-sm font-medium">Need a template?</p>
              <p className="text-xs text-muted-foreground">
                Download our CSV template with required column headers
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Template
            </Button>
          </div>

          {/* Drop zone */}
          {!result && (
            <div
              className={cn(
                "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer",
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/30",
                file && "border-primary/50 bg-primary/5"
              )}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
              <Upload className="h-8 w-8 text-muted-foreground mb-3" />
              {file ? (
                <>
                  <p className="text-sm font-medium text-primary">{file.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(file.size / 1024).toFixed(1)} KB · Click to change
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium">
                    Drop your CSV here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports .csv files up to 10MB
                  </p>
                </>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-emerald-800">
                    Import complete
                  </p>
                  <p className="text-xs text-emerald-600 mt-0.5">
                    {result.imported} imported · {result.skipped} skipped ·{" "}
                    {result.total} total rows
                  </p>
                </div>
              </div>
              {result.errors.length > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                  <p className="text-xs font-medium text-amber-800 mb-1.5">
                    {result.errors.length} row(s) had issues:
                  </p>
                  <ul className="space-y-1">
                    {result.errors.slice(0, 4).map((e, i) => (
                      <li key={i} className="text-xs text-amber-700">
                        Row {e.row}: {e.message}
                      </li>
                    ))}
                    {result.errors.length > 4 && (
                      <li className="text-xs text-amber-500">
                        +{result.errors.length - 4} more…
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            {result ? "Close" : "Cancel"}
          </Button>
          {!result && (
            <Button
              size="sm"
              onClick={handleImport}
              disabled={!file || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Importing…
                </>
              ) : (
                <>
                  <Upload className="mr-1.5 h-3.5 w-3.5" />
                  Import {label}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
