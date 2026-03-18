import { useState, useRef } from "react";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";
import { useToast } from "@/contexts/ToastContext";

interface CSVImportProps {
  entityType: "contacts" | "estimates";
  expectedColumns: string[];
  onImport: (rows: Record<string, string>[]) => void;
}

export function CSVImport({ entityType, expectedColumns, onImport }: CSVImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Record<string, string>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  function parseCSV(text: string) {
    const lines = text.trim().split("\n");
    if (lines.length < 2) {
      setError("CSV must have a header row and at least one data row");
      return;
    }
    const hdr = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
    setHeaders(hdr);

    const rows = lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      const row: Record<string, string> = {};
      hdr.forEach((h, i) => { row[h] = values[i] ?? ""; });
      return row;
    });

    const missing = expectedColumns.filter((c) => !hdr.some((h) => h.toLowerCase() === c.toLowerCase()));
    if (missing.length > 0) {
      setError(`Missing columns: ${missing.join(", ")}`);
    } else {
      setError(null);
    }

    setPreview(rows.slice(0, 5));
    return rows;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(f);
  }

  function handleImport() {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const rows = parseCSV(text);
      if (rows && !error) {
        onImport(rows);
        addToast({
          type: "success",
          title: "Import successful",
          description: `${rows.length} ${entityType} imported`,
        });
        setFile(null);
        setPreview([]);
        setHeaders([]);
      }
    };
    reader.readAsText(file);
  }

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Upload size={20} className="text-gray-400" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Import {entityType} from CSV
            </h3>
            <p className="text-xs text-gray-500">
              Expected columns: {expectedColumns.join(", ")}
            </p>
          </div>
        </div>

        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-400 transition-colors"
        >
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          {file ? (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
              <FileText size={16} />
              {file.name} ({preview.length}+ rows)
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              Click to select a CSV file or drag and drop
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-danger-600 bg-danger-50 rounded-lg p-3">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {preview.length > 0 && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    {headers.map((h) => (
                      <th key={h} className="text-left py-1.5 px-2 font-medium text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      {headers.map((h) => (
                        <td key={h} className="py-1.5 px-2 text-gray-700">{row[h]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-success-600">
                <CheckCircle size={14} />
                Preview looks good
              </div>
              <Button size="sm" onClick={handleImport}>
                Import {entityType}
              </Button>
            </div>
          </>
        )}

        <div className="text-xs text-gray-400">
          <a
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(expectedColumns.join(",") + "\n" + expectedColumns.map(() => "example").join(","))}`}
            download={`${entityType}-template.csv`}
            className="text-primary-500 hover:text-primary-600"
          >
            Download template CSV
          </a>
        </div>
      </div>
    </Card>
  );
}
