/**
 * Mirror the characters of a string.
 *
 * From index k onwards, replace each letter with its mirror in the
 * alphabet: a<->z, b<->y, c<->x, and so on.
 */

/**
 * Mirror a single lowercase letter: a -> z, b -> y, ...
 * 'a'.charCodeAt() is 97, 'z' is 122, so mirror = 219 - code.
 */
const mirrorChar = (ch) => {
  const code = ch.charCodeAt(0);
  if (code >= 97 && code <= 122) return String.fromCharCode(219 - code); // a-z
  if (code >= 65 && code <= 90) return String.fromCharCode(155 - code);  // A-Z
  return ch;
};

/**
 * @param {string} str
 * @param {number} k mirror from this index onwards (0-based)
 * @returns {string}
 */
function mirrorFrom(str, k) {
  return [...String(str)].map((ch, i) => (i >= k ? mirrorChar(ch) : ch)).join('');
}

/** Mirror the whole string. */
const mirrorAll = (str) => [...String(str)].map(mirrorChar).join('');

/** Mirror only a given range [start, end). */
const mirrorRange = (str, start, end) =>
  [...String(str)].map((ch, i) => (i >= start && i < end ? mirrorChar(ch) : ch)).join('');

/** Simple reversal, which "mirror" sometimes means instead. */
const reverse = (str) => [...String(str)].reverse().join('');

// ---- Examples ----
console.log(mirrorFrom('paradox', 3)); // 'parzwlc'
console.log(mirrorFrom('pneumonia', 4));// 'pneffnlmz'
console.log(mirrorAll('abc'));         // 'zyx'
console.log(mirrorAll('AbZ'));         // 'ZyA'
console.log(mirrorRange('abcdef', 2, 4));// 'abxwef'
console.log(reverse('hello'));         // 'olleh'

module.exports = { mirrorFrom, mirrorAll, mirrorRange, mirrorChar, reverse };
