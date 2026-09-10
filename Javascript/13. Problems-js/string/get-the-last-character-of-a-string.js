/**
 * Get the last character of a string.
 *
 * at(-1) is the modern answer; the older forms are here for comparison,
 * along with the Unicode-safe version.
 */

/** ES2022 — negative indexes count from the end. */
const lastChar = (str) => String(str).at(-1);

/** charAt with a computed index. */
const lastCharAt = (str) => String(str).charAt(str.length - 1);

/** slice with a negative offset. */
const lastCharSlice = (str) => String(str).slice(-1);

/** Unicode-safe: emoji and other astral characters stay intact. */
const lastCharUnicode = (str) => [...String(str)].pop();

/** Last n characters. */
const lastN = (str, n) => String(str).slice(-n);

/** First character, for symmetry. */
const firstChar = (str) => String(str).at(0);

// ---- Examples ----
console.log(lastChar('hello'));        // 'o'
console.log(lastCharAt('hello'));      // 'o'
console.log(lastCharSlice('hello'));   // 'o'
console.log(lastChar('hi🙂'));          // '\uDE42'  <- broken half of the pair
console.log(lastCharUnicode('hi🙂'));   // '🙂'
console.log(lastN('javascript', 6));   // 'script'
console.log(lastChar(''));             // undefined

module.exports = { lastChar, lastCharAt, lastCharSlice, lastCharUnicode, lastN, firstChar };
