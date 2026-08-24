/** @type {import('next').NextConfig} */
const nextConfig = {
  // This zone owns every path under /settings.
  basePath: "/settings",
  reactStrictMode: true,
  transpilePackages: ["@portal/ui", "@portal/types", "@portal/config"],
};

export default nextConfig;
