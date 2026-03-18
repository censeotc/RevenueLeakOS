"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Metadata } from "next";

const auditSchema = z.object({
  businessName: z.string().min(2, "Required"),
  ownerName: z.string().min(2, "Required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  industry: z.string().min(1, "Select your industry"),
  monthlyLeads: z.string().min(1, "Required"),
  estimateCloseRate: z.string().min(1, "Required"),
  avgJobValue: z.string().min(1, "Required"),
  missedCallsPerWeek: z.string().min(1, "Required"),
});

type AuditFormData = z.infer<typeof auditSchema>;

export default function RevenueLeakageAuditPage() {
  const [submitted, setSubmitted] = useState(false);
  const [recoveryEstimate, setRecoveryEstimate] = useState<number | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuditFormData>({
    resolver: zodResolver(auditSchema),
  });

  function onSubmit(data: AuditFormData) {
    const monthlyLeads = parseInt(data.monthlyLeads, 10);
    const closeRate = parseInt(data.estimateCloseRate, 10) / 100;
    const avgJobValue = parseInt(data.avgJobValue, 10);
    const missedCalls = parseInt(data.missedCallsPerWeek, 10) * 4;

    const estimateLeakage = monthlyLeads * (1 - closeRate) * 0.15 * avgJobValue;
    const callLeakage = missedCalls * closeRate * avgJobValue * 0.3;
    const total = Math.round(estimateLeakage + callLeakage);

    setRecoveryEstimate(total);
    setSubmitted(true);
  }

  if (submitted && recoveryEstimate !== null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Your estimated revenue leakage</h2>
          <div className="text-5xl font-bold text-blue-600 mb-4">
            ${recoveryEstimate.toLocaleString()}<span className="text-2xl text-slate-400">/mo</span>
          </div>
          <p className="text-slate-600 mb-8">
            Based on your inputs, we estimate you could recover up to this much revenue each month by closing the gaps in your follow-up process.
          </p>
          <a
            href="/signup"
            className="block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-3"
          >
            Start recovering revenue today
          </a>
          <a href="/demo" className="text-blue-600 text-sm hover:underline">
            See a demo first →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full mb-4">
            Free — takes 2 minutes
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Free Revenue Leakage Audit</h1>
          <p className="text-slate-600">
            Answer a few questions about your business and we'll calculate exactly how much revenue you're leaving on the table each month.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business name</label>
              <input {...register("businessName")} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your name</label>
              <input {...register("ownerName")} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.ownerName && <p className="text-red-500 text-xs mt-1">{errors.ownerName.message}</p>}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input {...register("email")} type="email" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input {...register("phone")} type="tel" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
            <select {...register("industry")} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select industry</option>
              <option value="hvac">HVAC</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="roofing">Roofing</option>
              <option value="landscaping">Landscaping</option>
              <option value="cleaning">Cleaning</option>
              <option value="other">Other home services</option>
            </select>
            {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Monthly new leads</label>
              <input {...register("monthlyLeads")} type="number" min="1" placeholder="e.g. 80" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.monthlyLeads && <p className="text-red-500 text-xs mt-1">{errors.monthlyLeads.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estimate close rate (%)</label>
              <input {...register("estimateCloseRate")} type="number" min="1" max="100" placeholder="e.g. 45" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.estimateCloseRate && <p className="text-red-500 text-xs mt-1">{errors.estimateCloseRate.message}</p>}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Average job value ($)</label>
              <input {...register("avgJobValue")} type="number" min="1" placeholder="e.g. 1800" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.avgJobValue && <p className="text-red-500 text-xs mt-1">{errors.avgJobValue.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Missed calls per week</label>
              <input {...register("missedCallsPerWeek")} type="number" min="0" placeholder="e.g. 5" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.missedCallsPerWeek && <p className="text-red-500 text-xs mt-1">{errors.missedCallsPerWeek.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Calculate my revenue leakage
          </button>
        </form>
      </div>
    </div>
  );
}
