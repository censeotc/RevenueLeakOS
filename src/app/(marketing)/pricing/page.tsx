import Link from "next/link";
import { CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for service businesses of every size.",
};

const plans = [
  {
    name: "Starter",
    price: 97,
    description: "Perfect for solo operators and small crews getting started with revenue recovery.",
    features: [
      "Up to 250 contacts",
      "Missed call text-back",
      "3 active campaigns",
      "SMS & email templates",
      "Basic reporting",
      "1 user",
    ],
    cta: "Start free trial",
    href: "/signup?plan=starter",
    highlighted: false,
  },
  {
    name: "Growth",
    price: 247,
    description: "For growing businesses ready to systematize their revenue recovery across every channel.",
    features: [
      "Up to 2,500 contacts",
      "Missed call text-back",
      "Estimate follow-up sequences",
      "Reactivation campaigns",
      "Unlimited campaigns",
      "Full attribution reporting",
      "CSV import/export",
      "5 users",
      "Integrations (ServiceTitan, Jobber)",
    ],
    cta: "Start free trial",
    href: "/signup?plan=growth",
    highlighted: true,
  },
  {
    name: "Scale",
    price: 497,
    description: "For multi-location operations that need enterprise controls and white-glove support.",
    features: [
      "Unlimited contacts",
      "Everything in Growth",
      "Multi-location support",
      "Custom workflows",
      "Advanced permissions",
      "Dedicated onboarding",
      "Priority support",
      "Unlimited users",
      "API access",
    ],
    cta: "Talk to sales",
    href: "/contact?inquiry=scale",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Simple, predictable pricing</h1>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            No per-seat surprises. No hidden fees. Just a single monthly investment that pays for itself in the first recovered job.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border ${
                plan.highlighted
                  ? "border-blue-600 bg-blue-600 text-white shadow-xl scale-105"
                  : "border-slate-200 bg-white"
              }`}
            >
              <h2 className={`text-xl font-bold mb-2 ${plan.highlighted ? "text-white" : "text-slate-900"}`}>
                {plan.name}
              </h2>
              <div className="flex items-baseline gap-1 mb-4">
                <span className={`text-4xl font-bold ${plan.highlighted ? "text-white" : "text-slate-900"}`}>
                  ${plan.price}
                </span>
                <span className={`text-sm ${plan.highlighted ? "text-blue-100" : "text-slate-500"}`}>/month</span>
              </div>
              <p className={`text-sm mb-6 ${plan.highlighted ? "text-blue-100" : "text-slate-600"}`}>
                {plan.description}
              </p>
              <Link
                href={plan.href}
                className={`block text-center py-2.5 rounded-lg font-medium text-sm mb-8 transition-colors ${
                  plan.highlighted
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {plan.cta}
              </Link>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle className={`h-4 w-4 flex-shrink-0 ${plan.highlighted ? "text-blue-200" : "text-green-500"}`} />
                    <span className={plan.highlighted ? "text-blue-100" : "text-slate-700"}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <Link href="/revenue-leakage-audit" className="text-blue-600 hover:underline text-sm">
            Not sure which plan? Take our free revenue leakage audit →
          </Link>
        </div>
      </div>
    </div>
  );
}
