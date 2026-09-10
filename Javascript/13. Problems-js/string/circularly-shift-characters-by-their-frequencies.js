/**
 * Modify a string by circularly shifting each character to the right by its
 * own frequency in the string.
 *
 * Count every character first, then shift each occurrence forward through
 * the alphabet by that count, wrapping z -> a.
 *
 * Time  O(n)
 */

/** Shift a lowercase letter forward by n, wrapping around the alphabet. */
const shiftChar = (ch, n) => {
  const code = ch.charCodeAt(0);
  if (code < 97 || code > 122) return ch; // leave non a-z alone
  return String.fromCharCode(((code - 97 + (n % 26)) % 26) + 97);
};

/**
 * @param {string} str
 * @returns {string}
 */
function shiftByFrequency(str) {
  const counts = new Map();
  for (const ch of str) counts.set(ch, (counts.get(ch) || 0) + 1);

  return [...str].map((ch) => shiftChar(ch, counts.get(ch))).join('');
}

/**
 * Variant: shift by the character's distance from 'a' instead.
 * 'c' moves 2 places, 'e' moves 4, and so on.
 */
const shiftByOwnValue = (str) =>
  [...str].map((ch) => shiftChar(ch, ch.charCodeAt(0) - 97)).join('');

/** Caesar cipher — a fixed shift for every character. */
const caesar = (str, n) => [...str].map((ch) => shiftChar(ch, n)).join('');

// ---- Examples ----
console.log(shiftByFrequency('geeksforgeeks'));
// each char moves right by how often it appears

console.log(shiftByFrequency('aab')); // 'ccc'  (a appears twice, b once)
console.log(shiftByOwnValue('abc'));  // 'ace'
console.log(caesar('xyz', 3));        // 'abc'
console.log(caesar('abc', 25));       // 'zab'

module.exports = { shiftByFrequency, shiftByOwnValue, caesar, shiftChar };
