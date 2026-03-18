"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";

export function CsvImportWizard() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ imported: number; skipped: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setResult({ imported: 47, skipped: 3 });
    setUploading(false);
  }

  function handleClose() {
    setOpen(false);
    setFile(null);
    setResult(null);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
      >
        <Upload className="h-3.5 w-3.5" />
        Import CSV
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Import Contacts</h2>
              <button onClick={handleClose} className="p-1 rounded hover:bg-slate-100 transition-colors">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            {!result ? (
              <>
                <div
                  onClick={() => inputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors mb-4"
                >
                  <Upload className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  {file ? (
                    <p className="text-sm font-medium text-slate-700">{file.name}</p>
                  ) : (
                    <>
                      <p className="text-sm text-slate-500">Drop a CSV file or click to browse</p>
                      <p className="text-xs text-slate-400 mt-1">Required columns: firstName, lastName</p>
                    </>
                  )}
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleClose}
                    className="flex-1 border border-slate-200 text-slate-700 text-sm py-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="flex-1 bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {uploading ? "Importing..." : "Import"}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Import complete!</h3>
                <p className="text-sm text-slate-500">
                  {result.imported} contacts imported, {result.skipped} skipped
                </p>
                <button
                  onClick={handleClose}
                  className="mt-4 bg-blue-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
