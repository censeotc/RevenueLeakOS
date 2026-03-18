import type { CallEvent, MessageEvent, CallDirection, CallStatus } from "@/types";
import { demoCallEvents, demoMessages, demoContacts, demoBusiness } from "@/data/seed";

let callLog = [...demoCallEvents];
let messageLog = [...demoMessages];
let nextCallId = callLog.length + 1;
let nextMsgId = messageLog.length + 1;

export const twilioMockService = {
  getCalls(): CallEvent[] {
    return [...callLog].sort((a, b) => b.callTime.getTime() - a.callTime.getTime());
  },

  getCallById(id: string): CallEvent | undefined {
    return callLog.find((c) => c.id === id);
  },

  simulateInboundCall(contactId: string, status: CallStatus = "missed"): CallEvent {
    const contact = demoContacts.find((c) => c.id === contactId);
    const call: CallEvent = {
      id: `call_${String(nextCallId++).padStart(2, "0")}`,
      callerNumber: contact?.phone ?? "+13135559999",
      calledNumber: demoBusiness.phone,
      direction: "inbound" as CallDirection,
      status,
      duration: status === "missed" ? 0 : Math.floor(Math.random() * 300) + 30,
      callerName: contact ? `${contact.firstName} ${contact.lastName}` : "Unknown",
      callTime: new Date(),
      contactId,
      opportunityId: null,
    };
    callLog = [call, ...callLog];
    return call;
  },

  simulateOutboundCall(contactId: string): CallEvent {
    const contact = demoContacts.find((c) => c.id === contactId);
    const call: CallEvent = {
      id: `call_${String(nextCallId++).padStart(2, "0")}`,
      callerNumber: demoBusiness.phone,
      calledNumber: contact?.phone ?? "+13135559999",
      direction: "outbound" as CallDirection,
      status: "responded" as CallStatus,
      duration: Math.floor(Math.random() * 300) + 60,
      callerName: null,
      callTime: new Date(),
      contactId,
      opportunityId: null,
    };
    callLog = [call, ...callLog];
    return call;
  },

  getMessages(): MessageEvent[] {
    return [...messageLog].sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());
  },

  getMessagesForContact(contactId: string): MessageEvent[] {
    return messageLog
      .filter((m) => m.contactId === contactId)
      .sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime());
  },

  sendSMS(contactId: string, body: string, opportunityId?: string): MessageEvent {
    const contact = demoContacts.find((c) => c.id === contactId);
    const msg: MessageEvent = {
      id: `msg_${String(nextMsgId++).padStart(2, "0")}`,
      channel: "sms",
      direction: "outbound",
      toNumber: contact?.phone ?? "+13135559999",
      fromNumber: demoBusiness.phone,
      body,
      contactId,
      opportunityId: opportunityId ?? null,
      sentAt: new Date(),
    };
    messageLog = [...messageLog, msg];
    return msg;
  },

  simulateInboundSMS(contactId: string, body: string, opportunityId?: string): MessageEvent {
    const contact = demoContacts.find((c) => c.id === contactId);
    const msg: MessageEvent = {
      id: `msg_${String(nextMsgId++).padStart(2, "0")}`,
      channel: "sms",
      direction: "inbound",
      toNumber: demoBusiness.phone,
      fromNumber: contact?.phone ?? "+13135559999",
      body,
      contactId,
      opportunityId: opportunityId ?? null,
      sentAt: new Date(),
    };
    messageLog = [...messageLog, msg];
    return msg;
  },

  getCallStats() {
    const total = callLog.length;
    const missed = callLog.filter((c) => c.status === "missed" || c.status === "after_hours").length;
    const responded = callLog.filter((c) => c.status === "responded" || c.status === "booked").length;
    return {
      total,
      missed,
      responded,
      missedRate: total > 0 ? Math.round((missed / total) * 100) : 0,
      responseRate: total > 0 ? Math.round((responded / total) * 100) : 0,
    };
  },

  reset() {
    callLog = [...demoCallEvents];
    messageLog = [...demoMessages];
    nextCallId = callLog.length + 1;
    nextMsgId = messageLog.length + 1;
  },
};
