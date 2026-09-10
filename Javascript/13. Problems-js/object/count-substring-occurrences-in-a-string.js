/**
 * Count the number of times a substring occurs in a string.
 *
 * Two conventions matter here: non-overlapping (what split/replace give you)
 * and overlapping ('aaa' contains 'aa' twice if overlaps count).
 */

/**
 * Non-overlapping count.
 * @param {string} str
 * @param {string} sub
 * @returns {number}
 */
function countOccurrences(str, sub) {
  if (!sub) return 0;

  let count = 0;
  let index = 0;

  while ((index = str.indexOf(sub, index)) !== -1) {
    count++;
    index += sub.length; // skip past the match
  }

  return count;
}

/** Overlapping count — advance by one character instead of sub.length. */
function countOverlapping(str, sub) {
  if (!sub) return 0;

  let count = 0;
  let index = 0;

  while ((index = str.indexOf(sub, index)) !== -1) {
    count++;
    index += 1;
  }

  return count;
}

/** split() one-liner — non-overlapping. */
const countBySplit = (str, sub) => (sub ? str.split(sub).length - 1 : 0);

/** Case-insensitive count via a regex, with the substring escaped. */
function countIgnoreCase(str, sub) {
  const escaped = sub.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return (str.match(new RegExp(escaped, 'gi')) || []).length;
}

/** Character frequency map, for the "count every character" variant. */
function charFrequency(str) {
  const map = new Map();
  for (const ch of str) map.set(ch, (map.get(ch) || 0) + 1);
  return Object.fromEntries(map);
}

// ---- Examples ----
console.log(countOccurrences('abababa', 'aba')); // 2  (non-overlapping)
console.log(countOverlapping('abababa', 'aba')); // 3  (overlapping)
console.log(countBySplit('hello world', 'o'));   // 2
console.log(countIgnoreCase('Cat cat CAT', 'cat')); // 3
console.log(charFrequency('hello')); // { h: 1, e: 1, l: 2, o: 1 }

module.exports = { countOccurrences, countOverlapping, countBySplit, countIgnoreCase, charFrequency };
