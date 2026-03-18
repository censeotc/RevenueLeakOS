"use client";

import { useState, useTransition } from "react";

import type { CsvImportEntity } from "@/services/csv-import-service";
import { useToast } from "@/components/toast-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type CsvImportScaffoldData = {
  entity: CsvImportEntity;
  sampleFileName: string;
  columns: Array<{
    source: string;
    target: string;
    required: boolean;
    description: string;
  }>;
  previewRows: Array<Record<string, string>>;
  checklist: string[];
};

async function previewImport(entity: CsvImportEntity) {
  const response = await fetch("/api/demo/action", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "preview_csv_import", entity }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error ?? "Preview failed");
  }

  return payload.result as {
    matchedRows: number;
    warnings: string[];
    previewRows: Array<Record<string, string>>;
  };
}

export function CsvImportScaffold({ data }: { data: CsvImportScaffoldData }) {
  const { pushToast } = useToast();
  const [previewRows, setPreviewRows] = useState(data.previewRows);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.entity === "contacts" ? "Contacts CSV import" : "Estimates CSV import"}</CardTitle>
        <CardDescription>
          Pilot-ready scaffold for mapping columns, previewing rows, and validating imports before a production-grade importer lands.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-xl border border-dashed border-zinc-300 p-4">
          <p className="text-sm font-medium text-zinc-900">Template file</p>
          <p className="mt-1 text-sm text-zinc-500">{data.sampleFileName}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  try {
                    const result = await previewImport(data.entity);
                    setPreviewRows(result.previewRows);
                    setWarnings(result.warnings);
                    pushToast({
                      title: "CSV preview refreshed",
                      description: `${result.matchedRows} seeded rows loaded into the preview scaffold.`,
                      tone: "success",
                    });
                  } catch (error) {
                    pushToast({
                      title: "CSV preview failed",
                      description: error instanceof Error ? error.message : "Preview failed.",
                      tone: "error",
                    });
                  }
                })
              }
            >
              {isPending ? "Refreshing preview..." : "Preview mapping"}
            </Button>
            <Badge variant="info">No file upload required in demo mode</Badge>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-900">Column mapping</p>
            {data.columns.map((column) => (
              <div key={column.source} className="rounded-xl border border-zinc-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">
                    {column.source} → {column.target}
                  </p>
                  <Badge variant={column.required ? "warning" : "secondary"}>{column.required ? "Required" : "Optional"}</Badge>
                </div>
                <p className="mt-2 text-sm text-zinc-500">{column.description}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-900">Readiness checklist</p>
            <div className="space-y-3 rounded-xl border border-zinc-200 p-4">
              {data.checklist.map((item) => (
                <div key={item} className="flex gap-3 text-sm text-zinc-600">
                  <span className="mt-1 h-2 w-2 rounded-full bg-zinc-900" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-zinc-200 p-4">
              <p className="text-sm font-medium text-zinc-900">Preview rows</p>
              <div className="mt-3 space-y-3">
                {previewRows.map((row, index) => (
                  <div key={index} className="rounded-lg bg-zinc-50 p-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      {Object.entries(row).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">{key}</p>
                          <p className="text-sm text-zinc-700">{value || "-"}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {warnings.length ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-medium text-amber-900">Preview warnings</p>
                <ul className="mt-2 space-y-2 text-sm text-amber-800">
                  {warnings.map((warning) => (
                    <li key={warning}>• {warning}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
