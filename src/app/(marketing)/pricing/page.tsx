import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "For small teams getting started with revenue recovery",
    features: ["Up to 100 contacts", "1 active campaign", "Basic reporting", "Community support"],
  },
  {
    name: "Growth",
    price: "$99/mo",
    description: "For growing businesses ready to automate follow-up",
    features: ["Unlimited contacts", "Unlimited campaigns", "SMS & email channels", "Advanced reporting", "Twilio integration", "Priority support"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For multi-location businesses with complex needs",
    features: ["Everything in Growth", "Custom integrations", "Dedicated onboarding", "SLA & uptime guarantee", "SSO & RBAC"],
  },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <Link href="/" className="text-xl font-bold">RevenueLeak OS</Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="container py-16 text-center">
          <h1 className="text-4xl font-bold">Simple, transparent pricing</h1>
          <p className="mt-4 text-muted-foreground">Start free. Upgrade when you&apos;re ready.</p>
        </section>

        <section className="container grid gap-8 pb-16 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg border p-8 ${plan.highlighted ? "border-primary shadow-lg" : ""}`}
            >
              <h2 className="text-xl font-bold">{plan.name}</h2>
              <p className="mt-1 text-3xl font-bold">{plan.price}</p>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-primary">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`mt-8 block rounded-md px-4 py-2 text-center text-sm font-medium ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border hover:bg-muted"
                }`}
              >
                Get started
              </Link>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
