/** @type {import('next').NextConfig} */
const nextConfig = {
  // This zone owns every path under /dashboard.
  basePath: "/dashboard",
  reactStrictMode: true,
  transpilePackages: ["@portal/ui", "@portal/types", "@portal/config"],
};

export default nextConfig;
