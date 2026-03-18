"use client";

import type { CallRow } from "@/types/revenue";
import { formatDuration, formatPhone } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";

interface CallDetailPanelProps {
  call: CallRow;
  onClose: () => void;
}

export function CallDetailPanel({ call, onClose }: CallDetailPanelProps) {
  return (
    <div className="fixed inset-y-0 right-0 z-50 w-96 border-l bg-background p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Call Detail</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          &times;
        </button>
      </div>
      <div className="mt-6 space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Direction</p>
          <p className="capitalize">{call.direction.toLowerCase()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">From</p>
          <p>{formatPhone(call.from)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">To</p>
          <p>{formatPhone(call.to)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <Badge variant={call.status === "MISSED" ? "destructive" : "secondary"}>
            {call.status}
          </Badge>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Duration</p>
          <p>{formatDuration(call.duration)}</p>
        </div>
        {call.contactName && (
          <div>
            <p className="text-sm text-muted-foreground">Contact</p>
            <p className="font-medium">{call.contactName}</p>
          </div>
        )}
      </div>
    </div>
  );
}
