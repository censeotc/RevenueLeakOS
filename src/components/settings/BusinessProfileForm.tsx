"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

interface BusinessProfileFormData {
  name: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  timezone: string;
}

export function BusinessProfileForm() {
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit } = useForm<BusinessProfileFormData>({
    defaultValues: {
      name: "Demo HVAC Pros",
      phone: "(555) 000-1234",
      email: "owner@demohvacpros.com",
      city: "Austin",
      state: "TX",
      timezone: "America/Chicago",
    },
  });

  async function onSubmit(_data: BusinessProfileFormData) {
    await new Promise((r) => setTimeout(r, 500));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white rounded-xl border border-slate-100 p-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Business name</label>
          <input {...register("name")} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input {...register("phone")} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input {...register("email")} type="email" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
          <input {...register("website")} type="url" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
        <select {...register("timezone")} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="America/New_York">Eastern (ET)</option>
          <option value="America/Chicago">Central (CT)</option>
          <option value="America/Denver">Mountain (MT)</option>
          <option value="America/Los_Angeles">Pacific (PT)</option>
        </select>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
