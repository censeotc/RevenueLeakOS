"use client";

interface LaunchCampaignButtonProps {
  segmentId: string;
  onLaunch?: (segmentId: string) => void;
  disabled?: boolean;
}

export function LaunchCampaignButton({ segmentId, onLaunch, disabled }: LaunchCampaignButtonProps) {
  return (
    <button
      onClick={() => onLaunch?.(segmentId)}
      disabled={disabled}
      className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
    >
      Launch Reactivation Campaign
    </button>
  );
}
