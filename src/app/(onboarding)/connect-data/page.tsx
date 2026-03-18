"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle, Circle } from "lucide-react";

const integrations = [
  {
    id: "servicetitan",
    name: "ServiceTitan",
    description: "Sync contacts, jobs, and estimates automatically",
    logo: "ST",
    popular: true,
  },
  {
    id: "jobber",
    name: "Jobber",
    description: "Import clients, quotes, and invoices",
    logo: "JB",
    popular: true,
  },
  {
    id: "housecall",
    name: "Housecall Pro",
    description: "Sync customers and jobs from Housecall Pro",
    logo: "HC",
    popular: false,
  },
  {
    id: "csv",
    name: "CSV Import",
    description: "Upload a CSV file of your contacts and estimates",
    logo: "CSV",
    popular: false,
  },
  {
    id: "manual",
    name: "Start from scratch",
    description: "Skip for now and add data manually",
    logo: "➕",
    popular: false,
  },
];

export default function ConnectDataPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Connect your data</h1>
      <p className="text-slate-500 text-sm mb-8">
        Import your existing contacts and estimates to start finding revenue opportunities right away.
      </p>

      <div className="space-y-3 mb-8">
        {integrations.map((integration) => (
          <button
            key={integration.id}
            onClick={() => setSelected(integration.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
              selected === integration.id
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 flex-shrink-0">
              {integration.logo}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900 text-sm">{integration.name}</span>
                {integration.popular && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">Popular</span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{integration.description}</p>
            </div>
            <div className="flex-shrink-0">
              {selected === integration.id ? (
                <CheckCircle className="h-5 w-5 text-blue-600" />
              ) : (
                <Circle className="h-5 w-5 text-slate-300" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Link href="/business-profile" className="text-sm text-slate-500 hover:text-slate-700">
          Back
        </Link>
        <Link
          href="/choose-workflows"
          className={`bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors ${!selected ? "opacity-50 pointer-events-none" : ""}`}
        >
          Continue
        </Link>
      </div>
    </div>
  );
}
