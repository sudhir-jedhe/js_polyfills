/**
 * Get the value of a string after the last slash.
 *
 * Typical use: pull the filename or last path segment out of a URL or path.
 */

/** substring + lastIndexOf — fastest, no allocation for the split. */
const afterLastSlash = (str) => String(str).substring(str.lastIndexOf('/') + 1);

/** split + pop — most readable. */
const afterLastSlashSplit = (str) => String(str).split('/').pop();

/** Regex: everything after the final slash. */
const afterLastSlashRegex = (str) => String(str).replace(/^.*\//, '');

/**
 * URL-aware: ignores query string and hash, and tolerates a trailing slash.
 * 'https://a.com/files/report.pdf?v=2' -> 'report.pdf'
 */
function lastSegment(input) {
  const withoutQuery = String(input).split(/[?#]/)[0];
  const trimmed = withoutQuery.replace(/\/+$/, ''); // drop trailing slashes
  return trimmed.slice(trimmed.lastIndexOf('/') + 1);
}

/** Everything BEFORE the last slash — the directory part. */
const beforeLastSlash = (str) => String(str).slice(0, str.lastIndexOf('/'));

// ---- Examples ----
console.log(afterLastSlash('https://example.com/a/b/file.txt')); // 'file.txt'
console.log(afterLastSlashSplit('/usr/local/bin'));              // 'bin'
console.log(afterLastSlashRegex('no-slash-here'));               // 'no-slash-here'
console.log(lastSegment('https://a.com/files/report.pdf?v=2'));  // 'report.pdf'
console.log(lastSegment('https://a.com/files/'));                // 'files'
console.log(beforeLastSlash('/a/b/c.txt'));                      // '/a/b'

module.exports = { afterLastSlash, afterLastSlashSplit, afterLastSlashRegex, lastSegment, beforeLastSlash };
