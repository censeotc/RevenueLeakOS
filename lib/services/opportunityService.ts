import {
  addOpportunityNote,
  assignOpportunityOwner,
  getCallEvents,
  getOpportunityById,
  getOpportunityList,
  getUsersByBusiness,
  logBooking,
  simulateMissedCallWorkflow,
  simulateReply,
} from "@/lib/services/revenueleak";

export const opportunityService = {
  getOpportunityList,
  getOpportunityById,
  getUsersByBusiness,
  assignOpportunityOwner,
  addOpportunityNote,
  getCallEvents,
  simulateMissedCallWorkflow,
  simulateReply,
  logBooking,
};

export {
  addOpportunityNote,
  assignOpportunityOwner,
  getCallEvents,
  getOpportunityById,
  getOpportunityList,
  getUsersByBusiness,
  logBooking,
  simulateMissedCallWorkflow,
  simulateReply,
};
