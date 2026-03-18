import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, TrendingUp, Phone, FileText, Users } from "lucide-react";

export default function HomePage() {
  const leakCategories = [
    {
      icon: Phone,
      title: "Missed Calls",
      description: "Every unanswered call is a job you didn't book. We automatically follow up within minutes.",
      stat: "$2,400 avg recovered per month",
    },
    {
      icon: FileText,
      title: "Unanswered Estimates",
      description: "Most prospects won't follow up on their own. Our sequences close the loop for you.",
      stat: "38% estimate conversion lift",
    },
    {
      icon: Users,
      title: "Lost Customers",
      description: "Win back customers who haven't booked in 6–18 months with targeted reactivation campaigns.",
      stat: "21% reactivation rate",
    },
  ];

  const features = [
    "Automated SMS & email follow-up sequences",
    "Missed call text-back within 60 seconds",
    "Estimate follow-up with smart timing",
    "Reactivation campaigns for dormant customers",
    "Full conversation history & call tracking",
    "Integrates with ServiceTitan, Jobber & more",
    "Real-time revenue attribution dashboard",
    "Role-based team access controls",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="RevenueLeakOS" width={160} height={32} />
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link href="/pricing" className="hover:text-slate-900 transition-colors">Pricing</Link>
            <Link href="/demo" className="hover:text-slate-900 transition-colors">Demo</Link>
            <Link href="/revenue-leakage-audit" className="hover:text-slate-900 transition-colors">Free Audit</Link>
            <Link href="/about" className="hover:text-slate-900 transition-colors">About</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full mb-6">
          <TrendingUp className="h-3.5 w-3.5" />
          Average customer recovers $8,400/month in lost revenue
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6">
          Stop leaking revenue.<br />
          <span className="text-blue-600">Start recovering it.</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          RevenueLeakOS automatically follows up on missed calls, unanswered estimates, and dormant customers so your service business never loses another job to silence.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors"
          >
            Start for free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/demo"
            className="flex items-center gap-2 text-slate-700 px-6 py-3 rounded-lg text-base font-medium border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            See a live demo
          </Link>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="px-6 pb-20 max-w-6xl mx-auto">
        <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-slate-400 text-xs ml-2">RevenueLeakOS Dashboard</span>
          </div>
          <div className="p-6 grid grid-cols-4 gap-4">
            {[
              { label: "Revenue Recovered", value: "$12,840", change: "+18%" },
              { label: "Open Opportunities", value: "24", change: "+6" },
              { label: "Estimates Sent", value: "47", change: "this month" },
              { label: "Conversion Rate", value: "34%", change: "+4%" },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-slate-800 rounded-lg p-4">
                <p className="text-slate-400 text-xs mb-1">{kpi.label}</p>
                <p className="text-white text-2xl font-bold">{kpi.value}</p>
                <p className="text-green-400 text-xs mt-1">{kpi.change}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Leak Categories */}
      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Where revenue leaks happen</h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Most service businesses leak 15–30% of potential revenue through these three channels. RevenueLeakOS plugs all of them.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {leakCategories.map((category) => (
              <div key={category.title} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <category.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{category.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{category.description}</p>
                <div className="text-blue-600 text-sm font-medium">{category.stat}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to recover lost revenue</h2>
            <p className="text-slate-600 mb-8">
              Built specifically for home service businesses. No bloated CRM features you'll never use — just the tools that directly impact your bottom line.
            </p>
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-slate-700">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
            <div className="space-y-4">
              {[
                { time: "2:14 PM", event: "Missed call from Robert Davis", action: "SMS sent automatically", status: "recovered" },
                { time: "2:19 PM", event: "Estimate #1047 viewed by Jennifer M.", action: "Follow-up scheduled for Day 2", status: "pending" },
                { time: "2:31 PM", event: "William B. reply: 'Yes, let's book it'", action: "Opportunity marked WON", status: "won" },
              ].map((item) => (
                <div key={item.event} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">{item.time}</p>
                      <p className="text-sm font-medium text-slate-800">{item.event}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.action}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                      item.status === "won" ? "bg-green-100 text-green-700" :
                      item.status === "recovered" ? "bg-blue-100 text-blue-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to stop the leaks?</h2>
          <p className="text-blue-100 mb-8">
            Join hundreds of home service businesses recovering thousands in lost revenue every month.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Start free trial
            </Link>
            <Link
              href="/revenue-leakage-audit"
              className="text-white border border-blue-400 px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get free revenue audit
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Image src="/logo.svg" alt="RevenueLeakOS" width={140} height={28} />
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/pricing" className="hover:text-slate-900">Pricing</Link>
            <Link href="/about" className="hover:text-slate-900">About</Link>
            <Link href="/contact" className="hover:text-slate-900">Contact</Link>
          </div>
          <p className="text-sm text-slate-400">© 2025 RevenueLeakOS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
