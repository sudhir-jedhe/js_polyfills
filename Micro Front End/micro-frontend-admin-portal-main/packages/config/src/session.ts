import { createHmac, timingSafeEqual } from "node:crypto";
import type { Session, User } from "@portal/types";
import { SESSION_TTL_MS } from "./constants";

/**
 * Signed-cookie session encoding.  DEMO ONLY.
 *
 * Token format:  base64url(payloadJson) + "." + base64url(hmacSHA256)
 *
 * The HMAC lets any app verify the cookie was minted by us and not tampered
 * with, WITHOUT a shared database — the only shared secret is SESSION_SECRET.
 * This is why the session can be validated independently by four separately
 * deployed apps. A real system would use a vetted library (JWT/JWE, iron,
 * NextAuth) and rotate keys; this hand-rolled version is for learning.
 */

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 8) {
    // Fail loud in prod, tolerate a weak default in dev.
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET is missing or too short in production.");
    }
    return "dev-only-insecure-secret-change-me";
  }
  return s;
}

function b64url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** Build a fresh session for a validated user. */
export function createSession(user: User, now: number): Session {
  return {
    userId: user.id,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId,
    issuedAt: now,
    expiresAt: now + SESSION_TTL_MS,
  };
}

/** Encode a session into the signed cookie value. */
export function encodeSession(session: Session): string {
  const payload = b64url(JSON.stringify(session));
  return `${payload}.${sign(payload)}`;
}

/**
 * Decode + verify a cookie value. Returns the Session only if the signature is
 * valid AND it has not expired. Any tampering or corruption returns null.
 *
 * @param now current Unix ms (injected so callers control the clock).
 */
export function verifySession(token: string | undefined, now: number): Session | null {
  if (!token) return null;
  const dot = token.indexOf(".");
  if (dot <= 0) return null;

  const payload = token.slice(0, dot);
  const providedSig = token.slice(dot + 1);
  const expectedSig = sign(payload);

  // Constant-time comparison to avoid signature timing leaks.
  const a = Buffer.from(providedSig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as Session;
    if (typeof session.expiresAt !== "number" || session.expiresAt < now) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}
