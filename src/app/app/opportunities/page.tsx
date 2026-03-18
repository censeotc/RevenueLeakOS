import { OpportunitiesClient } from "./OpportunitiesClient";
import { DEMO_OPPORTUNITIES } from "@/lib/demo/opportunitiesData";

export default function OpportunitiesPage() {
  return <OpportunitiesClient opportunities={DEMO_OPPORTUNITIES} />;
}
