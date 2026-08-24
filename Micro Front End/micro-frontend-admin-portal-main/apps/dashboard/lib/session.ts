import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  ROUTES,
  absoluteUrl,
  verifySession,
  findUserById,
} from "@portal/config";
import type { Session, User } from "@portal/types";

/** Read + verify the session cookie. Returns null if absent/invalid/expired. */
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySession(token, Date.now());
}

/**
 * Protected-route guard: return the current User or redirect to login.
 *
 * This is server-side session validation — the dashboard zone independently
 * verifies the shared cookie's signature. No shared in-memory store required.
 */
export async function requireUser(): Promise<User> {
  const session = await getSession();
  if (!session) redirect(absoluteUrl(ROUTES.login));
  const user = findUserById(session.userId);
  if (!user) redirect(absoluteUrl(ROUTES.login));
  return user;
}
