import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toAppRoute } from "@/lib/app-routes";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold">Access restricted</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your current role does not have permission to access this page.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <Link href={toAppRoute("/dashboard")}>
            <Button>Back to Dashboard</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline">Switch User</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
