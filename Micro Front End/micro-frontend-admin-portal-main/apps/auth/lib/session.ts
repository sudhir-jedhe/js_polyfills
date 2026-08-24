import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession, findUserById } from "@portal/config";
import type { Session, User } from "@portal/types";

/**
 * Server-side session helpers, local to the auth zone.
 *
 * Each zone owns its own tiny copy of these helpers on purpose: it proves the
 * point that any independently deployed app can validate the session from the
 * shared cookie + shared secret, WITHOUT a shared in-memory store.
 */

/** Read + verify the session cookie. Returns null if absent/invalid/expired. */
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySession(token, Date.now());
}

/** Resolve the full User for the current session, or null. */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;
  return findUserById(session.userId);
}
