/**
 * Capitalize words.
 *
 * Four different jobs people mean by "capitalize": first letter only,
 * every word, title case with small words lowercased, and toggling.
 */

/** Upper-case the first character; leave the rest alone. */
const capitalize = (str) => (str ? str[0].toUpperCase() + str.slice(1) : '');

/** Upper-case the first character and lower-case the rest. */
const capitalizeFirstOnly = (str) => (str ? str[0].toUpperCase() + str.slice(1).toLowerCase() : '');

/** Every word: 'hello world' -> 'Hello World'. */
const capitalizeWords = (str) =>
  String(str).replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());

const SMALL_WORDS = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'vs']);

/** Title case: small words stay lowercase unless first or last. */
function titleCase(str) {
  const words = String(str).toLowerCase().split(/\s+/);

  return words
    .map((word, i) => {
      if (i !== 0 && i !== words.length - 1 && SMALL_WORDS.has(word)) return word;
      return word ? word[0].toUpperCase() + word.slice(1) : word;
    })
    .join(' ');
}

/** Swap the case of every character. */
const toggleCase = (str) =>
  [...String(str)]
    .map((ch) => (ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase()))
    .join('');

// ---- Examples ----
console.log(capitalize('hELLO'));            // 'HELLO'
console.log(capitalizeFirstOnly('hELLO'));   // 'Hello'
console.log(capitalizeWords('hello big world')); // 'Hello Big World'
console.log(titleCase('the lord of the rings'));  // 'The Lord of the Rings'
console.log(toggleCase('Hello World'));      // 'hELLO wORLD'

module.exports = { capitalize, capitalizeFirstOnly, capitalizeWords, titleCase, toggleCase };
