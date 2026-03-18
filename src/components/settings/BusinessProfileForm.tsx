"use client";

import { useState } from "react";

interface BusinessProfileFormProps {
  initialData?: {
    name: string;
    industry: string;
    phone: string;
    website: string;
  };
  onSave?: (data: { name: string; industry: string; phone: string; website: string }) => void;
}

export function BusinessProfileForm({ initialData, onSave }: BusinessProfileFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [industry, setIndustry] = useState(initialData?.industry ?? "hvac");
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [website, setWebsite] = useState(initialData?.website ?? "");

  return (
    <div className="space-y-4 rounded-lg border p-6">
      <h3 className="text-lg font-semibold">Business Profile</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="bp-name" className="text-sm font-medium">Business name</label>
          <input id="bp-name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
        </div>
        <div className="space-y-2">
          <label htmlFor="bp-industry" className="text-sm font-medium">Industry</label>
          <select id="bp-industry" value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
            <option value="hvac">HVAC</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="roofing">Roofing</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="bp-phone" className="text-sm font-medium">Phone</label>
          <input id="bp-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
        </div>
        <div className="space-y-2">
          <label htmlFor="bp-website" className="text-sm font-medium">Website</label>
          <input id="bp-website" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
        </div>
      </div>
      <button
        onClick={() => onSave?.({ name, industry, phone, website })}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Save Changes
      </button>
    </div>
  );
}
