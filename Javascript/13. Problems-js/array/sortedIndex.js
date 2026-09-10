/**
 * sortedIndex — the index at which a value should be inserted to keep an
 * array sorted.
 *
 * Binary search for the lower bound: the leftmost position where the value
 * can go. sortedLastIndex gives the rightmost.
 *
 * Time  O(log n)
 * Space O(1)
 */

/** Leftmost insertion point (before any equal values). */
function sortedIndex(arr, value) {
  let lo = 0;
  let hi = arr.length;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] < value) lo = mid + 1;
    else hi = mid;
  }

  return lo;
}

/** Rightmost insertion point (after any equal values). */
function sortedLastIndex(arr, value) {
  let lo = 0;
  let hi = arr.length;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] <= value) lo = mid + 1;
    else hi = mid;
  }

  return lo;
}

/** With a key function, for objects. */
function sortedIndexBy(arr, value, keyFn) {
  const target = keyFn(value);
  let lo = 0;
  let hi = arr.length;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (keyFn(arr[mid]) < target) lo = mid + 1;
    else hi = mid;
  }

  return lo;
}

/** Index of the value if present, otherwise -1 — binary search proper. */
function sortedIndexOf(arr, value) {
  const index = sortedIndex(arr, value);
  return arr[index] === value ? index : -1;
}

/** How many times a value occurs, in O(log n). */
const countInSorted = (arr, value) => sortedLastIndex(arr, value) - sortedIndex(arr, value);

/** Insert a value, keeping the array sorted. */
const insertSorted = (arr, value) => {
  const index = sortedLastIndex(arr, value);
  return [...arr.slice(0, index), value, ...arr.slice(index)];
};

/** Every value in [low, high], as a slice — O(log n) to locate. */
const rangeSlice = (arr, low, high) => arr.slice(sortedIndex(arr, low), sortedLastIndex(arr, high));

/** With a descending array, the comparisons flip. */
function sortedIndexDesc(arr, value) {
  let lo = 0;
  let hi = arr.length;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] > value) lo = mid + 1;
    else hi = mid;
  }

  return lo;
}

// ---- Examples ----
const arr = [10, 20, 20, 30, 40];

console.log(sortedIndex(arr, 20));      // 1
console.log(sortedLastIndex(arr, 20));  // 3
console.log(sortedIndex(arr, 25));      // 3
console.log(sortedIndexOf(arr, 30));    // 3
console.log(sortedIndexOf(arr, 35));    // -1
console.log(countInSorted(arr, 20));    // 2
console.log(insertSorted(arr, 25));     // [10,20,20,25,30,40]
console.log(rangeSlice(arr, 20, 30));   // [20,20,30]
console.log(sortedIndexBy([{ n: 1 }, { n: 5 }], { n: 3 }, (o) => o.n)); // 1

module.exports = { sortedIndex, sortedLastIndex, sortedIndexBy, sortedIndexOf, countInSorted, insertSorted, rangeSlice, sortedIndexDesc };
