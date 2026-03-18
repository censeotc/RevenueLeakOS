import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind RevenueLeakOS and why we built it for home service businesses.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">About RevenueLeakOS</h1>
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 mb-6">
            RevenueLeakOS was built by operators who've run home service businesses and watched revenue slip away through the cracks — missed calls, estimates that went cold, and loyal customers who just never came back.
          </p>
          <p className="text-slate-600 mb-6">
            We believe every service business deserves the same automated follow-up infrastructure that enterprise companies use, without the six-figure software budget or the team of SDRs to run it.
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Our mission</h2>
          <p className="text-slate-600 mb-6">
            To help independent home service businesses recover the revenue they've already earned — by never letting a lead, estimate, or customer fall through the cracks again.
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Built for the trades</h2>
          <p className="text-slate-600">
            We're not a generic CRM trying to serve every industry. RevenueLeakOS is purpose-built for HVAC, plumbing, electrical, roofing, and other home service trades. Every workflow, every template, every report was designed with your business model in mind.
          </p>
        </div>
      </div>
    </div>
  );
}
