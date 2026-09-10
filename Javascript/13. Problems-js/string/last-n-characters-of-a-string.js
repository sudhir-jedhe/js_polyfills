/**
 * Get the last N characters of a string.
 *
 * slice with a negative index is the clean answer; the guard cases matter
 * (n === 0 and n greater than the length).
 */

/**
 * @param {string} str
 * @param {number} n
 * @returns {string}
 */
function lastN(str, n) {
  const s = String(str);
  if (n <= 0) return '';
  return s.slice(-n);
}

/** substring version — needs an explicit max(0, ...). */
const lastNSubstring = (str, n) => String(str).substring(Math.max(0, str.length - n));

/** Unicode-safe: counts code points, not UTF-16 units. */
const lastNUnicode = (str, n) => (n <= 0 ? '' : [...String(str)].slice(-n).join(''));

/** First n, for symmetry. */
const firstN = (str, n) => String(str).slice(0, Math.max(0, n));

/** Drop the last n characters instead of keeping them. */
const dropLastN = (str, n) => (n <= 0 ? String(str) : String(str).slice(0, -n));

// ---- Examples ----
console.log(lastN('javascript', 6));   // 'script'
console.log(lastN('abc', 10));         // 'abc'
console.log(lastN('abc', 0));          // ''
console.log(lastNSubstring('hello', 2));// 'lo'
console.log(lastNUnicode('a🙂b🙂', 2));  // 'b🙂'
console.log(firstN('javascript', 4));  // 'java'
console.log(dropLastN('filename.txt', 4)); // 'filename'

module.exports = { lastN, lastNSubstring, lastNUnicode, firstN, dropLastN };
