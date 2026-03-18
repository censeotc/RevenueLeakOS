import Link from "next/link";

const dataSources = [
  { id: "crm", name: "CRM / ServiceTitan", description: "Import customers and job history" },
  { id: "phone", name: "Phone System / Twilio", description: "Track calls, missed calls, and SMS" },
  { id: "estimates", name: "Estimating Tool", description: "Import estimates and proposal data" },
  { id: "csv", name: "CSV Upload", description: "Upload a spreadsheet of contacts or estimates" },
];

export default function ConnectDataPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">Step 2 of 4</p>
        <h1 className="mt-2 text-3xl font-bold">Connect your data</h1>
        <p className="mt-2 text-muted-foreground">
          Choose which systems to connect. You can skip this and add integrations later.
        </p>
      </div>

      <div className="grid gap-4">
        {dataSources.map((source) => (
          <div key={source.id} className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">{source.name}</p>
              <p className="text-sm text-muted-foreground">{source.description}</p>
            </div>
            <button className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
              Connect
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <Link href="/business-profile" className="rounded-md border px-6 py-2 text-sm font-medium hover:bg-muted">
          Back
        </Link>
        <Link
          href="/choose-workflows"
          className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Next: Choose Workflows
        </Link>
      </div>
    </div>
  );
}
