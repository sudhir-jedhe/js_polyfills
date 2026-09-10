/**
 * First non-repeating character in a string.
 *
 * Count in one pass, then scan in order for the first character with
 * count 1. A Map preserves insertion order, so a single pass over the map
 * also works.
 *
 * Time  O(n)
 * Space O(k) distinct characters
 */

/**
 * @param {string} str
 * @returns {string | null}
 */
function firstNonRepeatingCharacter(str) {
  const counts = new Map();
  for (const ch of str) counts.set(ch, (counts.get(ch) || 0) + 1);

  for (const [ch, count] of counts) {
    if (count === 1) return ch;
  }

  return null;
}

/** Its index instead of the character (LeetCode 387). Returns -1 if none. */
function firstUniqueCharIndex(str) {
  const counts = new Map();
  for (const ch of str) counts.set(ch, (counts.get(ch) || 0) + 1);

  for (let i = 0; i < str.length; i++) {
    if (counts.get(str[i]) === 1) return i;
  }

  return -1;
}

/** The first REPEATING character, the mirror problem. */
function firstRepeatingCharacter(str) {
  const seen = new Set();

  for (const ch of str) {
    if (seen.has(ch)) return ch;
    seen.add(ch);
  }

  return null;
}

/**
 * Streaming version: feed characters one at a time and query the current
 * first non-repeating character in O(1) amortised time.
 */
class FirstNonRepeatingStream {
  #counts = new Map();
  #queue = [];

  add(ch) {
    this.#counts.set(ch, (this.#counts.get(ch) || 0) + 1);
    this.#queue.push(ch);
    // Drop characters from the front that are no longer unique.
    while (this.#queue.length && this.#counts.get(this.#queue[0]) > 1) {
      this.#queue.shift();
    }
    return this;
  }

  get current() {
    return this.#queue[0] ?? null;
  }
}

// ---- Examples ----
console.log(firstNonRepeatingCharacter('swiss'));   // 'w'
console.log(firstNonRepeatingCharacter('aabbcc'));  // null
console.log(firstUniqueCharIndex('loveleetcode'));  // 2
console.log(firstRepeatingCharacter('abcab'));      // 'a'

const stream = new FirstNonRepeatingStream();
console.log(stream.add('a').current); // 'a'
console.log(stream.add('b').current); // 'a'
console.log(stream.add('a').current); // 'b'

module.exports = {
  firstNonRepeatingCharacter,
  firstUniqueCharIndex,
  firstRepeatingCharacter,
  FirstNonRepeatingStream,
};
