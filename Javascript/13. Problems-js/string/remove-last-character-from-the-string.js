/**
 * Remove the last character from a string.
 */

/** slice(0, -1) — clearest, and safe on an empty string. */
const removeLastChar = (str) => String(str).slice(0, -1);

/** substring form. */
const removeLastCharSubstring = (str) => String(str).substring(0, str.length - 1);

/** Unicode-safe: drops a whole emoji rather than half a surrogate pair. */
const removeLastCharUnicode = (str) => [...String(str)].slice(0, -1).join('');

/** Remove the last character only when it matches. */
const removeTrailing = (str, ch) =>
  String(str).endsWith(ch) ? String(str).slice(0, -ch.length) : String(str);

/** Remove every trailing occurrence, e.g. a trailing comma list. */
const removeTrailingAll = (str, ch) => String(str).replace(new RegExp(`(?:${ch})+$`), '');

/** Remove the last n characters. */
const removeLastN = (str, n) => (n <= 0 ? String(str) : String(str).slice(0, -n));

// ---- Examples ----
console.log(removeLastChar('hello'));        // 'hell'
console.log(removeLastChar(''));             // ''
console.log(removeLastCharUnicode('hi🙂'));   // 'hi'
console.log(removeTrailing('a,b,c,', ','));  // 'a,b,c'
console.log(removeTrailingAll('a,b,,,', ',')); // 'a,b'
console.log(removeLastN('filename.txt', 4)); // 'filename'

module.exports = { removeLastChar, removeLastCharSubstring, removeLastCharUnicode, removeTrailing, removeTrailingAll, removeLastN };
