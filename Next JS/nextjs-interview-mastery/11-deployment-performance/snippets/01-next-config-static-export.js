// next.config.js
// Static export configuration -- produces plain HTML/CSS/JS with no
// Node.js server requirement. Only viable when NOTHING in the app
// needs request-time server rendering, Route Handlers, ISR, or middleware.

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  // The built-in Image Optimization API is a server endpoint and is
  // unavailable in static export mode -- either disable optimization
  // (serves originals as-is) or configure a third-party loader that
  // can optimize images without a running Next.js server.
  images: {
    unoptimized: true,
  },

  // Optional: emit /about/index.html instead of /about.html, which is
  // often required by static file hosts that don't rewrite extensionless URLs.
  trailingSlash: true,
};

module.exports = nextConfig;
