import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <span className="text-xl font-bold">RevenueLeak OS</span>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link>
            <Link href="/demo" className="text-muted-foreground hover:text-foreground">Demo</Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground">About</Link>
            <Link href="/login" className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container flex flex-col items-center gap-8 pb-16 pt-24 text-center">
          <h1 className="max-w-3xl text-5xl font-bold tracking-tight">
            Stop Leaving Money on the Table
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            RevenueLeak OS automatically finds missed calls, unsold estimates, and lapsed customers — then recovers that revenue with smart follow-up workflows.
          </p>
          <div className="flex gap-4">
            <Link
              href="/signup"
              className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Get Started Free
            </Link>
            <Link
              href="/demo"
              className="rounded-md border px-6 py-3 text-sm font-medium hover:bg-muted"
            >
              See the Demo
            </Link>
          </div>
        </section>

        <section className="border-t bg-muted/40 py-16">
          <div className="container grid gap-8 md:grid-cols-3">
            <div className="space-y-3 rounded-lg border bg-card p-6">
              <h3 className="font-semibold">Missed Call Recovery</h3>
              <p className="text-sm text-muted-foreground">
                Automatically detect missed calls and trigger callback workflows before the customer moves on.
              </p>
            </div>
            <div className="space-y-3 rounded-lg border bg-card p-6">
              <h3 className="font-semibold">Estimate Follow-Up</h3>
              <p className="text-sm text-muted-foreground">
                Multi-touch SMS and email sequences for unsold estimates — timed to convert.
              </p>
            </div>
            <div className="space-y-3 rounded-lg border bg-card p-6">
              <h3 className="font-semibold">Customer Reactivation</h3>
              <p className="text-sm text-muted-foreground">
                Segment lapsed customers and launch targeted reactivation campaigns in one click.
              </p>
            </div>
          </div>
        </section>

        <section className="container py-16 text-center">
          <Link
            href="/revenue-leakage-audit"
            className="text-primary underline"
          >
            Take the free Revenue Leakage Audit →
          </Link>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container flex items-center justify-between text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} RevenueLeak OS</span>
          <div className="flex gap-4">
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
