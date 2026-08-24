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
 * Protected-route guard for the settings zone. Independently verifies the same
 * shared cookie the dashboard uses — proof that session validation needs no
 * shared runtime store between separately deployed apps.
 */
export async function requireUser(): Promise<User> {
  const session = await getSession();
  if (!session) redirect(absoluteUrl(ROUTES.login));
  const user = findUserById(session.userId);
  if (!user) redirect(absoluteUrl(ROUTES.login));
  return user;
}

export type { Session };
