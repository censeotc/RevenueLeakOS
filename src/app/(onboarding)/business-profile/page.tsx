import Link from "next/link";

export default function BusinessProfilePage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">Step 1 of 4</p>
        <h1 className="mt-2 text-3xl font-bold">Tell us about your business</h1>
        <p className="mt-2 text-muted-foreground">
          We&apos;ll use this information to set up your account and personalize your experience.
        </p>
      </div>

      <form className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="business-name" className="text-sm font-medium">Business name</label>
          <input
            id="business-name"
            type="text"
            placeholder="Comfort Air HVAC"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="industry" className="text-sm font-medium">Industry</label>
          <select id="industry" className="w-full rounded-md border bg-background px-3 py-2 text-sm">
            <option value="hvac">HVAC</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="roofing">Roofing</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">Business phone</label>
          <input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="website" className="text-sm font-medium">Website (optional)</label>
          <input
            id="website"
            type="url"
            placeholder="https://example.com"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="flex justify-end pt-4">
          <Link
            href="/connect-data"
            className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Next: Connect Data
          </Link>
        </div>
      </form>
    </div>
  );
}
