import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export async function getRequiredSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.businessId) {
    redirect("/login");
  }
  return session;
}

export async function getSessionUser() {
  const session = await getRequiredSession();
  return session.user;
}
