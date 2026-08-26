// app/robots.js
export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/', '/drafts/'] },
      { userAgent: 'GPTBot', disallow: '/' },
    ],
    sitemap: 'https://example.com/sitemap.xml',
    host: 'https://example.com',
  };
}
