import type { Metadata } from "next";
import { TemplateTable } from "@/components/templates/TemplateTable";

export const metadata: Metadata = { title: "Templates" };

export default function TemplatesPage() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Templates</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage SMS and email message templates</p>
        </div>
        <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          New Template
        </button>
      </div>
      <TemplateTable />
    </div>
  );
}
