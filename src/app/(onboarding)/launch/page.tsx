import Link from "next/link";

export default function LaunchPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">Step 4 of 4</p>
        <h1 className="mt-2 text-3xl font-bold">You&apos;re all set!</h1>
        <p className="mt-2 text-muted-foreground">
          Your revenue recovery workflows are configured and ready to go. Head to your dashboard to start recovering lost revenue.
        </p>
      </div>

      <div className="rounded-lg border bg-muted/40 p-6 space-y-3">
        <h3 className="font-semibold">Setup summary</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>✓ Business profile created</li>
          <li>✓ Data sources connected</li>
          <li>✓ Workflows activated</li>
        </ul>
      </div>

      <div className="flex justify-center pt-4">
        <Link
          href="/app/dashboard"
          className="rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
