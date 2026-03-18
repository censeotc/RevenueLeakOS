"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const profileSchema = z.object({
  businessName: z.string().min(2, "Required"),
  industry: z.string().min(1, "Select your industry"),
  phone: z.string().min(10, "Enter a valid phone"),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  address: z.string().min(5, "Required"),
  city: z.string().min(2, "Required"),
  state: z.string().min(2, "Required"),
  zip: z.string().min(5, "Required"),
  timezone: z.string().min(1, "Select your timezone"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function BusinessProfilePage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  async function onSubmit(_data: ProfileFormData) {
    await new Promise((r) => setTimeout(r, 500));
    window.location.href = "/connect-data";
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Set up your business profile</h1>
      <p className="text-slate-500 text-sm mb-8">This information helps us personalize your follow-up templates and reporting.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white rounded-xl border border-slate-100 p-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Business name</label>
          <input {...register("businessName")} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
            <select {...register("industry")} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select</option>
              <option value="hvac">HVAC</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="roofing">Roofing</option>
              <option value="landscaping">Landscaping</option>
              <option value="cleaning">Cleaning</option>
              <option value="other">Other</option>
            </select>
            {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Business phone</label>
            <input {...register("phone")} type="tel" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Website (optional)</label>
          <input {...register("website")} type="url" placeholder="https://yourbusiness.com" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
          <input {...register("address")} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
            <input {...register("city")} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
            <input {...register("state")} maxLength={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ZIP</label>
            <input {...register("zip")} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
          <select {...register("timezone")} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select timezone</option>
            <option value="America/New_York">Eastern (ET)</option>
            <option value="America/Chicago">Central (CT)</option>
            <option value="America/Denver">Mountain (MT)</option>
            <option value="America/Los_Angeles">Pacific (PT)</option>
            <option value="America/Phoenix">Arizona (MT no DST)</option>
          </select>
          {errors.timezone && <p className="text-red-500 text-xs mt-1">{errors.timezone.message}</p>}
        </div>

        <div className="flex items-center justify-between pt-2">
          <Link href="/login" className="text-sm text-slate-500 hover:text-slate-700">
            Back
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
