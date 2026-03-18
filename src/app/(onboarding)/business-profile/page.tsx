import { BusinessProfileForm } from "@/components/settings/BusinessProfileForm";
import { businessProfile } from "@/data/demoData";

export default function BusinessProfilePage() {
  return <BusinessProfileForm profile={businessProfile} />;
}
