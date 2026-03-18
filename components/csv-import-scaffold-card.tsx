import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type CsvImportScaffoldCardProps = {
  title: string;
  description: string;
  expectedColumns: string[];
};

export function CsvImportScaffoldCard({
  title,
  description,
  expectedColumns,
}: CsvImportScaffoldCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-2 md:grid-cols-[1fr_auto]">
          <Input type="file" accept=".csv" disabled />
          <Button type="button" variant="outline" disabled>
            Import CSV (scaffold)
          </Button>
        </form>
        <p className="mt-2 text-xs text-slate-500">{description}</p>
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">
          Expected columns
        </p>
        <p className="mt-1 text-xs text-slate-600">{expectedColumns.join(", ")}</p>
      </CardContent>
    </Card>
  );
}
