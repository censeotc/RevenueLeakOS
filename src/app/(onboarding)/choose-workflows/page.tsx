import Link from "next/link";

const workflows = [
  { id: "estimate_followup", name: "Estimate Follow-Up", description: "Automatically follow up on unsold estimates with a 3-step SMS/email sequence" },
  { id: "missed_call", name: "Missed Call Callback", description: "Detect missed calls and trigger an instant callback or text-back" },
  { id: "reactivation", name: "Customer Reactivation", description: "Re-engage customers who haven't booked in 6+ months" },
];

export default function ChooseWorkflowsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">Step 3 of 4</p>
        <h1 className="mt-2 text-3xl font-bold">Choose your workflows</h1>
        <p className="mt-2 text-muted-foreground">
          Select the revenue recovery workflows you want to activate. You can adjust these later.
        </p>
      </div>

      <div className="grid gap-4">
        {workflows.map((wf) => (
          <label key={wf.id} className="flex items-start gap-4 rounded-lg border p-4 cursor-pointer hover:bg-muted/40">
            <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded" />
            <div>
              <p className="font-medium">{wf.name}</p>
              <p className="text-sm text-muted-foreground">{wf.description}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <Link href="/connect-data" className="rounded-md border px-6 py-2 text-sm font-medium hover:bg-muted">
          Back
        </Link>
        <Link
          href="/launch"
          className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Next: Launch
        </Link>
      </div>
    </div>
  );
}
