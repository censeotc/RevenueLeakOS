import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Phone, FileText, Target, Megaphone, RotateCcw,
  BarChart3, Plug, CheckCircle, ArrowRight, Play,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  actions: string[];
}

const steps: WalkthroughStep[] = [
  {
    id: "dashboard",
    title: "1. Explore the Dashboard",
    description: "See the 30-day overview of revenue influenced, opportunities recovered, bookings, and response times. Click alerts and activity items to navigate.",
    icon: <BarChart3 size={20} className="text-primary-500" />,
    route: "/app/dashboard",
    actions: [
      "Review the 6 KPI cards at top",
      "Click on an alert to see opportunities",
      "Check upcoming bookings",
      "Review recent activity feed",
    ],
  },
  {
    id: "calls",
    title: "2. Missed Call Recovery Flow",
    description: "The Calls page shows the Twilio mock integration. Simulate a missed call, see it appear in the log, then call back.",
    icon: <Phone size={20} className="text-danger-500" />,
    route: "/app/calls",
    actions: [
      "Click 'Simulate Missed Call' to generate a missed call",
      "Watch the toast notification appear",
      "Click 'Call Back' on a missed call row",
      "Filter by missed/inbound/outbound",
    ],
  },
  {
    id: "estimates",
    title: "3. Stale Estimate Recovery",
    description: "View estimates grouped by status. Stale estimates are revenue leaking out. Try the follow-up action and CSV import.",
    icon: <FileText size={20} className="text-warning-500" />,
    route: "/app/estimates",
    actions: [
      "Filter to 'Stale' to see at-risk revenue",
      "Click 'Follow Up' on a stale estimate",
      "Try 'Import CSV' to see the import scaffold",
      "Download the CSV template",
    ],
  },
  {
    id: "opportunities",
    title: "4. Manage Opportunities",
    description: "Every missed call, stale estimate, and reactivation creates an opportunity. Move them through the pipeline with status changes and assignments.",
    icon: <Target size={20} className="text-success-500" />,
    route: "/app/opportunities",
    actions: [
      "Filter by type: Missed Call, Estimate Rescue, Reactivation",
      "Assign an opportunity to a team member",
      "Advance status through the pipeline",
      "Mark as Won or Lost",
    ],
  },
  {
    id: "campaigns",
    title: "5. Review Campaigns",
    description: "Campaigns are multi-step automated sequences. See the Winter Furnace Check-Up running with real metrics.",
    icon: <Megaphone size={20} className="text-purple-500" />,
    route: "/app/campaigns",
    actions: [
      "Review response rates and booking rates",
      "See campaign step sequences",
      "Try launching the draft Spring AC Prep campaign",
    ],
  },
  {
    id: "reactivation",
    title: "6. Reactivation Segments",
    description: "See dormant customer segments and their lifetime value at risk. Start targeted campaigns to win them back.",
    icon: <RotateCcw size={20} className="text-amber-500" />,
    route: "/app/reactivation",
    actions: [
      "Review the three dormant customer segments",
      "Check lifetime value at risk",
      "Click 'Start Campaign' on a segment",
      "Review individual reactivation opportunities",
    ],
  },
  {
    id: "reports",
    title: "7. Check Reports",
    description: "The Reports page aggregates all metrics with period-over-period comparisons and breakdowns by opportunity type.",
    icon: <BarChart3 size={20} className="text-blue-500" />,
    route: "/app/reports",
    actions: [
      "Review revenue influenced vs recovered",
      "Check opportunity breakdown bars",
      "Compare current vs previous period in the table",
    ],
  },
  {
    id: "integrations",
    title: "8. Check Integrations",
    description: "See connected services (Twilio, Google Calendar) and available integrations. Try connecting a disconnected service.",
    icon: <Plug size={20} className="text-gray-500" />,
    route: "/app/integrations",
    actions: [
      "See which integrations are connected",
      "Click 'Connect' on a disconnected integration",
      "Click 'Sync' on a connected integration",
    ],
  },
];

export function WalkthroughPage() {
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  function toggleStep(id: string) {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
            <BookOpen size={20} className="text-primary-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Demo Walkthrough</h1>
            <p className="text-sm text-gray-500">Follow these steps to explore RevenueLeak OS</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 h-2 bg-gray-100 rounded-full">
            <div
              className="h-2 bg-primary-500 rounded-full transition-all"
              style={{ width: `${(completedSteps.size / steps.length) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-600">
            {completedSteps.size}/{steps.length} completed
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step) => {
          const isDone = completedSteps.has(step.id);
          return (
            <Card key={step.id} className={isDone ? "bg-success-50/30 border-success-200" : ""}>
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleStep(step.id)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isDone
                      ? "bg-success-500 border-success-500 text-white"
                      : "border-gray-300 hover:border-primary-400"
                  }`}
                >
                  {isDone && <CheckCircle size={16} />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {step.icon}
                    <h3 className={`text-sm font-semibold ${isDone ? "text-success-700 line-through" : "text-gray-900"}`}>
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{step.description}</p>

                  <div className="space-y-1.5 mb-3">
                    {step.actions.map((action, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                        <ArrowRight size={10} className="text-gray-400 shrink-0" />
                        {action}
                      </div>
                    ))}
                  </div>

                  <Button
                    variant={isDone ? "ghost" : "secondary"}
                    size="sm"
                    onClick={() => navigate(step.route)}
                  >
                    <Play size={12} />
                    {isDone ? "Revisit" : "Go to"} {step.title.replace(/^\d+\.\s/, "")}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {completedSteps.size === steps.length && (
        <Card className="bg-success-50 border-success-200">
          <div className="text-center py-4">
            <CheckCircle size={32} className="text-success-500 mx-auto mb-2" />
            <h2 className="text-lg font-bold text-success-800">Walkthrough Complete!</h2>
            <p className="text-sm text-success-600 mt-1">
              You've explored all major features of RevenueLeak OS. The app is ready for pilot review.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
