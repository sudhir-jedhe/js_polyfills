/**
 * Count the occurrences of a specific character in a string.
 *
 * Five ways, from the fastest to the most idiomatic.
 */

/** Loop — fastest, no allocation. */
function countChar(str, char) {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === char) count++;
  }
  return count;
}

/** split().length - 1 — shortest to write. */
const countCharSplit = (str, char) => str.split(char).length - 1;

/** Regex with a global flag; the character is escaped so '.' behaves. */
function countCharRegex(str, char) {
  const escaped = char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return (str.match(new RegExp(escaped, 'g')) || []).length;
}

/** Functional: filter over the characters. */
const countCharFilter = (str, char) => [...str].filter((c) => c === char).length;

/** Unicode-safe: [...str] iterates code points, so emoji count as one. */
const countCharUnicode = (str, char) => [...str].filter((c) => c === char).length;

/** Case-insensitive variant. */
const countCharIgnoreCase = (str, char) =>
  countChar(str.toLowerCase(), char.toLowerCase());

// ---- Examples ----
console.log(countChar('hello world', 'o'));       // 2
console.log(countCharSplit('hello world', 'l'));  // 3
console.log(countCharRegex('a.b.c', '.'));        // 2  (escaped correctly)
console.log(countCharFilter('mississippi', 's')); // 4
console.log(countCharUnicode('a🙂b🙂', '🙂'));     // 2
console.log(countCharIgnoreCase('Hello', 'h'));   // 1

module.exports = { countChar, countCharSplit, countCharRegex, countCharFilter, countCharUnicode, countCharIgnoreCase };
