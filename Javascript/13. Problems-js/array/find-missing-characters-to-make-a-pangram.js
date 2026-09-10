/**
 * Find the missing characters needed to make a string a pangram.
 *
 * A pangram uses every letter of the alphabet at least once.
 *
 * Time  O(n)
 * Space O(1) — the alphabet is fixed at 26
 */

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

/**
 * @param {string} str
 * @returns {string} the missing letters, in alphabetical order
 */
function missingLetters(str) {
  const present = new Set(str.toLowerCase().replace(/[^a-z]/g, ''));
  return [...ALPHABET].filter((ch) => !present.has(ch)).join('');
}

/** Is it already a pangram? */
const isPangram = (str) => missingLetters(str).length === 0;

/**
 * Bitmask version: one bit per letter, O(1) space and no Set allocation.
 * All 26 bits set is (1 << 26) - 1.
 */
function isPangramBitmask(str) {
  let seen = 0;

  for (const ch of str.toLowerCase()) {
    const bit = ch.charCodeAt(0) - 97;
    if (bit >= 0 && bit < 26) seen |= 1 << bit;
  }

  return seen === (1 << 26) - 1;
}

/** How many of each letter is missing to make it a PERFECT pangram. */
function lettersNeededForPerfectPangram(str) {
  const counts = new Map([...ALPHABET].map((ch) => [ch, 0]));

  for (const ch of str.toLowerCase()) {
    if (counts.has(ch)) counts.set(ch, counts.get(ch) + 1);
  }

  return Object.fromEntries([...counts].filter(([, n]) => n === 0));
}

/** A pangrammatic check for any alphabet, e.g. a custom character set. */
const missingFromAlphabet = (str, alphabet) => {
  const present = new Set(str.toLowerCase());
  return [...alphabet].filter((ch) => !present.has(ch)).join('');
};

/** Count each letter, for reporting. */
function letterFrequency(str) {
  const counts = {};
  for (const ch of str.toLowerCase()) {
    if (ch >= 'a' && ch <= 'z') counts[ch] = (counts[ch] || 0) + 1;
  }
  return counts;
}

// ---- Examples ----
console.log(missingLetters('The quick brown fox jumps over the lazy dog')); // ''
console.log(isPangram('The quick brown fox jumps over the lazy dog'));      // true
console.log(missingLetters('Hello World'));  // 'abcfgijkmnpqstuvxyz'
console.log(isPangramBitmask('abcdefghijklmnopqrstuvwxyz')); // true
console.log(Object.keys(lettersNeededForPerfectPangram('abc')).length);     // 23
console.log(missingFromAlphabet('101', '012'));  // '2'
console.log(letterFrequency('hello'));           // { h:1, e:1, l:2, o:1 }

module.exports = { missingLetters, isPangram, isPangramBitmask, lettersNeededForPerfectPangram, missingFromAlphabet, letterFrequency };
