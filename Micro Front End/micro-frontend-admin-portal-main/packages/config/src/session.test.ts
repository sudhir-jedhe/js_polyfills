import { describe, it, expect } from "vitest";
import { createSession, encodeSession, verifySession } from "./session";
import { SESSION_TTL_MS } from "./constants";
import type { User } from "@portal/types";

const alice: User = {
  id: "u_alice",
  email: "alice@example.com",
  name: "Alice",
  role: "admin",
  tenantId: "acme",
  avatarColor: "#000",
};

const NOW = 1_700_000_000_000;

describe("createSession", () => {
  it("should_set_expiry_one_ttl_after_issued_when_created", () => {
    // when
    const session = createSession(alice, NOW);

    // then
    expect(session.userId).toBe("u_alice");
    expect(session.role).toBe("admin");
    expect(session.issuedAt).toBe(NOW);
    expect(session.expiresAt).toBe(NOW + SESSION_TTL_MS);
  });
});

describe("encodeSession / verifySession round-trip", () => {
  it("should_return_same_session_when_token_is_valid", () => {
    // given
    const session = createSession(alice, NOW);

    // when
    const token = encodeSession(session);
    const decoded = verifySession(token, NOW + 1000);

    // then
    expect(decoded).toEqual(session);
  });

  it("should_reject_when_token_is_undefined", () => {
    expect(verifySession(undefined, NOW)).toBeNull();
  });

  it("should_reject_when_token_is_garbage", () => {
    expect(verifySession("not-a-token", NOW)).toBeNull();
    expect(verifySession("no.dot.here", NOW)).toBeNull();
    expect(verifySession(".", NOW)).toBeNull();
  });

  it("should_reject_when_signature_is_tampered", () => {
    // given a valid token whose signature we corrupt
    const token = encodeSession(createSession(alice, NOW));
    const tampered = token.slice(0, -1) + (token.at(-1) === "a" ? "b" : "a");

    // then
    expect(verifySession(tampered, NOW + 1000)).toBeNull();
  });

  it("should_reject_when_payload_is_tampered", () => {
    // given: keep the signature, swap the payload for a forged one
    const token = encodeSession(createSession(alice, NOW));
    const sig = token.slice(token.indexOf(".") + 1);
    const forgedPayload = Buffer.from(
      JSON.stringify({ ...createSession(alice, NOW), role: "admin", userId: "u_bob" }),
    ).toString("base64url");

    // then: signature no longer matches the payload
    expect(verifySession(`${forgedPayload}.${sig}`, NOW + 1000)).toBeNull();
  });

  it("should_reject_when_session_is_expired", () => {
    // given
    const token = encodeSession(createSession(alice, NOW));

    // when: clock is past expiry
    const decoded = verifySession(token, NOW + SESSION_TTL_MS + 1);

    // then
    expect(decoded).toBeNull();
  });

  it("should_accept_at_the_instant_before_expiry", () => {
    const token = encodeSession(createSession(alice, NOW));
    expect(verifySession(token, NOW + SESSION_TTL_MS - 1)).not.toBeNull();
  });
});
