"use client";

import { useState } from "react";

interface CsvImportWizardProps {
  type: "contacts" | "estimates";
  onImport?: (rows: Record<string, string>[]) => void;
  onClose: () => void;
}

export function CsvImportWizard({ type, onImport, onClose }: CsvImportWizardProps) {
  const [step, setStep] = useState<"upload" | "preview" | "done">("upload");
  const [rows, setRows] = useState<Record<string, string>[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter(Boolean);
      const headers = lines[0].split(",").map((h) => h.trim());
      const parsed = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((h, i) => {
          row[h] = values[i] ?? "";
        });
        return row;
      });
      setRows(parsed);
      setStep("preview");
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-background p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Import {type}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            &times;
          </button>
        </div>

        {step === "upload" && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">Upload a CSV file with your {type} data.</p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full text-sm"
            />
          </div>
        )}

        {step === "preview" && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">{rows.length} rows found</p>
            <div className="max-h-64 overflow-auto rounded border p-2 text-xs">
              <pre>{JSON.stringify(rows.slice(0, 5), null, 2)}</pre>
            </div>
            <button
              onClick={() => {
                onImport?.(rows);
                setStep("done");
              }}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Import {rows.length} rows
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="mt-6 text-center">
            <p className="text-sm">Import complete!</p>
            <button
              onClick={onClose}
              className="mt-4 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
