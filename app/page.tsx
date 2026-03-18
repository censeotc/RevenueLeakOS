import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/config";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect("/app/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <main className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          RevenueLeak OS
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Internal MVP is ready for demo tenant sign-in
        </h1>
        <p className="mt-3 text-slate-600">
          This pilot build focuses on authenticated revenue recovery workflows across missed calls,
          stale estimates, and dormant customer reactivation.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/login">
            <Button>Sign in to app</Button>
          </Link>
          <Link href="/app/demo-walkthrough">
            <Button variant="outline">View walkthrough</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
