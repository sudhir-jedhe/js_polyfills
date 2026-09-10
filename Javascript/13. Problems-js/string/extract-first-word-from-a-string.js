/**
 * Extract the first word from a string.
 *
 * "First word" usually means: skip leading whitespace, then take characters
 * up to the next whitespace.
 */

/** Regex — handles leading whitespace and returns '' when there is no word. */
const firstWord = (str) => (String(str).trim().match(/^\S+/) || [''])[0];

/** split + filter, for when you want the whole word list anyway. */
const firstWordSplit = (str) => String(str).trim().split(/\s+/)[0] || '';

/** substring up to the first space after trimming. */
function firstWordSubstring(str) {
  const trimmed = String(str).trim();
  const space = trimmed.indexOf(' ');
  return space === -1 ? trimmed : trimmed.slice(0, space);
}

/** Letters only — drops trailing punctuation: 'Hello, world' -> 'Hello'. */
const firstWordLettersOnly = (str) => (String(str).match(/[A-Za-z']+/) || [''])[0];

/** The last word, for symmetry. */
const lastWord = (str) => (String(str).trim().match(/\S+$/) || [''])[0];

/** All words. */
const words = (str) => String(str).trim().split(/\s+/).filter(Boolean);

// ---- Examples ----
console.log(firstWord('  Hello World  '));       // 'Hello'
console.log(firstWordSplit('one two three'));    // 'one'
console.log(firstWordSubstring('single'));       // 'single'
console.log(firstWordLettersOnly('Hello, world'));// 'Hello'
console.log(firstWord('   '));                   // ''
console.log(lastWord('one two three'));          // 'three'
console.log(words('  a  b   c '));               // ['a', 'b', 'c']

module.exports = { firstWord, firstWordSplit, firstWordSubstring, firstWordLettersOnly, lastWord, words };
