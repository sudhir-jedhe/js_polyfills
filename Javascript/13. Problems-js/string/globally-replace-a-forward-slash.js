/**
 * Globally replace a forward slash in a string.
 *
 * The gotcha: `str.replace('/', '-')` replaces only the FIRST match.
 * You need a global regex or replaceAll.
 */

/** replaceAll — ES2021, clearest. */
const replaceSlashes = (str, replacement = '-') => String(str).replaceAll('/', replacement);

/** Global regex — works everywhere. The slash is escaped inside a literal. */
const replaceSlashesRegex = (str, replacement = '-') =>
  String(str).replace(/\//g, replacement);

/** split/join — no regex needed. */
const replaceSlashesSplit = (str, replacement = '-') =>
  String(str).split('/').join(replacement);

/** Both slash directions, useful for normalising Windows paths. */
const normaliseSlashes = (str, replacement = '/') =>
  String(str).replace(/[/\\]+/g, replacement);

/** Escape a user-supplied string so it is safe inside a RegExp. */
const escapeRegExp = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** General global replace for any literal substring. */
const replaceAllLiteral = (str, search, replacement) =>
  String(str).replace(new RegExp(escapeRegExp(search), 'g'), replacement);

// ---- Examples ----
console.log('a/b/c'.replace('/', '-'));           // 'a-b/c'  <- the bug
console.log(replaceSlashes('a/b/c'));             // 'a-b-c'
console.log(replaceSlashesRegex('2024/01/15', '-'));// '2024-01-15'
console.log(replaceSlashesSplit('x/y', '_'));     // 'x_y'
console.log(normaliseSlashes('C:\\Users\\me/docs'));// 'C:/Users/me/docs'
console.log(replaceAllLiteral('a.b.c', '.', '-'));// 'a-b-c'

module.exports = { replaceSlashes, replaceSlashesRegex, replaceSlashesSplit, normaliseSlashes, replaceAllLiteral, escapeRegExp };
