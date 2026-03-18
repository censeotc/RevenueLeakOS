import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateId(prefix?: string): string {
  const id = Math.random().toString(36).slice(2, 10);
  return prefix ? `${prefix}_${id}` : id;
}

export function interpolateTemplate(
  template: string,
  variables: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] ?? match;
  });
}

export function extractTemplateVariables(template: string): string[] {
  const matches = template.match(/\{\{(\w+)\}\}/g) ?? [];
  return [...new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, "")))];
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

export function parsePhoneNumber(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = parsePhoneNumber(phone);
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned[0] === "1") {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = parsePhoneNumber(phone);
  return cleaned.length === 10 || (cleaned.length === 11 && cleaned[0] === "1");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function groupBy<T>(items: T[], key: keyof T): Record<string, T[]> {
  return items.reduce(
    (groups, item) => {
      const value = String(item[key]);
      if (!groups[value]) groups[value] = [];
      groups[value].push(item);
      return groups;
    },
    {} as Record<string, T[]>
  );
}
