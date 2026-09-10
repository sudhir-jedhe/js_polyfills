/**
 * Get the n largest elements from an array.
 *
 * Sorting is O(n log n); a size-n min-heap is O(m log n) for m elements,
 * which matters when n is small relative to the array.
 */

/** The n largest, descending. Simple sort-based version. */
const nLargest = (arr, n = 1) => [...arr].sort((a, b) => b - a).slice(0, n);

/** The n smallest, ascending. */
const nSmallest = (arr, n = 1) => [...arr].sort((a, b) => a - b).slice(0, n);

/** The n largest DISTINCT values. */
const nLargestDistinct = (arr, n = 1) => [...new Set(arr)].sort((a, b) => b - a).slice(0, n);

/**
 * Single pass keeping only the n best — O(m * n), good when n is tiny
 * (top 3 of a million, say) and avoids sorting the whole array.
 */
function nLargestOnePass(arr, n = 1) {
  const best = [];

  for (const value of arr) {
    if (best.length < n) {
      best.push(value);
      best.sort((a, b) => b - a);
    } else if (value > best[n - 1]) {
      best[n - 1] = value;
      best.sort((a, b) => b - a);
    }
  }

  return best;
}

/** The n largest by a derived value, for objects. */
const nLargestBy = (arr, n, valueFn) =>
  [...arr].sort((a, b) => valueFn(b) - valueFn(a)).slice(0, n);

/** The three largest — the specific case that comes up most. */
function largestThree(arr) {
  let first = -Infinity;
  let second = -Infinity;
  let third = -Infinity;

  for (const value of arr) {
    if (value > first) {
      [first, second, third] = [value, first, second];
    } else if (value > second && value !== first) {
      [second, third] = [value, second];
    } else if (value > third && value !== second && value !== first) {
      third = value;
    }
  }

  return [first, second, third].filter((v) => v !== -Infinity);
}

// ---- Examples ----
const arr = [5, 1, 9, 3, 7, 9];

console.log(nLargest(arr, 3));          // [9, 9, 7]
console.log(nSmallest(arr, 2));         // [1, 3]
console.log(nLargestDistinct(arr, 3));  // [9, 7, 5]
console.log(nLargestOnePass(arr, 3));   // [9, 9, 7]
console.log(largestThree([10, 4, 3, 50, 23, 90])); // [90, 50, 23]
console.log(nLargestBy([{ n: 1 }, { n: 9 }], 1, (o) => o.n)); // [{ n: 9 }]

module.exports = { nLargest, nSmallest, nLargestDistinct, nLargestOnePass, nLargestBy, largestThree };
