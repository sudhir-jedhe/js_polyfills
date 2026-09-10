/**
 * Get the character at a specific position in a string.
 *
 * charAt, bracket indexing and at() differ in how they handle out-of-range
 * and negative indexes; none of them are Unicode-safe on their own.
 */

/** charAt — returns '' when out of range. */
const charAt = (str, index) => String(str).charAt(index);

/** Bracket indexing — returns undefined when out of range. */
const charBracket = (str, index) => String(str)[index];

/** at() — supports negative indexes, undefined when out of range. */
const charAtIndex = (str, index) => String(str).at(index);

/** Unicode-safe: counts code points, so emoji are one character. */
const charAtUnicode = (str, index) => [...String(str)].at(index);

/** Grapheme-safe: flags and combined emoji stay whole. */
function graphemeAt(str, index, locale = 'en') {
  if (typeof Intl === 'undefined' || !Intl.Segmenter) return charAtUnicode(str, index);

  const segmenter = new Intl.Segmenter(locale, { granularity: 'grapheme' });
  return [...segmenter.segment(String(str))].at(index)?.segment;
}

/** Character code / code point at a position. */
const codeAt = (str, index) => String(str).charCodeAt(index);
const codePointAt = (str, index) => String(str).codePointAt(index);

/** Replace the character at a position — strings are immutable. */
function replaceAt(str, index, replacement) {
  const s = String(str);
  if (index < 0 || index >= s.length) return s;
  return s.slice(0, index) + replacement + s.slice(index + replacement.length);
}

// ---- Examples ----
console.log(charAt('hello', 1));        // 'e'
console.log(charAt('hello', 99));       // ''
console.log(charBracket('hello', 99));  // undefined
console.log(charAtIndex('hello', -1));  // 'o'
console.log(charBracket('a🙂b', 1));     // half a surrogate pair
console.log(charAtUnicode('a🙂b', 1));   // '🙂'
console.log(graphemeAt('née', 1));      // 'é'
console.log(codeAt('A', 0));            // 65
console.log(replaceAt('hello', 0, 'J'));// 'Jello'

module.exports = { charAt, charBracket, charAtIndex, charAtUnicode, graphemeAt, codeAt, codePointAt, replaceAt };
