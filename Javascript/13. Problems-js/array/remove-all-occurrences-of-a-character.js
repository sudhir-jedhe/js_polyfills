/**
 * Remove all occurrences of a character from a string.
 *
 * split/join and replaceAll are the two clean answers; the regex needs the
 * character escaped, which is the usual bug.
 */

/** Escape a literal string for use inside a RegExp. */
const escapeRegExp = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** replaceAll — ES2021, no regex needed. */
const removeChar = (str, char) => String(str).replaceAll(char, '');

/** split/join — works everywhere. */
const removeCharSplit = (str, char) => String(str).split(char).join('');

/** Global regex, with the character escaped. */
const removeCharRegex = (str, char) =>
  String(str).replace(new RegExp(escapeRegExp(char), 'g'), '');

/** Remove several characters at once. */
function removeChars(str, chars) {
  const drop = new Set(chars);
  return [...String(str)].filter((ch) => !drop.has(ch)).join('');
}

/** Keep ONLY the listed characters. */
function keepOnly(str, chars) {
  const keep = new Set(chars);
  return [...String(str)].filter((ch) => keep.has(ch)).join('');
}

/** Case-insensitive removal. */
const removeCharIgnoreCase = (str, char) =>
  String(str).replace(new RegExp(escapeRegExp(char), 'gi'), '');

/** Remove the nth occurrence only. */
function removeNthOccurrence(str, char, n) {
  let seen = 0;

  return [...String(str)]
    .filter((ch) => {
      if (ch !== char) return true;
      return ++seen !== n;
    })
    .join('');
}

/** Remove all occurrences of a SUBSTRING repeatedly (LeetCode 1910). */
function removeSubstringRepeatedly(str, part) {
  let out = String(str);
  while (out.includes(part)) out = out.replace(part, '');
  return out;
}

// ---- Examples ----
console.log(removeChar('hello world', 'o'));       // 'hell wrld'
console.log(removeCharSplit('a-b-c', '-'));        // 'abc'
console.log(removeCharRegex('1.2.3', '.'));        // '123'  (dot escaped)
console.log(removeChars('hello world', ['l', 'o']));// 'he wrd'
console.log(keepOnly('a1b2c3', '0123456789'));     // '123'
console.log(removeCharIgnoreCase('Hello', 'h'));   // 'ello'
console.log(removeNthOccurrence('banana', 'a', 2));// 'banna'
console.log(removeSubstringRepeatedly('daabcbaabcbc', 'abc')); // 'dab'

module.exports = { removeChar, removeCharSplit, removeCharRegex, removeChars, keepOnly, removeCharIgnoreCase, removeNthOccurrence, removeSubstringRepeatedly, escapeRegExp };
