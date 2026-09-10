/**
 * Check whether a string contains a valid URL format.
 *
 * Prefer the URL constructor: it implements the WHATWG parser, so it is far
 * more correct than any hand-written regex. The regex is kept as a fallback
 * for very old environments.
 */

/**
 * @param {string} value
 * @param {{ protocols?: string[] }} [options]
 * @returns {boolean}
 */
function isValidUrl(value, { protocols = ['http:', 'https:'] } = {}) {
  if (typeof value !== 'string' || value.trim() === '') return false;

  try {
    const url = new URL(value.trim());
    return protocols.length === 0 || protocols.includes(url.protocol);
  } catch {
    return false;
  }
}

// scheme://host(.tld)(:port)(/path)(?query)(#hash)
const URL_RE =
  /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|localhost|(\d{1,3}\.){3}\d{1,3})(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i;

/** Regex fallback — also accepts protocol-less input like 'example.com'. */
const isValidUrlRegex = (value) => URL_RE.test(String(value).trim());

/** Break a URL into its parts, or null when it will not parse. */
function parseUrl(value) {
  try {
    const u = new URL(value);
    return {
      protocol: u.protocol,
      hostname: u.hostname,
      port: u.port,
      pathname: u.pathname,
      search: Object.fromEntries(u.searchParams),
      hash: u.hash,
    };
  } catch {
    return null;
  }
}

// ---- Examples ----
console.log(isValidUrl('https://example.com/a?b=1#c')); // true
console.log(isValidUrl('http://localhost:3000'));       // true
console.log(isValidUrl('ftp://files.com'));             // false (protocol not allowed)
console.log(isValidUrl('ftp://files.com', { protocols: [] })); // true
console.log(isValidUrl('example.com'));                 // false (no scheme)
console.log(isValidUrlRegex('example.com'));            // true
console.log(parseUrl('https://a.com:8080/x?y=1#z'));

module.exports = { isValidUrl, isValidUrlRegex, parseUrl, URL_RE };
