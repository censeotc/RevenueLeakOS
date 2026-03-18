"use client";

import { Users } from "lucide-react";
import { LaunchCampaignButton } from "./LaunchCampaignButton";
import type { ReactivationSegment } from "@/types/revenue";

interface SegmentCardProps {
  segment: ReactivationSegment;
}

export function SegmentCard({ segment }: SegmentCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <Users className="h-4 w-4 text-blue-600" />
        </div>
        <span className="text-xs text-slate-400">{segment.filterLabel}</span>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 mb-0.5">{segment.name}</h3>
        <p className="text-xs text-slate-500">{segment.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-slate-900">{segment.contactCount}</p>
          <p className="text-xs text-slate-400">Contacts</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-blue-600">${segment.estimatedValue.toLocaleString()}</p>
          <p className="text-xs text-slate-400">Est. Value</p>
        </div>
      </div>

      <LaunchCampaignButton segmentId={segment.id} />
    </div>
  );
}
