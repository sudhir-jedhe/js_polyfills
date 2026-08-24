import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession, findUserById } from "@portal/config";
import type { Session, User } from "@portal/types";

/** Read + verify the session cookie (public home page — no redirect). */
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySession(token, Date.now());
}

/** Resolve the current User, or null if signed out. */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;
  return findUserById(session.userId);
}
