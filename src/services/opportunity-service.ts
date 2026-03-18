import { DEMO_BUSINESS_ID } from "@/lib/demo-session";
import { getPilotDataSnapshot } from "@/services/pilot-data";
import { projectDashboardSummaryAfterBooking } from "@/services/reporting-service";
import { twilioMockService } from "@/services/twilio-mock";

export async function getOpportunityPageData(businessId = DEMO_BUSINESS_ID) {
  const snapshot = await getPilotDataSnapshot(businessId);

  return {
    opportunities: snapshot.opportunities,
    contacts: snapshot.contacts,
    users: snapshot.users,
    messages: snapshot.messages,
  };
}

export async function getOpportunitySummary(businessId = DEMO_BUSINESS_ID) {
  const snapshot = await getPilotDataSnapshot(businessId);

  return {
    total: snapshot.opportunities.length,
    open: snapshot.opportunities.filter((opportunity) => !["won", "lost", "closed"].includes(opportunity.status)).length,
    missedCalls: snapshot.opportunities.filter((opportunity) => opportunity.type === "missed_call").length,
    estimateRescues: snapshot.opportunities.filter((opportunity) => opportunity.type === "estimate_rescue").length,
    reactivations: snapshot.opportunities.filter((opportunity) => opportunity.type === "reactivation").length,
  };
}

export async function getDemoWalkthroughScenario(businessId = DEMO_BUSINESS_ID) {
  const snapshot = await getPilotDataSnapshot(businessId);
  const businessPhone = snapshot.business.phone || "(313) 555-0100";
  const bookingValue = 425;
  const customer = {
    firstName: "Ava",
    lastName: "Collins",
    phone: "+13135551099",
    need: "AC repair today",
  };
  const callTime = new Date(Date.now() - 14 * 60 * 1000);
  const replyTime = new Date(Date.now() - 10 * 60 * 1000);
  const bookingTime = new Date(Date.now() - 5 * 60 * 1000);
  const smsBody = twilioMockService.buildMissedCallReplyTemplate(
    customer.firstName,
    snapshot.business.name,
    businessPhone
  );

  const dashboardAfter = projectDashboardSummaryAfterBooking(
    snapshot.dashboardSummary,
    bookingValue
  );

  return {
    business: snapshot.business,
    dashboardBefore: snapshot.dashboardSummary,
    dashboardAfter,
    call: {
      id: "walkthrough_call",
      callerName: `${customer.firstName} ${customer.lastName}`,
      callerNumber: customer.phone,
      calledNumber: businessPhone,
      status: "missed" as const,
      callTime,
    },
    opportunity: {
      id: "walkthrough_opp",
      title: `Missed call - ${customer.firstName} ${customer.lastName}`,
      type: "missed_call" as const,
      status: "booked" as const,
      estimatedValue: bookingValue,
      assignedTo: snapshot.users.find((user) => user.role === "csr") || snapshot.users[0],
    },
    smsSent: {
      id: "walkthrough_sms_outbound",
      body: smsBody,
      status: "delivered" as const,
      sentAt: new Date(Date.now() - 13 * 60 * 1000),
    },
    smsReply: {
      id: "walkthrough_sms_inbound",
      body: `Hi, I need ${customer.need}. Can someone come out this afternoon?`,
      receivedAt: replyTime,
    },
    booking: {
      id: "walkthrough_booking",
      title: "Same-day AC diagnostic",
      serviceType: "Cooling Repair",
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      estimatedValue: bookingValue,
      loggedAt: bookingTime,
    },
    steps: [
      {
        id: "missed-call",
        title: "Missed call",
        description: `${customer.firstName} called the office and the call was missed after-hours.`,
        timestamp: callTime,
      },
      {
        id: "opportunity-created",
        title: "Opportunity created",
        description: "RevenueLeak OS opened a missed-call opportunity and routed it to the CSR queue.",
        timestamp: new Date(Date.now() - 13.5 * 60 * 1000),
      },
      {
        id: "sms-sent",
        title: "SMS sent",
        description: "The Twilio mock service delivered the recovery text instantly.",
        timestamp: new Date(Date.now() - 13 * 60 * 1000),
      },
      {
        id: "reply-received",
        title: "Reply received",
        description: `${customer.firstName} replied with the service need and preferred timing.`,
        timestamp: replyTime,
      },
      {
        id: "booking-logged",
        title: "Booking logged",
        description: "CSR confirmed the slot and logged the booking against the opportunity.",
        timestamp: bookingTime,
      },
      {
        id: "dashboard-updated",
        title: "Dashboard updated",
        description: "Recovered revenue, bookings, and response metrics reflect the new conversion.",
        timestamp: new Date(Date.now() - 4 * 60 * 1000),
      },
    ],
  };
}
