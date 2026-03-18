import type { WalkthroughStep } from "@/types/revenue";

export const walkthroughSteps: WalkthroughStep[] = [
  {
    id: "step-1",
    title: "Your Revenue Dashboard",
    description:
      "See your total recoverable revenue, current recovery rate, and open opportunities at a glance. The dashboard updates in real time as your team works opportunities.",
    target: "dashboard",
  },
  {
    id: "step-2",
    title: "Opportunity Pipeline",
    description:
      "Every missed call, unsold estimate, and lapsed customer appears here automatically. Filter by type, status, or value to focus on what matters most.",
    target: "opportunities",
  },
  {
    id: "step-3",
    title: "Automated Follow-Up",
    description:
      "Set up multi-step SMS and email campaigns that trigger when an estimate goes unsold or a call is missed. Each step fires after a configurable delay.",
    target: "campaigns",
  },
  {
    id: "step-4",
    title: "Customer Reactivation",
    description:
      "Segment lapsed customers by time since last service. Preview the audience, estimate the revenue potential, and launch a reactivation campaign in one click.",
    target: "reactivation",
  },
  {
    id: "step-5",
    title: "Reports & Attribution",
    description:
      "Understand which workflows drive the most recovered revenue. Compare direct vs. influenced attribution and track conversion rates over time.",
    target: "reports",
  },
];
