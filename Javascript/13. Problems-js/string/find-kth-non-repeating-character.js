/**
 * Find the Kth non-repeating character in a string.
 *
 * Two passes: count every character, then walk the string in order and
 * return the Kth one whose count is 1. Order of first appearance is what
 * matters, so a Map (insertion-ordered) works directly.
 *
 * Time  O(n)
 * Space O(k) distinct characters
 */

/**
 * @param {string} str
 * @param {number} k 1-based
 * @returns {string | null}
 */
function kthNonRepeating(str, k) {
  const counts = new Map();
  for (const ch of str) counts.set(ch, (counts.get(ch) || 0) + 1);

  let seen = 0;
  for (const ch of str) {
    if (counts.get(ch) === 1 && ++seen === k) return ch;
  }

  return null;
}

/** The first non-repeating character — the k = 1 case. */
const firstNonRepeating = (str) => kthNonRepeating(str, 1);

/** Its index, or -1. LeetCode 387. */
function firstUniqueCharIndex(str) {
  const counts = new Map();
  for (const ch of str) counts.set(ch, (counts.get(ch) || 0) + 1);

  for (let i = 0; i < str.length; i++) {
    if (counts.get(str[i]) === 1) return i;
  }

  return -1;
}

/** Every non-repeating character, in order of appearance. */
function allNonRepeating(str) {
  const counts = new Map();
  for (const ch of str) counts.set(ch, (counts.get(ch) || 0) + 1);
  return [...counts.entries()].filter(([, n]) => n === 1).map(([ch]) => ch);
}

// ---- Examples ----
console.log(kthNonRepeating('geeksforgeeks', 1)); // 'f'
console.log(kthNonRepeating('geeksforgeeks', 3)); // 'g'  -> f, o, r ... see allNonRepeating
console.log(allNonRepeating('geeksforgeeks'));    // ['f','o','r']
console.log(firstNonRepeating('aabbcdd'));        // 'c'
console.log(firstUniqueCharIndex('loveleetcode'));// 2
console.log(kthNonRepeating('aabb', 1));          // null

module.exports = { kthNonRepeating, firstNonRepeating, firstUniqueCharIndex, allNonRepeating };
