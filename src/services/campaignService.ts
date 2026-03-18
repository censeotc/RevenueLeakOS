import type { CampaignRow, CampaignStatus } from "@/types/revenue";
import { demoCampaigns } from "@/data/demoData";
import type { CampaignInput } from "@/lib/validators/campaign";

export async function listCampaigns(
  _businessId: string
): Promise<CampaignRow[]> {
  return demoCampaigns;
}

export async function getCampaignById(
  id: string
): Promise<CampaignRow | null> {
  return demoCampaigns.find((c) => c.id === id) ?? null;
}

export async function createCampaign(
  _businessId: string,
  input: CampaignInput
): Promise<CampaignRow> {
  return {
    id: `cp-${Date.now()}`,
    name: input.name,
    type: input.type,
    status: "DRAFT",
    stepsCount: input.steps.length,
    createdAt: new Date().toISOString(),
  };
}

export async function updateCampaignStatus(
  id: string,
  status: CampaignStatus
): Promise<CampaignRow | null> {
  const campaign = demoCampaigns.find((c) => c.id === id);
  if (!campaign) return null;
  return { ...campaign, status };
}
