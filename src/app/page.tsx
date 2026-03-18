import { redirect } from "next/navigation";
import { getPilotSession } from "@/lib/demo-session";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getPilotSession();
  redirect(session ? "/dashboard" : "/login");
}
