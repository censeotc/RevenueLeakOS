import Link from "next/link";

export default function DemoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <Link href="/" className="text-xl font-bold">RevenueLeak OS</Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="container max-w-3xl py-16">
          <h1 className="text-4xl font-bold">See it in action</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore a fully loaded demo environment with sample data from a fictional HVAC company. No signup required.
          </p>

          <div className="mt-8 rounded-lg border bg-muted/40 p-8 text-center">
            <div className="mx-auto h-64 w-full max-w-lg rounded bg-muted" />
            <p className="mt-4 text-sm text-muted-foreground">Interactive dashboard preview</p>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/app/demo-walkthrough"
              className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Launch Guided Walkthrough
            </Link>
            <Link
              href="/app/dashboard"
              className="rounded-md border px-6 py-3 text-sm font-medium hover:bg-muted"
            >
              Explore the Dashboard
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
