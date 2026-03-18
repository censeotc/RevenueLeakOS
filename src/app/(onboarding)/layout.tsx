import Link from "next/link";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <Link href="/" className="text-xl font-bold">RevenueLeak OS</Link>
        </div>
      </header>
      <main className="flex-1">
        <div className="container max-w-2xl py-12">{children}</div>
      </main>
    </div>
  );
}
