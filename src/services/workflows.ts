import { getTwilioService } from "./twilio";
import { twilioMockService } from "./twilio-mock";

export interface MissedCallWorkflowInput {
  callerNumber: string;
  calledNumber: string;
  callerName?: string;
  businessId: string;
  businessName: string;
  businessPhone: string;
}

export interface MissedCallWorkflowResult {
  callEvent: {
    id: string;
    callerNumber: string;
    status: "missed";
    callTime: Date;
  };
  contact: {
    id: string;
    firstName: string;
    lastName: string;
    isNew: boolean;
  };
  opportunity: {
    id: string;
    type: "missed_call";
    status: "new";
    title: string;
  };
  messageSent: {
    id: string;
    body: string;
    status: string;
  };
}

export async function executeMissedCallWorkflow(
  input: MissedCallWorkflowInput
): Promise<MissedCallWorkflowResult> {
  const twilio = getTwilioService();
  const callId = `call_mock_${Date.now()}`;
  const contactId = `ct_mock_${Date.now()}`;
  const oppId = `opp_mock_${Date.now()}`;
  const msgId = `msg_mock_${Date.now()}`;
  const inboundCall = await twilio.simulateInboundCall({
    from: input.callerNumber,
    to: input.calledNumber,
  });

  const callEvent = {
    id: callId,
    callerNumber: input.callerNumber,
    status: "missed" as const,
    callTime: inboundCall.timestamp,
  };

  const firstName = input.callerName?.split(" ")[0] || "Customer";
  const lastName = input.callerName?.split(" ").slice(1).join(" ") || "";

  const contact = {
    id: contactId,
    firstName,
    lastName,
    isNew: true,
  };

  const opportunity = {
    id: oppId,
    type: "missed_call" as const,
    status: "new" as const,
    title: `Missed call - ${firstName} ${lastName}`.trim(),
  };

  const smsBody = twilioMockService.buildMissedCallReplyTemplate(
    firstName,
    input.businessName,
    input.businessPhone
  );

  const smsResult = await twilio.sendSMS({
    to: input.callerNumber,
    from: input.calledNumber,
    body: smsBody,
  });

  const messageSent = {
    id: msgId,
    body: smsBody,
    status: smsResult.status,
  };

  return { callEvent, contact, opportunity, messageSent };
}

export interface SimulateReplyInput {
  fromNumber: string;
  body: string;
  opportunityId: string;
}

export async function simulateReply(input: SimulateReplyInput) {
  const inbound = await getTwilioService().simulateInboundSMS(input.fromNumber, input.body);
  return {
    messageEvent: {
      id: `msg_mock_${Date.now()}`,
      channel: "sms",
      direction: "inbound",
      body: input.body,
      receivedAt: inbound.receivedAt,
      opportunityId: input.opportunityId,
    },
    opportunityUpdate: {
      status: "responded",
    },
  };
}

export interface LogBookingInput {
  opportunityId: string;
  contactId: string;
  businessId: string;
  title: string;
  serviceType: string;
  scheduledAt: Date;
  estimatedValue: number;
  bookedById: string;
}

export function logBooking(input: LogBookingInput) {
  return {
    booking: {
      id: `bk_mock_${Date.now()}`,
      title: input.title,
      serviceType: input.serviceType,
      scheduledAt: input.scheduledAt,
      estimatedValue: input.estimatedValue,
      status: "scheduled",
      contactId: input.contactId,
      opportunityId: input.opportunityId,
      businessId: input.businessId,
      bookedById: input.bookedById,
    },
    opportunityUpdate: {
      status: "booked",
      actualValue: input.estimatedValue,
      resolvedAt: new Date(),
    },
  };
}

export interface EstimateRescueInput {
  estimateId: string;
  contactId: string;
  businessId: string;
  amount: number;
  serviceType: string;
  contactFirstName: string;
}

export function createEstimateRescueOpportunity(input: EstimateRescueInput) {
  return {
    opportunity: {
      id: `opp_mock_${Date.now()}`,
      type: "estimate_rescue" as const,
      status: "new" as const,
      title: `Stale estimate - ${input.contactFirstName}`,
      description: `${input.serviceType} estimate, ${input.amount} - awaiting follow-up`,
      estimatedValue: input.amount,
      contactId: input.contactId,
      businessId: input.businessId,
    },
    estimateUpdate: {
      status: "stale",
    },
  };
}

export interface ReactivationInput {
  contactIds: string[];
  businessId: string;
  segmentName: string;
}

export function createReactivationOpportunities(input: ReactivationInput) {
  return input.contactIds.map((contactId, i) => ({
    opportunity: {
      id: `opp_react_mock_${Date.now()}_${i}`,
      type: "reactivation" as const,
      status: "new" as const,
      title: `Reactivation - ${input.segmentName}`,
      contactId,
      businessId: input.businessId,
    },
  }));
}
