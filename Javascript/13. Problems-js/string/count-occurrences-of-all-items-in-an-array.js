/**
 * Count occurrences of all items in an array.
 *
 * Frequency map, plus the variants that usually come next: most/least
 * frequent, duplicates only, and counting by a derived key.
 */

/**
 * @param {Array<string|number>} arr
 * @returns {Record<string, number>}
 */
function countOccurrences(arr) {
  return arr.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
}

/** Map version — keeps the original key types (objects, NaN, booleans). */
function countOccurrencesMap(arr) {
  const map = new Map();
  for (const item of arr) map.set(item, (map.get(item) || 0) + 1);
  return map;
}

/** Count by a derived key: countBy(words, w => w.length). */
function countBy(arr, keyFn) {
  const out = {};
  for (const item of arr) {
    const key = keyFn(item);
    out[key] = (out[key] || 0) + 1;
  }
  return out;
}

/** Entries sorted by count, highest first. */
const sortedByCount = (arr) =>
  Object.entries(countOccurrences(arr)).sort((a, b) => b[1] - a[1]);

/** Only the items that appear more than once. */
const duplicatesOnly = (arr) =>
  Object.fromEntries(Object.entries(countOccurrences(arr)).filter(([, n]) => n > 1));

/** The single most frequent item. */
function mostFrequent(arr) {
  const [top] = sortedByCount(arr);
  return top ? { item: top[0], count: top[1] } : null;
}

// ---- Examples ----
const items = ['a', 'b', 'a', 'c', 'b', 'a'];

console.log(countOccurrences(items));  // { a: 3, b: 2, c: 1 }
console.log(countOccurrencesMap([1, '1', 1])); // Map { 1 => 2, '1' => 1 }
console.log(countBy(['hi', 'to', 'cat'], (w) => w.length)); // { '2': 2, '3': 1 }
console.log(sortedByCount(items));     // [['a',3], ['b',2], ['c',1]]
console.log(duplicatesOnly(items));    // { a: 3, b: 2 }
console.log(mostFrequent(items));      // { item: 'a', count: 3 }

module.exports = { countOccurrences, countOccurrencesMap, countBy, sortedByCount, duplicatesOnly, mostFrequent };
