/**
 * Remove punctuation from text.
 *
 * The ASCII-only class misses curly quotes, em dashes and non-Latin
 * punctuation. The Unicode property escape \p{P} handles all of it.
 */

/** ASCII punctuation only. */
const removePunctuationAscii = (text) =>
  String(text).replace(/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g, '');

/** Unicode-aware: \p{P} is punctuation, \p{S} is symbols. */
const removePunctuation = (text) => String(text).replace(/[\p{P}\p{S}]/gu, '');

/** Keep intra-word apostrophes and hyphens ("don't", "well-known"). */
const removePunctuationKeepWords = (text) =>
  String(text)
    .replace(/[\p{P}\p{S}]/gu, (match, offset, full) => {
      const isInner =
        (match === "'" || match === '-' || match === '’') &&
        /\w/.test(full[offset - 1] || '') &&
        /\w/.test(full[offset + 1] || '');
      return isInner ? match : '';
    })
    .replace(/\s{2,}/g, ' ')
    .trim();

/** Replace punctuation with a space instead of deleting it. */
const punctuationToSpace = (text) =>
  String(text).replace(/[\p{P}\p{S}]/gu, ' ').replace(/\s{2,}/g, ' ').trim();

/** Keep only letters, digits and spaces — the "alphanumeric only" version. */
const alphanumericOnly = (text) => String(text).replace(/[^\p{L}\p{N}\s]/gu, '');

/** Normalise text for comparison: lowercase, no punctuation, single spaces. */
const normaliseText = (text) =>
  removePunctuation(String(text).toLowerCase()).replace(/\s+/g, ' ').trim();

// ---- Examples ----
console.log(removePunctuationAscii('Hello, World! (test)')); // 'Hello World test'
console.log(removePunctuation('“Smart quotes” — and dashes…')); // 'Smart quotes  and dashes'
console.log(removePunctuationKeepWords("Don't stop — well-known facts!")); // "Don't stop well-known facts"
console.log(punctuationToSpace('a,b;c'));       // 'a b c'
console.log(alphanumericOnly('Café #1!'));      // 'Café 1'
console.log(normaliseText('  Hello,   WORLD!  '));// 'hello world'

module.exports = {
  removePunctuation,
  removePunctuationAscii,
  removePunctuationKeepWords,
  punctuationToSpace,
  alphanumericOnly,
  normaliseText,
};
