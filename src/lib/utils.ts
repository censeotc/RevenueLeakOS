import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)}m`;
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-orange-100 text-orange-800",
    responded: "bg-purple-100 text-purple-800",
    booked: "bg-green-100 text-green-800",
    won: "bg-emerald-100 text-emerald-800",
    lost: "bg-red-100 text-red-800",
    closed: "bg-gray-100 text-gray-800",
    missed: "bg-red-100 text-red-800",
    after_hours: "bg-amber-100 text-amber-800",
    abandoned: "bg-orange-100 text-orange-800",
    sent: "bg-blue-100 text-blue-800",
    viewed: "bg-cyan-100 text-cyan-800",
    stale: "bg-amber-100 text-amber-800",
    follow_up: "bg-purple-100 text-purple-800",
    expired: "bg-gray-100 text-gray-800",
    draft: "bg-gray-100 text-gray-800",
    active: "bg-green-100 text-green-800",
    paused: "bg-yellow-100 text-yellow-800",
    completed: "bg-blue-100 text-blue-800",
    connected: "bg-green-100 text-green-800",
    disconnected: "bg-gray-100 text-gray-800",
    error: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
    scheduled: "bg-blue-100 text-blue-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function getOpportunityTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    missed_call: "Missed Call",
    estimate_rescue: "Estimate Rescue",
    reactivation: "Reactivation",
  };
  return labels[type] || type;
}

export function getOpportunityTypeColor(type: string): string {
  const colors: Record<string, string> = {
    missed_call: "bg-red-100 text-red-800 border-red-200",
    estimate_rescue: "bg-amber-100 text-amber-800 border-amber-200",
    reactivation: "bg-blue-100 text-blue-800 border-blue-200",
  };
  return colors[type] || "bg-gray-100 text-gray-800 border-gray-200";
}

export function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString();
}

export function daysSince(date: Date): number {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}
