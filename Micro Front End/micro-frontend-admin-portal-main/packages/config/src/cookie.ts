import { COOKIE_DOMAIN, IS_PROD, SESSION_COOKIE, SESSION_TTL_MS } from "./constants";

/**
 * Cookie options shared by every app that sets/clears the session.
 *
 * Shape matches Next's `cookies().set(name, value, options)`. Centralizing this
 * guarantees all four apps use identical security flags — a mismatch (e.g. one
 * app forgetting `domain`) is a classic cross-subdomain auth bug.
 */
export interface SessionCookieOptions {
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  path: "/";
  domain?: string;
  maxAge: number;
}

function baseOptions(maxAgeSeconds: number): SessionCookieOptions {
  const opts: SessionCookieOptions = {
    // Not readable from JS => mitigates XSS token theft.
    httpOnly: true,
    // Only sent over HTTPS in production.
    secure: IS_PROD,
    // "lax" allows top-level cross-subdomain navigations to carry the cookie
    // while still blocking most CSRF. (Cross-site POSTs won't send it.)
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  };
  // Only attach Domain when configured (prod). Omitting it in dev keeps the
  // cookie host-only on `localhost`, which is already shared across ports.
  if (COOKIE_DOMAIN) opts.domain = COOKIE_DOMAIN;
  return opts;
}

/** Options for setting a live session cookie. */
export function sessionSetOptions(): SessionCookieOptions {
  return baseOptions(Math.floor(SESSION_TTL_MS / 1000));
}

/** Options for clearing the session cookie (maxAge 0). */
export function sessionClearOptions(): SessionCookieOptions {
  return baseOptions(0);
}

export { SESSION_COOKIE };
