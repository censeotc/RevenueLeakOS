import type { DemoStateFrame, WalkthroughStep } from "@/types/revenue";

export const walkthroughSteps: WalkthroughStep[] = [
  { id: "step-1", title: "Capture the leak", description: "Normalize missed calls, stale estimates, and dormant contacts into a single opportunity queue.", outcome: "Operators see where revenue is slipping before it becomes lost demand." },
  { id: "step-2", title: "Automate the first touch", description: "Launch role-aware workflows with templates, escalation rules, and fallback channels.", outcome: "Teams reduce response time while preserving human handoff points." },
  { id: "step-3", title: "Prove attribution", description: "Connect downstream bookings back to opportunities, campaigns, and owners.", outcome: "Leadership can separate direct revenue from influenced revenue at the workflow level." }
];
export const demoStateFrames: DemoStateFrame[] = [
  { id: "frame-1", title: "Leak detected", summary: "A missed after-hours plumbing call creates a high-priority opportunity instantly.", highlight: "The dashboard flags the lead inside the service-line queue with a suggested SMS." },
  { id: "frame-2", title: "Engagement sequence", summary: "The estimate rescue workflow sends an SMS, then queues a CSR callback if unanswered.", highlight: "Campaign steps surface owner visibility and next best action timing." },
  { id: "frame-3", title: "Revenue attributed", summary: "Booked work is recorded back against the originating opportunity and campaign.", highlight: "Reports show both direct recovery and influenced revenue lift for leadership review." }
];
