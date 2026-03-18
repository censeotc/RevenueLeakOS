import { cookies } from "next/headers";
import { DEMO_SESSION_COOKIE, type SessionUser } from "./demo-session";

export async function getServerSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(DEMO_SESSION_COOKIE);
    if (!cookie?.value) return null;
    const decoded = Buffer.from(cookie.value, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded) as SessionUser;
    return parsed;
  } catch {
    return null;
  }
}
