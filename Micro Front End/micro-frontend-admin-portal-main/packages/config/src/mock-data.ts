import type {
  ActivityItem,
  DashboardStats,
  Project,
  Role,
  User,
} from "@portal/types";

/**
 * ⚠️ DEMO ONLY — mock authentication data.
 *
 * Real systems NEVER store plaintext passwords and NEVER ship credentials in
 * the frontend bundle. This module is imported only from server code
 * (route handlers / server actions), but it is still mock and insecure by
 * design. Do not copy this pattern into production.
 */
interface MockCredential {
  user: User;
  password: string;
}

const CREDENTIALS: MockCredential[] = [
  {
    password: "password123",
    user: {
      id: "u_alice",
      email: "alice@example.com",
      name: "Alice",
      role: "admin",
      tenantId: "acme",
      avatarColor: "#6366f1",
    },
  },
  {
    password: "password123",
    user: {
      id: "u_bob",
      email: "bob@example.com",
      name: "Bob",
      role: "user",
      tenantId: "acme",
      avatarColor: "#0ea5e9",
    },
  },
];

/** Validate email + password against mock data. Returns the User or null. */
export function verifyCredentials(email: string, password: string): User | null {
  const match = CREDENTIALS.find(
    (c) => c.user.email.toLowerCase() === email.trim().toLowerCase(),
  );
  if (!match || match.password !== password) return null;
  return match.user;
}

/** Look a user up by id (used to hydrate a session into a full User). */
export function findUserById(id: string): User | null {
  return CREDENTIALS.find((c) => c.user.id === id)?.user ?? null;
}

// ---------------------------------------------------------------------------
// User-specific mock domain data. Keyed by user id so Alice and Bob never see
// each other's numbers.
// ---------------------------------------------------------------------------

const STATS: Record<string, DashboardStats> = {
  u_alice: { projects: 25, notifications: 4, openTasks: 12, teamMembers: 9 },
  u_bob: { projects: 8, notifications: 2, openTasks: 3, teamMembers: 2 },
};

const ACTIVITY: Record<string, ActivityItem[]> = {
  u_alice: [
    { id: "a1", action: "Approved deployment", target: "billing-service", at: "2026-08-17T09:12:00Z" },
    { id: "a2", action: "Invited member", target: "carol@example.com", at: "2026-08-17T08:40:00Z" },
    { id: "a3", action: "Archived project", target: "legacy-portal", at: "2026-08-16T17:05:00Z" },
    { id: "a4", action: "Updated role", target: "bob@example.com", at: "2026-08-16T14:22:00Z" },
  ],
  u_bob: [
    { id: "b1", action: "Commented on", target: "task #204", at: "2026-08-17T10:01:00Z" },
    { id: "b2", action: "Closed task", target: "task #198", at: "2026-08-16T16:30:00Z" },
  ],
};

const PROJECTS: Record<string, Project[]> = {
  u_alice: [
    { id: "p1", name: "Billing Service", status: "active", progress: 72, updatedAt: "2026-08-17T09:12:00Z" },
    { id: "p2", name: "Mobile App", status: "active", progress: 40, updatedAt: "2026-08-16T11:00:00Z" },
    { id: "p3", name: "Legacy Portal", status: "archived", progress: 100, updatedAt: "2026-08-10T08:00:00Z" },
    { id: "p4", name: "Analytics Pipeline", status: "paused", progress: 55, updatedAt: "2026-08-14T13:45:00Z" },
  ],
  u_bob: [
    { id: "p5", name: "Onboarding Flow", status: "active", progress: 30, updatedAt: "2026-08-17T10:01:00Z" },
    { id: "p6", name: "Docs Revamp", status: "paused", progress: 15, updatedAt: "2026-08-15T09:20:00Z" },
  ],
};

/** All getters return a *copy* so callers can't mutate the mock store. */
export function getStatsFor(userId: string): DashboardStats {
  return { ...(STATS[userId] ?? { projects: 0, notifications: 0, openTasks: 0, teamMembers: 0 }) };
}

export function getActivityFor(userId: string): ActivityItem[] {
  return (ACTIVITY[userId] ?? []).map((a) => ({ ...a }));
}

export function getProjectsFor(userId: string): Project[] {
  return (PROJECTS[userId] ?? []).map((p) => ({ ...p }));
}

/** Convenience for docs/UI: which roles exist. */
export const ALL_ROLES: Role[] = ["admin", "user"];
