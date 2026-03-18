"use client";

import { useState } from "react";
import { walkthroughSteps } from "@/data/walkthroughData";

export function WorkflowWalkthrough() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = walkthroughSteps[currentStep];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {walkthroughSteps.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setCurrentStep(i)}
            className={`h-2 w-8 rounded-full transition-colors ${
              i === currentStep ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      {step && (
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-bold">{step.title}</h2>
          <p className="mt-2 text-muted-foreground">{step.description}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentStep(Math.min(walkthroughSteps.length - 1, currentStep + 1))}
          disabled={currentStep === walkthroughSteps.length - 1}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
