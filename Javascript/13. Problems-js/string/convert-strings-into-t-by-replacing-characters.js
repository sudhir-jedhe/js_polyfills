/**
 * Convert given strings into T by replacing characters between strings any
 * number of times.
 *
 * You may swap/copy characters freely between the strings, so the only
 * thing that matters is the total multiset of characters. All strings can
 * become T (repeated n times) iff the combined character counts are exactly
 * n copies of T's character counts.
 *
 * Time  O(total characters)
 */

/** @param {string} str @returns {Map<string, number>} */
function charCount(str) {
  const counts = new Map();
  for (const ch of str) counts.set(ch, (counts.get(ch) || 0) + 1);
  return counts;
}

/**
 * @param {string[]} strings
 * @param {string} t
 * @returns {boolean}
 */
function canConvertAllTo(strings, t) {
  // Every string must end up with T's length.
  if (strings.some((s) => s.length !== t.length)) return false;

  const pool = charCount(strings.join(''));
  const target = charCount(t);
  const n = strings.length;

  if (pool.size !== target.size) return false;

  for (const [ch, count] of target) {
    if (pool.get(ch) !== count * n) return false;
  }

  return true;
}

/** The simpler two-string case: are they anagrams of each other? */
function isAnagram(a, b) {
  if (a.length !== b.length) return false;

  const counts = new Map();
  for (const ch of a) counts.set(ch, (counts.get(ch) || 0) + 1);

  for (const ch of b) {
    const left = counts.get(ch);
    if (!left) return false;
    counts.set(ch, left - 1);
  }

  return true;
}

/** Which characters are short (negative) or spare (positive). */
function surplus(strings, t) {
  const pool = charCount(strings.join(''));
  const target = charCount(t);
  const n = strings.length;

  const out = {};
  for (const ch of new Set([...pool.keys(), ...target.keys()])) {
    out[ch] = (pool.get(ch) || 0) - (target.get(ch) || 0) * n;
  }

  return out;
}

// ---- Examples ----
console.log(canConvertAllTo(['abc', 'bca'], 'abc'));   // true
console.log(canConvertAllTo(['aab', 'bcc'], 'abc'));   // true
console.log(canConvertAllTo(['aaa', 'bbb'], 'abc'));   // false
console.log(isAnagram('listen', 'silent'));            // true
console.log(surplus(['aaa', 'bbb'], 'abc'));           // { a: 1, b: 1, c: -2 }

module.exports = { canConvertAllTo, isAnagram, surplus, charCount };
