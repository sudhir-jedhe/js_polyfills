/**
 * Remove duplicate characters from a string (and duplicates from arrays).
 *
 * A Set preserves first-appearance order, which is what "remove duplicates"
 * almost always means.
 */

/** Keep the first occurrence of each character. */
const removeDuplicateChars = (str) => [...new Set(String(str))].join('');

/** Case-insensitive: 'AaBb' -> 'AB'. */
function removeDuplicateCharsIgnoreCase(str) {
  const seen = new Set();
  let out = '';

  for (const ch of String(str)) {
    const key = ch.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out += ch;
  }

  return out;
}

/** Remove duplicate WORDS while keeping order. */
const removeDuplicateWords = (str) =>
  [...new Set(String(str).trim().split(/\s+/))].join(' ');

/** Array duplicates. */
const uniqueArray = (arr) => [...new Set(arr)];

/** Array of objects, deduped by a key. */
function uniqueBy(arr, keyFn) {
  const seen = new Set();
  return arr.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Remove only ADJACENT duplicates: 'aabbcca' -> 'abca'. */
const removeAdjacentDuplicates = (str) => String(str).replace(/(.)\1+/g, '$1');

/** Keep only the characters that appear exactly once. */
function keepUniqueOnly(str) {
  const counts = new Map();
  for (const ch of str) counts.set(ch, (counts.get(ch) || 0) + 1);
  return [...str].filter((ch) => counts.get(ch) === 1).join('');
}

// ---- Examples ----
console.log(removeDuplicateChars('programming'));        // 'progamin'
console.log(removeDuplicateCharsIgnoreCase('AaBbAc'));   // 'ABc'
console.log(removeDuplicateWords('the cat the hat'));    // 'the cat hat'
console.log(uniqueArray([1, 2, 2, 3, 1]));               // [1, 2, 3]
console.log(uniqueBy([{ id: 1 }, { id: 1 }, { id: 2 }], (o) => o.id)); // 2 items
console.log(removeAdjacentDuplicates('aabbcca'));        // 'abca'
console.log(keepUniqueOnly('programming'));              // 'poain'

module.exports = {
  removeDuplicateChars,
  removeDuplicateCharsIgnoreCase,
  removeDuplicateWords,
  uniqueArray,
  uniqueBy,
  removeAdjacentDuplicates,
  keepUniqueOnly,
};
