import { describe, it, expect } from "vitest";
import {
  verifyCredentials,
  findUserById,
  getStatsFor,
  getProjectsFor,
  getActivityFor,
} from "./mock-data";

describe("verifyCredentials", () => {
  it("should_return_user_when_credentials_match", () => {
    const user = verifyCredentials("alice@example.com", "password123");
    expect(user?.id).toBe("u_alice");
    expect(user?.role).toBe("admin");
  });

  it("should_be_case_insensitive_and_trim_email", () => {
    const user = verifyCredentials("  ALICE@Example.com  ", "password123");
    expect(user?.id).toBe("u_alice");
  });

  it("should_return_null_when_password_is_wrong", () => {
    expect(verifyCredentials("alice@example.com", "nope")).toBeNull();
  });

  it("should_return_null_when_email_is_unknown", () => {
    expect(verifyCredentials("nobody@example.com", "password123")).toBeNull();
  });

  it("should_never_expose_the_password_on_the_returned_user", () => {
    const user = verifyCredentials("bob@example.com", "password123");
    expect(user).not.toHaveProperty("password");
  });
});

describe("findUserById", () => {
  it("should_find_known_user", () => {
    expect(findUserById("u_bob")?.email).toBe("bob@example.com");
  });
  it("should_return_null_for_unknown_id", () => {
    expect(findUserById("u_ghost")).toBeNull();
  });
});

describe("per-user data isolation", () => {
  it("should_return_different_stats_for_alice_and_bob", () => {
    expect(getStatsFor("u_alice")).toMatchObject({ projects: 25, notifications: 4 });
    expect(getStatsFor("u_bob")).toMatchObject({ projects: 8, notifications: 2 });
  });

  it("should_return_zeros_for_unknown_user", () => {
    expect(getStatsFor("u_ghost")).toEqual({
      projects: 0,
      notifications: 0,
      openTasks: 0,
      teamMembers: 0,
    });
  });

  it("should_scope_projects_and_activity_to_the_user", () => {
    expect(getProjectsFor("u_alice").length).toBeGreaterThan(getProjectsFor("u_bob").length);
    expect(getActivityFor("u_ghost")).toEqual([]);
  });
});

describe("immutability of mock store", () => {
  it("should_return_a_copy_so_callers_cannot_mutate_the_store", () => {
    // given
    const first = getStatsFor("u_alice");

    // when: mutate the returned object
    first.projects = 9999;

    // then: a fresh read is unaffected
    expect(getStatsFor("u_alice").projects).toBe(25);
  });
});
