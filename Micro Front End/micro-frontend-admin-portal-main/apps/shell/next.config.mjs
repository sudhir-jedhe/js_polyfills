// The shell is the HOST zone. It owns "/" and "stitches" the other zones into
// one origin via rewrites (Next.js Multi-Zones). The browser only ever sees the
// shell's origin; requests to /auth|/dashboard|/settings are proxied to each
// zone's own deployment. This composes four independent apps into one site on a
// single domain — no paid Microfrontends group required.
const AUTH = process.env.AUTH_ZONE_URL ?? "http://localhost:3001";
const DASHBOARD = process.env.DASHBOARD_ZONE_URL ?? "http://localhost:3002";
const SETTINGS = process.env.SETTINGS_ZONE_URL ?? "http://localhost:3003";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@portal/ui", "@portal/types", "@portal/config"],
  async rewrites() {
    return [
      // Forward both the bare prefix and everything under it (pages AND
      // /_next static assets, which live under each zone's basePath).
      { source: "/auth", destination: `${AUTH}/auth` },
      { source: "/auth/:path*", destination: `${AUTH}/auth/:path*` },
      { source: "/dashboard", destination: `${DASHBOARD}/dashboard` },
      { source: "/dashboard/:path*", destination: `${DASHBOARD}/dashboard/:path*` },
      { source: "/settings", destination: `${SETTINGS}/settings` },
      { source: "/settings/:path*", destination: `${SETTINGS}/settings/:path*` },
    ];
  },
};

export default nextConfig;
