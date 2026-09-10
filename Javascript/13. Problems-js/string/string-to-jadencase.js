/**
 * String to Jaden Case.
 *
 * Every word starts with a capital letter, like Jaden Smith's tweets.
 * 'How can mirrors be real' -> 'How Can Mirrors Be Real'
 *
 * The catch in the classic kata: the input has multiple spaces in places,
 * and those must be preserved, so split(' ') beats split(/\s+/) here.
 */

/** Regex over word starts — preserves all original whitespace. */
const toJadenCase = (str) =>
  String(str).replace(/(^|\s)(\S)/g, (_, space, ch) => space + ch.toUpperCase());

/** split(' ') version — also preserves runs of spaces, since empty slots survive. */
const toJadenCaseSplit = (str) =>
  String(str)
    .split(' ')
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ');

/** As a String prototype extension, which is how the kata usually asks for it. */
function installJadenCase() {
  Object.defineProperty(String.prototype, 'toJadenCase', {
    value() {
      return toJadenCase(this);
    },
    writable: true,
    configurable: true,
  });
}

/** The inverse: lowercase every word except the first. */
const fromJadenCase = (str) =>
  String(str).replace(/(?!^)(\s)(\S)/g, (_, space, ch) => space + ch.toLowerCase());

// ---- Examples ----
console.log(toJadenCase('How can mirrors be real if our eyes are not real'));
// 'How Can Mirrors Be Real If Our Eyes Are Not Real'

console.log(toJadenCase('most  trees   are blue'));  // 'Most  Trees   Are Blue'
console.log(toJadenCaseSplit('most  trees are blue'));// 'Most  Trees Are Blue'

installJadenCase();
console.log('school is the tool'.toJadenCase());     // 'School Is The Tool'
console.log(fromJadenCase('How Can Mirrors Be Real'));// 'How can mirrors be real'

module.exports = { toJadenCase, toJadenCaseSplit, fromJadenCase, installJadenCase };
