import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getCsvImportScaffold,
  listCsvImportScaffolds,
  type CsvImportEntity,
} from "@/services/csv-import";
import { ArrowRight, CheckCircle2, FileSpreadsheet, Upload } from "lucide-react";

export default function ImportsPage({
  searchParams,
}: {
  searchParams?: { entity?: string };
}) {
  const activeEntity: CsvImportEntity =
    searchParams?.entity === "estimates" ? "estimates" : "contacts";
  const activeScaffold = getCsvImportScaffold(activeEntity);
  const scaffolds = listCsvImportScaffolds();

  return (
    <div>
      <TopBar title="CSV Imports" />
      <div className="space-y-6 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Pilot import scaffolding</h2>
            <p className="text-sm text-muted-foreground">
              Stage contacts and estimates with a repeatable schema before wiring a live FSM sync.
            </p>
          </div>
          <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
            Preview endpoint ready at <span className="font-semibold">POST /api/imports/preview</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {scaffolds.map((scaffold) => (
            <Card
              key={scaffold.entity}
              className={scaffold.entity === activeEntity ? "border-primary shadow-md" : undefined}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  {scaffold.title}
                </CardTitle>
                <Link href={`/imports?entity=${scaffold.entity}`} className="text-sm text-primary hover:underline">
                  Open scaffold
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{scaffold.description}</p>
                <div className="flex flex-wrap gap-2">
                  {scaffold.requiredColumns.slice(0, 4).map((field) => (
                    <Badge key={field.key} variant="outline" className="border-primary/30 text-primary">
                      {field.label}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{scaffold.requiredColumns.length} required columns</span>
                  <span>{scaffold.optionalColumns.length} optional columns</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {activeScaffold.title}
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                Required fields are validated first; optional fields enrich downstream routing and reporting.
              </span>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Required columns</h3>
                  <div className="space-y-2">
                    {activeScaffold.requiredColumns.map((field) => (
                      <div key={field.key} className="rounded-lg border border-border bg-muted/30 p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{field.label}</p>
                          <Badge>Required</Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          <span className="font-mono">{field.key}</span> - example: {field.example}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Optional columns</h3>
                  <div className="space-y-2">
                    {activeScaffold.optionalColumns.map((field) => (
                      <div key={field.key} className="rounded-lg border border-border p-3">
                        <p className="text-sm font-medium">{field.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          <span className="font-mono">{field.key}</span> - example: {field.example}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold">Sample preview rows</h3>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        {Object.keys(activeScaffold.sampleRows[0]).map((header) => (
                          <th key={header} className="px-4 py-2 text-left font-medium text-muted-foreground">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {activeScaffold.sampleRows.map((row, index) => (
                        <tr key={index}>
                          {Object.entries(row).map(([header, value]) => (
                            <td key={header} className="px-4 py-3 text-muted-foreground">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What this scaffold covers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                "Column mapping contract for pilot data handoff",
                "Server preview route for validating CSV samples",
                "Seed-compatible fields for contacts and estimates",
                "Navigation hooks from the Contacts and Estimates screens",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                  <p className="text-sm">{item}</p>
                </div>
              ))}

              <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                Ingestion, deduping, and database writes are intentionally left as the next integration step; this page
                keeps the pilot import contract visible and testable now.
              </div>

              <div className="flex flex-col gap-2">
                <Link href={activeEntity === "contacts" ? "/contacts" : "/estimates"}>
                  <Button variant="outline" className="w-full justify-between">
                    Back to {activeEntity === "contacts" ? "Contacts" : "Estimates"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/integrations">
                  <Button className="w-full justify-between">
                    Review integration status
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
