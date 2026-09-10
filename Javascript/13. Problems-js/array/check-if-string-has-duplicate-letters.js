/**
 * Check whether a string has duplicate letters.
 *
 * A Set is O(n); the bitmask version is O(1) space when the alphabet is
 * known to be a-z, which is the trick interviewers are usually after.
 */

/** Set-based — general and clear. */
function hasDuplicates(str) {
  const seen = new Set();

  for (const ch of str) {
    if (seen.has(ch)) return true;
    seen.add(ch);
  }

  return false;
}

/** One-liner using the size difference. */
const hasDuplicatesSize = (str) => new Set(str).size !== [...str].length;

/**
 * Bitmask over 26 letters — O(1) space, no allocation.
 * Only valid for lowercase a-z.
 */
function hasDuplicatesBitmask(str) {
  let seen = 0;

  for (const ch of str.toLowerCase()) {
    const bit = ch.charCodeAt(0) - 97;
    if (bit < 0 || bit > 25) continue; // ignore non-letters

    const mask = 1 << bit;
    if (seen & mask) return true;
    seen |= mask;
  }

  return false;
}

/** Which letters are duplicated, and how often. */
function duplicateLetters(str) {
  const counts = new Map();
  for (const ch of str) counts.set(ch, (counts.get(ch) || 0) + 1);
  return Object.fromEntries([...counts].filter(([, n]) => n > 1));
}

/** Case-insensitive check. */
const hasDuplicatesIgnoreCase = (str) => hasDuplicates(str.toLowerCase());

/** Are all characters unique — the inverse, phrased as interviewers ask it. */
const hasAllUniqueCharacters = (str) => !hasDuplicates(str);

// ---- Examples ----
console.log(hasDuplicates('abcdef'));            // false
console.log(hasDuplicates('hello'));             // true
console.log(hasDuplicatesSize('world'));         // false
console.log(hasDuplicatesBitmask('programming'));// true
console.log(duplicateLetters('programming'));    // { r: 2, g: 2, m: 2 }
console.log(hasDuplicatesIgnoreCase('Aa'));      // true
console.log(hasAllUniqueCharacters('abc'));      // true

module.exports = { hasDuplicates, hasDuplicatesSize, hasDuplicatesBitmask, duplicateLetters, hasDuplicatesIgnoreCase, hasAllUniqueCharacters };
