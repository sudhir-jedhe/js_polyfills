// next.config.js
// Wire up @next/bundle-analyzer, enabled only when ANALYZE=true so
// normal builds aren't slowed down by generating the treemap report.
//
// Install: npm install --save-dev @next/bundle-analyzer
// Run:     ANALYZE=true npm run build

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...your existing config
};

module.exports = withBundleAnalyzer(nextConfig);
