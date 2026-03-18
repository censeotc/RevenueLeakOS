"use client";

import { ChangeEvent, useState } from "react";
import { Download, FileUp, Info, Upload } from "lucide-react";
import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useToast } from "@/components/ui/toast";

type ImportEntity = "contacts" | "estimates";

interface PreviewPayload {
  headers: string[];
  rows: Record<string, string>[];
  requiredColumns: string[];
  missingColumns: string[];
}

const entityLabels: Record<ImportEntity, string> = {
  contacts: "Contacts",
  estimates: "Estimates",
};

export default function ImportsPage() {
  const { pushToast } = useToast();
  const [entity, setEntity] = useState<ImportEntity>("contacts");
  const [preview, setPreview] = useState<PreviewPayload | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isParsing, setIsParsing] = useState(false);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsParsing(true);
    setFileName(file.name);

    try {
      const csvText = await file.text();
      const response = await fetch("/api/imports/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entity, csvText }),
      });

      if (!response.ok) {
        throw new Error("Unable to parse CSV file");
      }

      const payload = (await response.json()) as { preview: PreviewPayload };
      setPreview(payload.preview);
      pushToast({
        title: "CSV parsed",
        description: `Loaded preview for ${entityLabels[entity]}.`,
        variant: "success",
      });
    } catch {
      setPreview(null);
      pushToast({
        title: "Import preview failed",
        description: "Please verify the CSV file format and try again.",
        variant: "error",
      });
    } finally {
      setIsParsing(false);
      event.target.value = "";
    }
  };

  return (
    <div>
      <TopBar title="CSV Imports" />
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Import Scaffold</CardTitle>
            <p className="text-sm text-muted-foreground">
              Upload a CSV to validate columns and preview rows before full import execution.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {(["contacts", "estimates"] as ImportEntity[]).map((value) => (
                <Button
                  key={value}
                  variant={entity === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setEntity(value);
                    setPreview(null);
                    setFileName("");
                  }}
                >
                  {entityLabels[value]}
                </Button>
              ))}
              <a href={`/api/imports/template?entity=${entity}`} className="ml-auto">
                <Button variant="outline" size="sm">
                  <Download className="mr-1 h-4 w-4" />
                  Download Template
                </Button>
              </a>
            </div>

            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 p-6 text-sm font-medium text-muted-foreground transition hover:bg-muted/40">
              <input
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={handleUpload}
              />
              <Upload className="h-4 w-4" />
              Upload {entityLabels[entity]} CSV
            </label>

            <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-900">
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  This is a scaffolded import flow: preview and validation are active, while final
                  write/import actions are intentionally staged for pilot rollout.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="h-4 w-4" />
              Preview
            </CardTitle>
            {fileName ? (
              <p className="text-xs text-muted-foreground">File: {fileName}</p>
            ) : null}
          </CardHeader>
          <CardContent>
            {isParsing ? (
              <LoadingState label="Parsing CSV and validating columns..." />
            ) : null}

            {!isParsing && !preview ? (
              <EmptyState
                title="No CSV uploaded yet"
                description="Select a contacts or estimates CSV file to validate required columns."
              />
            ) : null}

            {!isParsing && preview ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-medium text-muted-foreground">Required:</span>
                  {preview.requiredColumns.map((column) => (
                    <span key={column} className="rounded bg-muted px-2 py-0.5">
                      {column}
                    </span>
                  ))}
                </div>

                {preview.missingColumns.length > 0 ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                    Missing columns: {preview.missingColumns.join(", ")}
                  </div>
                ) : (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                    Column validation passed.
                  </div>
                )}

                {preview.rows.length === 0 ? (
                  <EmptyState
                    title="No data rows found"
                    description="The file only contains headers. Add rows to continue validation."
                  />
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          {preview.headers.map((header) => (
                            <th
                              key={header}
                              className="whitespace-nowrap px-3 py-2 text-left text-xs font-semibold text-muted-foreground"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {preview.rows.map((row, rowIndex) => (
                          <tr key={`row_${rowIndex}`}>
                            {preview.headers.map((header) => (
                              <td key={`${rowIndex}_${header}`} className="px-3 py-2 text-xs">
                                {row[header] || "-"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
