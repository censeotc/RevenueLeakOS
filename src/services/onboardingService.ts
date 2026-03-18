import { INTEGRATION_CATALOG, WORKFLOW_CATALOG } from "@/lib/constants";

export function getOnboardingWorkspace() {
  return {
    integrations: INTEGRATION_CATALOG,
    workflows: WORKFLOW_CATALOG,
    launchChecklist: [
      "Confirm business settings and contact routing",
      "Connect at least one call or estimate data source",
      "Select the initial workflow mix",
      "Invite the first operator or manager"
    ]
  };
}
