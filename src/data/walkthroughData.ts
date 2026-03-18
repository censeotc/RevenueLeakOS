import type { WalkthroughStep } from "@/types/revenue";

export const walkthroughSteps: WalkthroughStep[] = [
  {
    id: "w1",
    title: "Missed call detected",
    description: "Robert Davis called at 2:14 PM but no one answered. RevenueLeakOS detects this instantly via Twilio.",
    duration: 4000,
    visualization: null,
  },
  {
    id: "w2",
    title: "Opportunity created",
    description: "An opportunity worth an estimated $3,200 is automatically created and added to your pipeline.",
    duration: 4000,
    visualization: "opportunity",
  },
  {
    id: "w3",
    title: "Automated SMS sent",
    description: "Within 60 seconds, a personalized text is sent to Robert: \"Hi Robert, sorry we missed your call...\"",
    duration: 5000,
    visualization: "sms",
  },
  {
    id: "w4",
    title: "Customer replies",
    description: "Robert replies 47 minutes later: \"Yes, I need someone to look at my AC. Can you come Wednesday?\"",
    duration: 4000,
    visualization: "sms",
  },
  {
    id: "w5",
    title: "Job booked — opportunity won!",
    description: "The opportunity is marked WON. $3,200 in revenue recovered from a call that would have gone cold.",
    duration: 5000,
    visualization: "won",
  },
];
