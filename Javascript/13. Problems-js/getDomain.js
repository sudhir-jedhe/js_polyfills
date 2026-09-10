/**
 * Get the domain from a URL.
 *
 * Returns the hostname, optionally without the leading 'www.'.
 */

/**
 * @param {string} url
 * @param {{ stripWww?: boolean }} [options]
 * @returns {string | null} hostname, or null when the URL cannot be parsed
 */
function getDomain(url, { stripWww = true } = {}) {
  let input = String(url).trim();
  // URL requires a protocol; add one when the caller omitted it.
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(input)) input = `https://${input}`;

  try {
    const { hostname } = new URL(input);
    return stripWww ? hostname.replace(/^www\./i, '') : hostname;
  } catch {
    return null;
  }
}

/** Regex fallback for environments without the URL constructor. */
function getDomainRegex(url) {
  const match = String(url).match(/^(?:https?:\/\/)?(?:www\.)?([^/:?#]+)/i);
  return match ? match[1].toLowerCase() : null;
}

/** Root domain, ignoring subdomains (naive two-label heuristic). */
function getRootDomain(url) {
  const host = getDomain(url);
  if (!host) return null;
  const parts = host.split('.');
  return parts.length <= 2 ? host : parts.slice(-2).join('.');
}

// ---- Examples ----
console.log(getDomain('https://www.example.com/path?q=1')); // 'example.com'
console.log(getDomain('http://blog.example.co.uk'));        // 'blog.example.co.uk'
console.log(getDomain('example.com'));                      // 'example.com'
console.log(getDomain('not a url'));                        // 'not' -> parsed as host
console.log(getDomainRegex('https://www.google.com/search'));// 'google.com'
console.log(getRootDomain('https://blog.example.com'));      // 'example.com'

module.exports = { getDomain, getDomainRegex, getRootDomain };
