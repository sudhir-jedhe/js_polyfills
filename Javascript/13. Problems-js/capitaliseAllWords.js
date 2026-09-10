/**
 * Capitalise every word in a string.
 *
 * The first letter of each word is upper-cased, the rest lower-cased,
 * and the original whitespace is preserved.
 */

/**
 * @param {string} str
 * @returns {string}
 */
function capitaliseAllWords(str) {
  if (typeof str !== 'string') return '';
  // \b\w matches the first word character of each word.
  return str.replace(
    /\w\S*/g,
    (word) => word[0].toUpperCase() + word.slice(1).toLowerCase()
  );
}

/** Split/join variant — same result, easier to read. */
function capitaliseAllWordsSplit(str) {
  return String(str)
    .split(' ')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(' ');
}

// ---- Examples ----
console.log(capitaliseAllWords('hello world'));        // 'Hello World'
console.log(capitaliseAllWords('  the QUICK  fox  ')); // '  The Quick  Fox  '
console.log(capitaliseAllWords("o'neill and sons"));   // "O'neill And Sons"
console.log(capitaliseAllWordsSplit('java script'));   // 'Java Script'

module.exports = { capitaliseAllWords, capitaliseAllWordsSplit };
