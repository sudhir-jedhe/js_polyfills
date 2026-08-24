/** @type {import('next').NextConfig} */
const nextConfig = {
  // This zone owns every path under /auth. basePath makes ALL routes and static
  // assets live under /auth so they never collide with the other zones and the
  // shell's `/auth/:path*` rewrite forwards them correctly.
  basePath: "/auth",
  reactStrictMode: true,
  transpilePackages: ["@portal/ui", "@portal/types", "@portal/config"],
};

export default nextConfig;
