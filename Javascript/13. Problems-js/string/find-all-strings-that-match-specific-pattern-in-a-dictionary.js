/**
 * Find all strings in a dictionary that match a specific pattern.
 *
 * The pattern uses letters as placeholders and the match must be a
 * bijection: each pattern character maps to exactly one word character and
 * vice versa. Pattern 'abb' matches 'mee' and 'abb' but not 'aaa'.
 *
 * Time  O(n * k) for n words of length k
 */

/**
 * Normalise a word to its "shape": the first distinct character becomes 0,
 * the next new one 1, and so on. 'mee' -> '0.1.1', 'abb' -> '0.1.1'
 * @param {string} word
 * @returns {string}
 */
function encodeShape(word) {
  const seen = new Map();
  const out = [];

  for (const ch of word) {
    if (!seen.has(ch)) seen.set(ch, seen.size);
    out.push(seen.get(ch));
  }

  return out.join('.');
}

/**
 * @param {string[]} dictionary
 * @param {string} pattern
 * @returns {string[]}
 */
function findMatchingWords(dictionary, pattern) {
  const target = encodeShape(pattern);
  return dictionary.filter(
    (word) => word.length === pattern.length && encodeShape(word) === target
  );
}

/** Explicit two-way mapping check — the same test, written out. */
function isBijectiveMatch(word, pattern) {
  if (word.length !== pattern.length) return false;

  const forward = new Map();
  const backward = new Map();

  for (let i = 0; i < word.length; i++) {
    const p = pattern[i];
    const w = word[i];

    if (forward.has(p) && forward.get(p) !== w) return false;
    if (backward.has(w) && backward.get(w) !== p) return false;

    forward.set(p, w);
    backward.set(w, p);
  }

  return true;
}

/** Group a whole dictionary by shape, for repeated queries. */
function indexByShape(dictionary) {
  const index = new Map();
  for (const word of dictionary) {
    const shape = encodeShape(word);
    if (!index.has(shape)) index.set(shape, []);
    index.get(shape).push(word);
  }
  return index;
}

// ---- Examples ----
const dict = ['abb', 'abc', 'xyz', 'xyy', 'mee', 'aaa'];

console.log(findMatchingWords(dict, 'abb')); // ['abb', 'xyy', 'mee']
console.log(findMatchingWords(dict, 'abc')); // ['abc', 'xyz']
console.log(isBijectiveMatch('mee', 'abb')); // true
console.log(isBijectiveMatch('aaa', 'abb')); // false
console.log(indexByShape(dict).get(encodeShape('abb'))); // ['abb','xyy','mee']

module.exports = { findMatchingWords, isBijectiveMatch, encodeShape, indexByShape };
