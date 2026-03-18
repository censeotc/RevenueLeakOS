"use client";

import { useState } from "react";
import { Rocket, CheckCircle } from "lucide-react";

interface LaunchCampaignButtonProps {
  segmentId: string;
}

export function LaunchCampaignButton({ segmentId }: LaunchCampaignButtonProps) {
  const [launched, setLaunched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLaunch() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLaunched(true);
    setLoading(false);
  }

  if (launched) {
    return (
      <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
        <CheckCircle className="h-4 w-4" />
        Campaign launched
      </div>
    );
  }

  return (
    <button
      onClick={handleLaunch}
      disabled={loading}
      className="w-full flex items-center justify-center gap-1.5 bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
    >
      <Rocket className="h-3.5 w-3.5" />
      {loading ? "Launching..." : "Launch Campaign"}
    </button>
  );
}
