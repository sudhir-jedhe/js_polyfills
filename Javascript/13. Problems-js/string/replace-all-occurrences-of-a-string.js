/**
 * Replace all occurrences of a substring.
 *
 * The classic bug: String.prototype.replace with a STRING pattern replaces
 * only the first match. You need replaceAll or a global regex, and the
 * search text must be escaped before it goes into a RegExp.
 */

/** Escape a literal string so it is safe inside a RegExp. */
const escapeRegExp = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** ES2021 — the right default. */
const replaceAll = (str, search, replacement) =>
  String(str).replaceAll(search, replacement);

/** Global regex, with the needle escaped. Works in older runtimes. */
const replaceAllRegex = (str, search, replacement) =>
  String(str).replace(new RegExp(escapeRegExp(search), 'g'), replacement);

/** split/join — no regex at all. */
const replaceAllSplit = (str, search, replacement) =>
  String(str).split(search).join(replacement);

/** Case-insensitive replace-all. */
const replaceAllIgnoreCase = (str, search, replacement) =>
  String(str).replace(new RegExp(escapeRegExp(search), 'gi'), replacement);

/** Replace several pairs in one pass, so replacements cannot cascade. */
function replaceMany(str, replacements) {
  const keys = Object.keys(replacements).sort((a, b) => b.length - a.length);
  if (keys.length === 0) return String(str);

  const pattern = new RegExp(keys.map(escapeRegExp).join('|'), 'g');
  return String(str).replace(pattern, (match) => replacements[match]);
}

// ---- Examples ----
console.log('a-b-a'.replace('a', 'X'));            // 'X-b-a'  <- the bug
console.log(replaceAll('a-b-a', 'a', 'X'));        // 'X-b-X'
console.log(replaceAllRegex('1.2.3', '.', '-'));   // '1-2-3'  (dot escaped)
console.log(replaceAllSplit('x/y/z', '/', '|'));   // 'x|y|z'
console.log(replaceAllIgnoreCase('Cat cat CAT', 'cat', 'dog')); // 'dog dog dog'
console.log(replaceMany('cat and dog', { cat: 'dog', dog: 'cat' })); // 'dog and cat'

module.exports = { replaceAll, replaceAllRegex, replaceAllSplit, replaceAllIgnoreCase, replaceMany, escapeRegExp };
