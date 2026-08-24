/**
 * @portal/types — shared TypeScript contracts consumed by every micro-frontend.
 *
 * These types are the *contract* between independently deployed apps. They are
 * intentionally framework-agnostic: no React, no Next, no server-only imports.
 */

/** Roles a user can hold. Drives what UI/data each app exposes. */
export type Role = "admin" | "user";

/** A tenant user. `password` never lives here — it stays in mock auth data. */
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  /** Tenant the user belongs to. Demonstrates multi-tenant isolation. */
  tenantId: string;
  avatarColor: string;
}

/**
 * The session payload stored (signed) inside the shared cookie.
 * Kept tiny on purpose — a session is an identity claim, not a data cache.
 */
export interface Session {
  userId: string;
  email: string;
  role: Role;
  tenantId: string;
  /** Unix ms at which the session was issued. */
  issuedAt: number;
  /** Unix ms at which the session expires. */
  expiresAt: number;
}

/** User-specific dashboard numbers rendered as stat cards. */
export interface DashboardStats {
  projects: number;
  notifications: number;
  openTasks: number;
  teamMembers: number;
}

/** A single recent-activity row on the dashboard. */
export interface ActivityItem {
  id: string;
  action: string;
  target: string;
  /** ISO 8601 timestamp. */
  at: string;
}

/** A project row for /dashboard/projects. */
export interface Project {
  id: string;
  name: string;
  status: "active" | "paused" | "archived";
  progress: number;
  updatedAt: string;
}

/** Consistent API-style envelope for any mock "fetch" helper. */
export interface Result<T> {
  ok: boolean;
  data: T | null;
  error: string | null;
}
