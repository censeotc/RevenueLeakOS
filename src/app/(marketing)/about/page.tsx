import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <Link href="/" className="text-xl font-bold">RevenueLeak OS</Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="container max-w-2xl py-16">
          <h1 className="text-4xl font-bold">About RevenueLeak OS</h1>
          <div className="mt-8 space-y-4 text-muted-foreground">
            <p>
              RevenueLeak OS is an open-source platform built for home-service businesses — HVAC, plumbing, electrical, and more — to automatically recover revenue they didn&apos;t know they were losing.
            </p>
            <p>
              Most service businesses leak 15-30% of potential revenue through missed calls, unsold estimates, and customers who simply drift away. RevenueLeak OS detects these opportunities and automates the follow-up so nothing falls through the cracks.
            </p>
            <p>
              Built with Next.js, TypeScript, and Tailwind CSS. Contributions welcome on GitHub.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
