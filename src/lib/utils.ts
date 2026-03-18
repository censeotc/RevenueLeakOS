import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, differenceInDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "MMM d, yyyy h:mm a");
}

export function formatTimeAgo(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function daysAgo(date: Date | string): number {
  return differenceInDays(new Date(), new Date(date));
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits[0] === "1") {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  attempted: "bg-yellow-100 text-yellow-800",
  responded: "bg-purple-100 text-purple-800",
  qualified: "bg-indigo-100 text-indigo-800",
  booked: "bg-green-100 text-green-800",
  lost: "bg-red-100 text-red-800",
  paused: "bg-gray-100 text-gray-800",
  closed: "bg-gray-100 text-gray-600",
  open: "bg-blue-100 text-blue-800",
  stale: "bg-orange-100 text-orange-800",
  active: "bg-green-100 text-green-800",
  draft: "bg-gray-100 text-gray-800",
  scheduled: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  paused_campaign: "bg-yellow-100 text-yellow-800",
  connected: "bg-green-100 text-green-800",
  disconnected: "bg-gray-100 text-gray-800",
  error: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
};

export function getStatusColor(status: string): string {
  return STATUS_COLORS[status] ?? "bg-gray-100 text-gray-800";
}

export const OPPORTUNITY_TYPE_LABELS: Record<string, string> = {
  missed_call: "Missed Call",
  estimate_rescue: "Estimate Rescue",
  reactivation: "Reactivation",
};

export const OPPORTUNITY_STATUS_LABELS: Record<string, string> = {
  new: "New",
  attempted: "Attempted",
  responded: "Responded",
  qualified: "Qualified",
  booked: "Booked",
  lost: "Lost",
  paused: "Paused",
  closed: "Closed",
};

export const SERVICE_TYPE_OPTIONS = [
  "HVAC Repair",
  "HVAC Installation",
  "AC Tune-Up",
  "Furnace Repair",
  "Plumbing Repair",
  "Water Heater",
  "Drain Cleaning",
  "Electrical Repair",
  "Panel Upgrade",
  "Maintenance Plan",
  "Emergency Service",
  "Other",
];
