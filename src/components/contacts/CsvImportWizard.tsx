import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CsvImportWizard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CSV import wizard</CardTitle>
        <CardDescription>Review the import flow for contacts and estimates.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-3 text-sm text-slate-600">
        <div className="rounded-xl border border-slate-100 p-4">1. Upload file and validate columns</div>
        <div className="rounded-xl border border-slate-100 p-4">2. Map fields and de-duplicate records</div>
        <div className="rounded-xl border border-slate-100 p-4">3. Confirm summary and start workflow enrichment</div>
      </CardContent>
    </Card>
  );
}
