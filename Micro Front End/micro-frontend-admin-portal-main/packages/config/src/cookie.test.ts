import { describe, it, expect } from "vitest";
import { sessionSetOptions, sessionClearOptions } from "./cookie";

describe("session cookie options", () => {
  it("should_be_httponly_and_lax_and_root_path_when_set", () => {
    const opts = sessionSetOptions();
    expect(opts.httpOnly).toBe(true);
    expect(opts.sameSite).toBe("lax");
    expect(opts.path).toBe("/");
    expect(opts.maxAge).toBeGreaterThan(0);
  });

  it("should_omit_domain_for_single_domain_composition", () => {
    // COOKIE_DOMAIN is unset in tests => host-only cookie (no Domain attr)
    expect(sessionSetOptions().domain).toBeUndefined();
  });

  it("should_not_be_secure_outside_production", () => {
    // NODE_ENV is 'test' here
    expect(sessionSetOptions().secure).toBe(false);
  });

  it("should_expire_immediately_when_cleared", () => {
    expect(sessionClearOptions().maxAge).toBe(0);
    expect(sessionClearOptions().httpOnly).toBe(true);
  });
});
