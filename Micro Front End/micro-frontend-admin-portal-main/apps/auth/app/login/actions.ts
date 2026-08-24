"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  ROUTES,
  absoluteUrl,
  verifyCredentials,
  createSession,
  encodeSession,
  sessionSetOptions,
} from "@portal/config";

export interface LoginState {
  error: string | null;
}

/**
 * Server Action: validate credentials against mock data, mint a signed session,
 * store it in an HttpOnly cookie, then redirect (cross-zone) to the dashboard.
 *
 * Runs only on the server — mock credentials never reach the browser.
 */
export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const user = verifyCredentials(email, password);
  if (!user) {
    // Deliberately vague — don't reveal which field was wrong.
    return { error: "Invalid email or password." };
  }

  const session = createSession(user, Date.now());
  const store = await cookies();
  store.set(SESSION_COOKIE, encodeSession(session), sessionSetOptions());

  // Absolute URL on the public origin so the shell routes us into the dashboard
  // zone regardless of this zone's basePath.
  redirect(absoluteUrl(ROUTES.dashboard));
}
