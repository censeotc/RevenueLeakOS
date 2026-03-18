import Link from "next/link";
import { ROUTES } from "@/lib/constants";

const actions = [
  { label: "Review Opportunities", href: ROUTES.OPPORTUNITIES },
  { label: "View Missed Calls", href: ROUTES.CALLS },
  { label: "Launch Campaign", href: ROUTES.CAMPAIGNS },
  { label: "Import Contacts", href: ROUTES.CONTACTS },
];

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          {action.label}
        </Link>
      ))}
    </div>
  );
}
