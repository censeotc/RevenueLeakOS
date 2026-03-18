/**
 * Static demo data used when database is not available or for SSR.
 * Also used to populate charts and UI before API data loads.
 */

import { subDays, format } from "date-fns";

export const DEMO_BUSINESS_ID = "north-shore-heating";
export const DEMO_BUSINESS_NAME = "North Shore Heating & Plumbing";

export const DEMO_KPIS = {
  revenueInfluenced: 74500,
  opportunitiesRecovered: 28,
  bookingsCreated: 28,
  avgResponseTimeMin: 4.2,
  estimatesReopened: 11,
  customersReactivated: 8,
  revenueInfluencedDelta: 8.9,
  opportunitiesDelta: 27.3,
  bookingsDelta: 12.5,
};

export const DEMO_WORKFLOW_PERFORMANCE = [
  { name: "Missed Call Follow-Up", sent: 42, replied: 18, booked: 11, revenue: 24800 },
  { name: "Estimate Rescue", sent: 28, replied: 14, booked: 9, revenue: 31500 },
  { name: "Reactivation", sent: 65, replied: 22, booked: 8, revenue: 18200 },
];

export function generateRecoveryTrend(days: number = 30) {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    data.push({
      date: format(date, "MMM d"),
      missedCall: Math.floor(Math.random() * 3),
      estimateRescue: Math.floor(Math.random() * 2),
      reactivation: Math.floor(Math.random() * 2),
    });
  }
  return data;
}

export const DEMO_RECENT_ACTIVITY = [
  { id: "1", action: "opportunity_booked", description: "Robert Caldwell booked AC Tune-Up via missed call recovery", createdAt: subDays(new Date(), 4), contactName: "Robert Caldwell", opportunityTitle: "Missed Call — Robert Caldwell" },
  { id: "2", action: "sms_reply", description: "David Kim replied to missed call follow-up", createdAt: subDays(new Date(), 2), contactName: "David Kim", opportunityTitle: "Missed Call — David Kim" },
  { id: "3", action: "estimate_rescue_booked", description: "Linda Morrison booked furnace replacement — $4,800", createdAt: subDays(new Date(), 11), contactName: "Linda Morrison", opportunityTitle: "Estimate Follow-Up — Furnace Replacement" },
  { id: "4", action: "reactivation_booked", description: "Linda Morrison reactivated — HVAC repair booked ($2,800)", createdAt: subDays(new Date(), 12), contactName: "Linda Morrison", opportunityTitle: "Reactivation — Linda Morrison" },
  { id: "5", action: "opportunity_created", description: "Missed call opportunity created for Chris Delgado (after-hours)", createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), contactName: "Chris Delgado", opportunityTitle: "Missed Call — Chris Delgado" },
  { id: "6", action: "sms_sent", description: "Reactivation message sent to Patricia Nguyen", createdAt: subDays(new Date(), 4), contactName: "Patricia Nguyen", opportunityTitle: "Reactivation — Patricia Nguyen" },
  { id: "7", action: "estimate_marked_stale", description: "Estimate for 200A Panel Upgrade marked stale (21 days)", createdAt: subDays(new Date(), 7), contactName: "Paul Thornton", opportunityTitle: "Estimate Follow-Up — Panel Upgrade" },
];

export const DEMO_ALERTS = [
  { id: "1", type: "warning" as const, title: "4 stale estimates need follow-up", description: "Estimates over 7 days old without a response are losing potential revenue.", actionLabel: "View Estimates", actionHref: "/app/estimates" },
  { id: "2", type: "info" as const, title: "3 missed calls in the last 24 hours", description: "Chris Delgado, Gary Larson, and Ruth Sandoval called after hours.", actionLabel: "View Calls", actionHref: "/app/calls" },
  { id: "3", type: "success" as const, title: "Campaign performance up 27% this month", description: "Missed Call Follow-Up campaign is converting at 26% — above benchmark.", actionLabel: "View Reports", actionHref: "/app/reports" },
];
