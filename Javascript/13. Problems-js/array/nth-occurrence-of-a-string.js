/**
 * Find the nth occurrence of a substring in a string.
 *
 * Walk forward with indexOf, advancing past each match. Overlapping matches
 * need a step of 1 instead of the needle's length.
 */

/**
 * Index of the nth (1-based) occurrence, or -1.
 * @param {string} str
 * @param {string} needle
 * @param {number} n
 * @param {{ overlapping?: boolean }} [options]
 */
function nthIndexOf(str, needle, n, { overlapping = false } = {}) {
  if (!needle || n < 1) return -1;

  let index = -1;
  const step = overlapping ? 1 : needle.length;

  for (let found = 0; found < n; found++) {
    index = str.indexOf(needle, index + (found === 0 ? 0 : step));
    if (index === -1) return -1;
  }

  return index;
}

/** Every index where the needle occurs. */
function allIndexesOf(str, needle, { overlapping = false } = {}) {
  if (!needle) return [];

  const out = [];
  const step = overlapping ? 1 : needle.length;
  let index = 0;

  while ((index = str.indexOf(needle, index)) !== -1) {
    out.push(index);
    index += step;
  }

  return out;
}

/** The nth occurrence from the END. */
function nthLastIndexOf(str, needle, n) {
  const all = allIndexesOf(str, needle);
  return all.at(-n) ?? -1;
}

/** Replace only the nth occurrence. */
function replaceNth(str, needle, replacement, n) {
  const index = nthIndexOf(str, needle, n);
  if (index === -1) return str;

  return str.slice(0, index) + replacement + str.slice(index + needle.length);
}

/** How many non-overlapping occurrences there are. */
const countOccurrences = (str, needle) => (needle ? str.split(needle).length - 1 : 0);

/** Regex version, which also gives capture groups. */
function nthMatch(str, pattern, n) {
  const regex = new RegExp(pattern, pattern.flags?.includes('g') ? pattern.flags : 'g');
  const matches = [...str.matchAll(regex)];
  return matches[n - 1] ?? null;
}

// ---- Examples ----
const text = 'the cat sat on the mat, the end';

console.log(nthIndexOf(text, 'the', 2));         // 15
console.log(nthIndexOf(text, 'the', 9));         // -1
console.log(nthIndexOf('aaaa', 'aa', 2));        // 2  (non-overlapping)
console.log(nthIndexOf('aaaa', 'aa', 2, { overlapping: true })); // 1
console.log(allIndexesOf(text, 'the'));          // [0, 15, 24]
console.log(nthLastIndexOf(text, 'the', 1));     // 24
console.log(replaceNth(text, 'the', 'THE', 2));
console.log(countOccurrences(text, 'the'));      // 3
console.log(nthMatch(text, /\b\w{3}\b/g, 2)?.[0]);

module.exports = { nthIndexOf, allIndexesOf, nthLastIndexOf, replaceNth, countOccurrences, nthMatch };
