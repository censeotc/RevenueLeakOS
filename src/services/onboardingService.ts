export interface BusinessProfileInput {
  name: string;
  industry: string;
  phone: string;
  website?: string;
}

export interface OnboardingState {
  currentStep: number;
  businessProfile: BusinessProfileInput | null;
  connectedSources: string[];
  selectedWorkflows: string[];
}

const defaultState: OnboardingState = {
  currentStep: 1,
  businessProfile: null,
  connectedSources: [],
  selectedWorkflows: [],
};

let state = { ...defaultState };

export async function getOnboardingState(): Promise<OnboardingState> {
  return state;
}

export async function saveBusinessProfile(
  input: BusinessProfileInput
): Promise<OnboardingState> {
  state = { ...state, businessProfile: input, currentStep: 2 };
  return state;
}

export async function saveConnectedSources(
  sources: string[]
): Promise<OnboardingState> {
  state = { ...state, connectedSources: sources, currentStep: 3 };
  return state;
}

export async function saveSelectedWorkflows(
  workflows: string[]
): Promise<OnboardingState> {
  state = { ...state, selectedWorkflows: workflows, currentStep: 4 };
  return state;
}

export async function completeOnboarding(): Promise<{ success: boolean }> {
  state = { ...defaultState };
  return { success: true };
}
