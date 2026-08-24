/**
 * Shared constants & runtime configuration for every micro-frontend.
 *
 * ARCHITECTURE: single-domain, path-based composition (Next.js Multi-Zones).
 * One public origin (e.g. https://abc.com) hosts every zone under a path prefix:
 *
 *     abc.com/                -> shell   (host, owns "/")
 *     abc.com/auth/*          -> auth    (basePath "/auth")
 *     abc.com/dashboard/*     -> dashboard (basePath "/dashboard")
 *     abc.com/settings/*      -> settings  (basePath "/settings")
 *
 * The shell "stitches" the zones together with next.config rewrites. Because
 * everything is ONE origin, the session cookie is shared across all paths with
 * zero Domain configuration.
 */

/** Name of the session cookie. All apps must agree on this exact string. */
export const SESSION_COOKIE = "portal_session";

/** Session lifetime: 8 hours. */
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

/** True in production builds — flips Secure/SameSite to their strict values. */
export const IS_PROD = process.env.NODE_ENV === "production";

/**
 * Cookie `Domain` attribute.
 *  - Single-domain composition (this project): leave EMPTY. A host-only cookie
 *    on the one origin is automatically shared across every path.
 *  - Subdomain alternative (documented in README): set ".example.com" so
 *    auth./dashboard./settings. subdomains all receive the cookie.
 */
export const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN ?? "";

/**
 * The single public origin the user actually visits. Used to build absolute
 * URLs for cross-zone server-side redirects (where a relative path would be
 * ambiguously prefixed by a zone's basePath).
 *  - dev:  http://localhost:3000  (the shell)
 *  - prod: https://<your-shell-domain>
 */
export const PUBLIC_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

/**
 * Canonical app paths. These are ORIGIN-RELATIVE and resolve against the single
 * public origin in the browser, so plain <a href> links work everywhere.
 */
export const ROUTES = {
  home: "/",
  login: "/auth/login",
  forgotPassword: "/auth/forgot-password",
  logout: "/auth/logout",
  dashboard: "/dashboard",
  projects: "/dashboard/projects",
  analytics: "/dashboard/analytics",
  settings: "/settings",
  profile: "/settings/profile",
  security: "/settings/security",
} as const;

/** Build an absolute URL on the public origin (for server-side redirects). */
export function absoluteUrl(path: string): string {
  return `${PUBLIC_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * The shared sidebar model. Rendered identically by every zone so the four
 * micro-frontends present ONE consistent navigation — this is what makes the
 * separate apps feel like a single product. Kept as plain data (no UI import)
 * so @portal/config stays framework-agnostic.
 */
export interface NavLinkDef {
  label: string;
  href: string;
  icon?: string;
}
export interface NavSectionDef {
  section: string;
  items: NavLinkDef[];
}

export const PORTAL_NAV: NavSectionDef[] = [
  {
    section: "Dashboard",
    items: [
      { label: "Overview", href: ROUTES.dashboard, icon: "▦" },
      { label: "Projects", href: ROUTES.projects, icon: "❏" },
      { label: "Analytics", href: ROUTES.analytics, icon: "📈" },
    ],
  },
  {
    section: "Settings",
    items: [
      { label: "Account", href: ROUTES.settings, icon: "⚙" },
      { label: "Profile", href: ROUTES.profile, icon: "◔" },
      { label: "Security", href: ROUTES.security, icon: "🔒" },
    ],
  },
];
