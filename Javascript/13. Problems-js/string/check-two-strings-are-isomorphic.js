/**
 * Check whether two strings are isomorphic (LeetCode 205).
 *
 * Isomorphic means there is a one-to-one character mapping from s to t that
 * preserves order. 'egg'/'add' -> true, 'foo'/'bar' -> false.
 *
 * Time  O(n)
 * Space O(1) — at most 256 distinct characters
 */

/**
 * @param {string} s
 * @param {string} t
 * @returns {boolean}
 */
function isIsomorphic(s, t) {
  if (s.length !== t.length) return false;

  const sToT = new Map();
  const tToS = new Map();

  for (let i = 0; i < s.length; i++) {
    const a = s[i];
    const b = t[i];

    // Both directions must stay consistent, otherwise the mapping is not 1:1.
    if (sToT.has(a) && sToT.get(a) !== b) return false;
    if (tToS.has(b) && tToS.get(b) !== a) return false;

    sToT.set(a, b);
    tToS.set(b, a);
  }

  return true;
}

/**
 * Index-of-first-occurrence trick: two strings are isomorphic iff the
 * position of each character's first appearance lines up.
 */
function isIsomorphicByFirstIndex(s, t) {
  if (s.length !== t.length) return false;

  for (let i = 0; i < s.length; i++) {
    if (s.indexOf(s[i]) !== t.indexOf(t[i])) return false;
  }

  return true;
}

/** Normalise to a canonical shape and compare — same idea, reusable. */
function encodeShape(str) {
  const seen = new Map();
  return [...str].map((ch) => {
    if (!seen.has(ch)) seen.set(ch, seen.size);
    return seen.get(ch);
  }).join('.');
}

const isIsomorphicByShape = (s, t) => encodeShape(s) === encodeShape(t);

// ---- Examples ----
console.log(isIsomorphic('egg', 'add'));   // true
console.log(isIsomorphic('foo', 'bar'));   // false
console.log(isIsomorphic('paper', 'title'));// true
console.log(isIsomorphic('badc', 'baba')); // false
console.log(isIsomorphicByFirstIndex('egg', 'add')); // true
console.log(isIsomorphicByShape('paper', 'title'));  // true

module.exports = { isIsomorphic, isIsomorphicByFirstIndex, isIsomorphicByShape, encodeShape };
