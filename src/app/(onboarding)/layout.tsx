import Link from "next/link";
import Image from "next/image";

const steps = [
  { label: "Business Profile", href: "/business-profile" },
  { label: "Connect Data", href: "/connect-data" },
  { label: "Choose Workflows", href: "/choose-workflows" },
  { label: "Launch", href: "/launch" },
];

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.svg" alt="RevenueLeakOS" width={140} height={28} />
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-1">
                <div className="flex items-center gap-2 px-3 py-1 text-sm text-slate-400">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 text-xs flex items-center justify-center font-medium">
                    {i + 1}
                  </span>
                  {step.label}
                </div>
                {i < steps.length - 1 && (
                  <svg className="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
          <div />
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-12">{children}</main>
    </div>
  );
}
