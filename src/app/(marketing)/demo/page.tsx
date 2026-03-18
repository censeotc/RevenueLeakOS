import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Demo",
  description: "See RevenueLeakOS in action with a live interactive demo.",
};

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">See RevenueLeakOS in action</h1>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            Walk through a live demo with real data from a fictional HVAC company. No signup required.
          </p>
        </div>

        <div className="bg-slate-100 rounded-2xl aspect-video flex items-center justify-center mb-10">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-slate-600">Interactive demo walkthrough</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/app/demo-walkthrough"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Launch interactive demo
          </Link>
          <Link
            href="/signup"
            className="text-slate-700 border border-slate-200 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Start free trial
          </Link>
        </div>
      </div>
    </div>
  );
}
