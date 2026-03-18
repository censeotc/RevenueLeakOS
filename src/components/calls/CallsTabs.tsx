"use client";

import { useState } from "react";
import { CallsTable } from "./CallsTable";
import { SmsThreadPreview } from "./SmsThreadPreview";
import { demoSmsThreads } from "@/data/demoData";

const tabs = ["All", "Missed Calls", "SMS Threads", "Outbound"];

export function CallsTabs() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1 bg-white border border-slate-100 rounded-xl p-1 w-fit shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab ? "bg-blue-600 text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "SMS Threads" ? (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm divide-y divide-slate-50">
          {demoSmsThreads.map((thread) => (
            <SmsThreadPreview key={thread.id} thread={thread} />
          ))}
        </div>
      ) : (
        <CallsTable />
      )}
    </div>
  );
}
