"use client";

import Link from "next/link";
import { CheckCircle, Rocket } from "lucide-react";

const readyItems = [
  "Business profile configured",
  "Data source connected",
  "Workflows activated",
  "SMS templates loaded",
  "Dashboard ready",
];

export default function LaunchPage() {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Rocket className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">You're ready to launch!</h1>
      <p className="text-slate-500 text-sm mb-8">
        Your account is set up and your workflows are ready to go. Start recovering revenue from day one.
      </p>

      <div className="bg-white rounded-xl border border-slate-100 p-6 text-left mb-8">
        <p className="text-sm font-medium text-slate-700 mb-4">Everything is in place:</p>
        <ul className="space-y-3">
          {readyItems.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm text-slate-700">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <Link
        href="/app/dashboard"
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Go to Dashboard →
      </Link>

      <p className="text-xs text-slate-400 mt-4">
        You can adjust any settings from your dashboard at any time.
      </p>
    </div>
  );
}
