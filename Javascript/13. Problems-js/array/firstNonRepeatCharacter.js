/**
 * First non-repeating character.
 *
 * Count once, then scan in original order. A Map preserves insertion order,
 * so a single pass over the map also works.
 *
 * Time  O(n)
 * Space O(k) distinct characters
 */

/** The character itself, or null. */
function firstNonRepeatCharacter(str) {
  const counts = new Map();
  for (const ch of str) counts.set(ch, (counts.get(ch) || 0) + 1);

  for (const [ch, count] of counts) {
    if (count === 1) return ch;
  }

  return null;
}

/** Its index, or -1 (LeetCode 387). */
function firstUniqueCharIndex(str) {
  const counts = new Array(26).fill(0);

  for (const ch of str) {
    const i = ch.charCodeAt(0) - 97;
    if (i >= 0 && i < 26) counts[i]++;
  }

  for (let i = 0; i < str.length; i++) {
    if (counts[str.charCodeAt(i) - 97] === 1) return i;
  }

  return -1;
}

/** The same idea for an array of any values. */
function firstNonRepeating(arr) {
  const counts = new Map();
  for (const item of arr) counts.set(item, (counts.get(item) || 0) + 1);

  for (const item of arr) {
    if (counts.get(item) === 1) return item;
  }

  return undefined;
}

/** Every non-repeating character, in order. */
function allNonRepeating(str) {
  const counts = new Map();
  for (const ch of str) counts.set(ch, (counts.get(ch) || 0) + 1);
  return [...counts].filter(([, n]) => n === 1).map(([ch]) => ch);
}

/** The first character that DOES repeat. */
function firstRepeating(str) {
  const seen = new Set();

  for (const ch of str) {
    if (seen.has(ch)) return ch;
    seen.add(ch);
  }

  return null;
}

/** Streaming: answer the query after each new character in O(1) amortised. */
class NonRepeatingStream {
  #counts = new Map();
  #queue = [];

  add(ch) {
    this.#counts.set(ch, (this.#counts.get(ch) || 0) + 1);
    this.#queue.push(ch);

    while (this.#queue.length && this.#counts.get(this.#queue[0]) > 1) {
      this.#queue.shift();
    }

    return this.current;
  }

  get current() {
    return this.#queue[0] ?? null;
  }
}

// ---- Examples ----
console.log(firstNonRepeatCharacter('swiss'));   // 'w'
console.log(firstNonRepeatCharacter('aabb'));    // null
console.log(firstUniqueCharIndex('loveleetcode'));// 2
console.log(firstNonRepeating([1, 2, 1, 3, 2])); // 3
console.log(allNonRepeating('geeksforgeeks'));   // ['f','o','r']
console.log(firstRepeating('abcab'));            // 'a'

const stream = new NonRepeatingStream();
console.log(stream.add('a'), stream.add('b'), stream.add('a')); // 'a' 'a' 'b'

module.exports = { firstNonRepeatCharacter, firstUniqueCharIndex, firstNonRepeating, allNonRepeating, firstRepeating, NonRepeatingStream };
