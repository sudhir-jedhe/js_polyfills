/**
 * Find the minimum number of rotations required to get the same string.
 *
 * Rotating a string of length n by n always returns the original, so the
 * answer is the smallest period p that divides n such that the string is
 * p repeated n/p times.
 *
 * The trick: s is a rotation of itself by k iff s appears in (s + s) at
 * index k.
 *
 * Time  O(n^2) with indexOf, O(n) with KMP
 */

/**
 * @param {string} str
 * @returns {number} 1..n
 */
function minRotations(str) {
  const doubled = str + str;

  for (let k = 1; k <= str.length; k++) {
    if (doubled.startsWith(str, k)) return k;
  }

  return str.length;
}

/** The same via indexOf on the doubled string — one line. */
const minRotationsIndexOf = (str) => (str + str).indexOf(str, 1);

/**
 * Smallest period via KMP's failure function — O(n).
 * The period is n - lps[n-1] when that divides n, otherwise n.
 */
function smallestPeriod(str) {
  const n = str.length;
  const lps = new Array(n).fill(0);

  for (let i = 1, len = 0; i < n; ) {
    if (str[i] === str[len]) lps[i++] = ++len;
    else if (len > 0) len = lps[len - 1];
    else lps[i++] = 0;
  }

  const candidate = n - lps[n - 1];
  return n % candidate === 0 ? candidate : n;
}

/** Is `b` a rotation of `a`? */
const isRotation = (a, b) => a.length === b.length && (a + a).includes(b);

/** Every distinct rotation of the string. */
const allRotations = (str) =>
  [...new Set(Array.from({ length: str.length }, (_, i) => str.slice(i) + str.slice(0, i)))];

/** Rotate a string left by k. */
const rotate = (str, k) => {
  const shift = ((k % str.length) + str.length) % str.length;
  return str.slice(shift) + str.slice(0, shift);
};

// ---- Examples ----
console.log(minRotations('abc'));        // 3
console.log(minRotations('aaaa'));       // 1
console.log(minRotations('abab'));       // 2
console.log(minRotationsIndexOf('abab'));// 2
console.log(smallestPeriod('abcabcabc'));// 3
console.log(isRotation('waterbottle', 'erbottlewat')); // true
console.log(allRotations('aab'));        // ['aab', 'aba', 'baa']
console.log(rotate('abcdef', 2));        // 'cdefab'

module.exports = { minRotations, minRotationsIndexOf, smallestPeriod, isRotation, allRotations, rotate };
