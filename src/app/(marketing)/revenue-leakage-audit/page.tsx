export default function RevenueLeakageAuditPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="container max-w-2xl py-16">
          <h1 className="text-4xl font-bold">Free Revenue Leakage Audit</h1>
          <p className="mt-4 text-muted-foreground">
            Answer a few questions about your business and we&apos;ll estimate how much revenue you&apos;re leaving on the table every month.
          </p>

          <form className="mt-8 space-y-6">
            <div className="space-y-2">
              <label htmlFor="monthly-calls" className="text-sm font-medium">
                How many inbound calls do you get per month?
              </label>
              <input
                id="monthly-calls"
                type="number"
                placeholder="e.g. 200"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="missed-pct" className="text-sm font-medium">
                What percentage of calls go unanswered?
              </label>
              <input
                id="missed-pct"
                type="number"
                placeholder="e.g. 15"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="avg-job" className="text-sm font-medium">
                What&apos;s your average job value?
              </label>
              <input
                id="avg-job"
                type="number"
                placeholder="e.g. 850"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="estimates-per-month" className="text-sm font-medium">
                How many estimates do you send per month?
              </label>
              <input
                id="estimates-per-month"
                type="number"
                placeholder="e.g. 50"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Calculate My Revenue Leak
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
