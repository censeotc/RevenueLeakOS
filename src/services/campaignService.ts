import { campaigns, reactivationSegments } from "@/data/demoData";

export function getCampaignWorkspace() {
  return { campaigns, selectedCampaign: campaigns[0], reactivationSegments };
}
