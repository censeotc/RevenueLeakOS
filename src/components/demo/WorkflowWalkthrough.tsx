"use client";

import { useState } from "react";
import { DemoStatePlayer } from "./DemoStatePlayer";
import { walkthroughSteps } from "@/data/walkthroughData";
import type { WalkthroughStep } from "@/types/revenue";

export function WorkflowWalkthrough() {
  const [activeStep, setActiveStep] = useState<WalkthroughStep>(walkthroughSteps[0]);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <DemoStatePlayer
        steps={walkthroughSteps}
        onStepChange={(step) => setActiveStep(step)}
      />

      <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">What's happening</h3>

        {activeStep.visualization === "opportunity" && (
          <div className="space-y-3">
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
              <p className="text-xs font-semibold text-orange-700 mb-1">🚨 Missed Call Detected</p>
              <p className="text-sm text-orange-600">Robert Davis called at 2:14 PM — no answer</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-700 mb-1">⚡ Automated Response</p>
              <p className="text-sm text-blue-600">SMS sent: "Hi Robert, sorry we missed your call! We're here to help — reply or call us back at (555) 000-1234."</p>
            </div>
          </div>
        )}

        {activeStep.visualization === "sms" && (
          <div className="bg-slate-900 rounded-2xl p-4 space-y-2">
            <div className="bg-slate-700 text-slate-100 text-sm rounded-2xl rounded-tl-sm px-3 py-2 max-w-xs">
              Hi Robert, sorry we missed your call! We're here to help — reply or call us back.
            </div>
            <div className="bg-green-500 text-white text-sm rounded-2xl rounded-tr-sm px-3 py-2 max-w-xs ml-auto">
              Hey! Yes please, I need someone to look at my AC. Can you come Wednesday?
            </div>
          </div>
        )}

        {activeStep.visualization === "won" && (
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <p className="font-semibold text-green-800">Opportunity Won!</p>
            <p className="text-sm text-green-600 mt-1">$3,200 AC replacement job booked</p>
            <p className="text-xs text-green-500 mt-0.5">Recovered in 47 minutes</p>
          </div>
        )}

        {!activeStep.visualization && (
          <div className="text-center py-8 text-slate-400 text-sm">
            Press play to watch the demo
          </div>
        )}
      </div>
    </div>
  );
}
