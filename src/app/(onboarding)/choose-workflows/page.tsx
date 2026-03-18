"use client";

import Link from "next/link";
import { useState } from "react";
import { Phone, FileText, Users, CheckCircle } from "lucide-react";

const workflows = [
  {
    id: "missed-call",
    icon: Phone,
    title: "Missed Call Text-Back",
    description: "Automatically send a personalized SMS within 60 seconds of a missed call.",
    impact: "High impact",
    impactColor: "text-green-600 bg-green-50",
  },
  {
    id: "estimate-followup",
    icon: FileText,
    title: "Estimate Follow-Up Sequence",
    description: "Send 2–3 follow-ups over 7 days when an estimate hasn't been responded to.",
    impact: "High impact",
    impactColor: "text-green-600 bg-green-50",
  },
  {
    id: "reactivation",
    icon: Users,
    title: "Customer Reactivation",
    description: "Re-engage customers who haven't booked in 6–18 months with targeted campaigns.",
    impact: "Medium impact",
    impactColor: "text-blue-600 bg-blue-50",
  },
];

export default function ChooseWorkflowsPage() {
  const [selected, setSelected] = useState<string[]>(["missed-call", "estimate-followup"]);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Choose your workflows</h1>
      <p className="text-slate-500 text-sm mb-8">
        Select the automated workflows you want to activate. You can change these anytime.
      </p>

      <div className="space-y-3 mb-8">
        {workflows.map((workflow) => {
          const isSelected = selected.includes(workflow.id);
          return (
            <button
              key={workflow.id}
              onClick={() => toggle(workflow.id)}
              className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                isSelected ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isSelected ? "bg-blue-600" : "bg-slate-100"
              }`}>
                <workflow.icon className={`h-5 w-5 ${isSelected ? "text-white" : "text-slate-500"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-slate-900 text-sm">{workflow.title}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${workflow.impactColor}`}>
                    {workflow.impact}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{workflow.description}</p>
              </div>
              <div className="flex-shrink-0 mt-0.5">
                {isSelected ? (
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <Link href="/connect-data" className="text-sm text-slate-500 hover:text-slate-700">
          Back
        </Link>
        <Link
          href="/launch"
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Continue
        </Link>
      </div>
    </div>
  );
}
