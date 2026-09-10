/**
 * Get a character array from a string.
 *
 * split('') breaks surrogate pairs (emoji, some CJK); spread and
 * Array.from iterate code points, and Intl.Segmenter handles full
 * grapheme clusters (flags, skin tones, combining accents).
 */

/** split('') — code UNITS. Fast, but wrong for astral characters. */
const toCharsSplit = (str) => String(str).split('');

/** Spread — code POINTS. The right default. */
const toChars = (str) => [...String(str)];

/** Array.from — same as spread, and accepts a mapping function. */
const toCharsFrom = (str, mapFn) => Array.from(String(str), mapFn);

/**
 * Grapheme clusters — what a user perceives as one character.
 * '👨‍👩‍👧' is one grapheme but several code points.
 */
function toGraphemes(str, locale = 'en') {
  if (typeof Intl === 'undefined' || !Intl.Segmenter) return toChars(str);
  const segmenter = new Intl.Segmenter(locale, { granularity: 'grapheme' });
  return [...segmenter.segment(String(str))].map((s) => s.segment);
}

/** Character codes / code points. */
const toCharCodes = (str) => [...String(str)].map((c) => c.codePointAt(0));

/** Back again. */
const fromCharCodes = (codes) => codes.map((c) => String.fromCodePoint(c)).join('');

// ---- Examples ----
console.log(toCharsSplit('abc'));       // ['a','b','c']
console.log(toChars('a🙂b'));            // ['a','🙂','b']
console.log(toCharsSplit('a🙂b').length);// 4  <- surrogate pair split
console.log(toChars('a🙂b').length);     // 3
console.log(toCharsFrom('abc', (c) => c.toUpperCase())); // ['A','B','C']
console.log(toGraphemes('née'));
console.log(toCharCodes('AB'));          // [65, 66]
console.log(fromCharCodes([72, 105]));   // 'Hi'

module.exports = { toChars, toCharsSplit, toCharsFrom, toGraphemes, toCharCodes, fromCharCodes };
