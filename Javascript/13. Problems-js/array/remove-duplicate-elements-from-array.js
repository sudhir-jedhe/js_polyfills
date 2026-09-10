/**
 * Remove duplicate elements from an array.
 *
 * A Set is the shortest correct answer and preserves first-appearance
 * order. The rest of this file covers objects, sorted input and in-place
 * removal.
 */

/** The one-liner. */
const unique = (arr) => [...new Set(arr)];

/** filter/indexOf — readable but O(n^2). */
const uniqueFilter = (arr) => arr.filter((item, i) => arr.indexOf(item) === i);

/** reduce — the same idea written out. */
const uniqueReduce = (arr) =>
  arr.reduce((acc, item) => (acc.includes(item) ? acc : [...acc, item]), []);

/** Objects, deduped by a key. First occurrence wins. */
function uniqueBy(arr, keyFn) {
  const seen = new Set();

  return arr.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Objects, deduped by deep structural equality. */
function uniqueDeep(arr) {
  const seen = new Map();

  for (const item of arr) {
    const key = JSON.stringify(item);
    if (!seen.has(key)) seen.set(key, item);
  }

  return [...seen.values()];
}

/**
 * Sorted array: remove duplicates IN PLACE and return the new length
 * (LeetCode 26). Two pointers, O(1) space.
 */
function uniqueSortedInPlace(sorted) {
  if (sorted.length === 0) return 0;

  let write = 1;
  for (let read = 1; read < sorted.length; read++) {
    if (sorted[read] !== sorted[write - 1]) sorted[write++] = sorted[read];
  }

  return write;
}

/** Allow each value at most k times (LeetCode 80 for k = 2). */
function allowAtMostK(sorted, k) {
  let write = 0;

  for (const value of sorted) {
    if (write < k || sorted[write - k] !== value) sorted[write++] = value;
  }

  return sorted.slice(0, write);
}

/** Keep only values that appear EXACTLY once. */
function onlyUnique(arr) {
  const counts = new Map();
  for (const item of arr) counts.set(item, (counts.get(item) || 0) + 1);
  return arr.filter((item) => counts.get(item) === 1);
}

/** The duplicated values themselves. */
const duplicates = (arr) => {
  const seen = new Set();
  const dupes = new Set();

  for (const item of arr) {
    if (seen.has(item)) dupes.add(item);
    else seen.add(item);
  }

  return [...dupes];
};

// ---- Examples ----
console.log(unique([1, 2, 2, 3, 1]));       // [1, 2, 3]
console.log(uniqueFilter(['a', 'b', 'a'])); // ['a', 'b']
console.log(uniqueBy([{ id: 1 }, { id: 1 }, { id: 2 }], (o) => o.id).length); // 2
console.log(uniqueDeep([{ a: 1 }, { a: 1 }]).length); // 1

const sorted = [1, 1, 2, 2, 3];
console.log(uniqueSortedInPlace(sorted), sorted.slice(0, 3)); // 3 [1,2,3]
console.log(allowAtMostK([1, 1, 1, 2, 2, 3], 2));  // [1,1,2,2,3]
console.log(onlyUnique([1, 2, 2, 3]));             // [1, 3]
console.log(duplicates([1, 2, 2, 3, 3, 3]));       // [2, 3]

module.exports = { unique, uniqueFilter, uniqueReduce, uniqueBy, uniqueDeep, uniqueSortedInPlace, allowAtMostK, onlyUnique, duplicates };
