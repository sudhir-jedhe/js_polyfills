/**
 * Sort a numeric array.
 *
 * The classic bug: the default sort converts elements to STRINGS, so
 * [10, 9, 1].sort() gives [1, 10, 9]. Numbers always need a comparator.
 */

/** The bug, kept as a reminder. */
const sortBroken = (arr) => [...arr].sort();

/** Ascending. */
const sortAsc = (arr) => [...arr].sort((a, b) => a - b);

/** Descending. */
const sortDesc = (arr) => [...arr].sort((a, b) => b - a);

/** By absolute value. */
const sortByAbs = (arr) => [...arr].sort((a, b) => Math.abs(a) - Math.abs(b));

/**
 * Sort with NaN and nullish values pushed to the end rather than scattered
 * unpredictably by the comparator.
 */
function sortSafe(arr) {
  return [...arr].sort((a, b) => {
    const aBad = a == null || Number.isNaN(a);
    const bBad = b == null || Number.isNaN(b);

    if (aBad && bBad) return 0;
    if (aBad) return 1;
    if (bBad) return -1;

    return a - b;
  });
}

/** Typed arrays sort numerically by default — no comparator needed. */
const sortTyped = (arr) => Float64Array.from(arr).sort();

/** Natural sort for strings containing numbers: 'item10' after 'item2'. */
const sortNatural = (arr) =>
  [...arr].sort(new Intl.Collator(undefined, { numeric: true }).compare);

/**
 * Counting sort for small non-negative integers — O(n + k), beats
 * comparison sorting when the value range is narrow.
 */
function countingSort(arr) {
  if (!arr.length) return [];

  const max = Math.max(...arr);
  const counts = new Array(max + 1).fill(0);

  for (const n of arr) counts[n]++;

  const out = [];
  counts.forEach((count, value) => {
    for (let i = 0; i < count; i++) out.push(value);
  });

  return out;
}

/** In-place ascending sort, when the caller expects mutation. */
const sortInPlace = (arr) => arr.sort((a, b) => a - b);

// ---- Examples ----
console.log(sortBroken([10, 9, 1]));      // [1, 10, 9]  <- the bug
console.log(sortAsc([10, 9, 1]));         // [1, 9, 10]
console.log(sortDesc([10, 9, 1]));        // [10, 9, 1]
console.log(sortByAbs([-5, 2, -1]));      // [-1, 2, -5]
console.log(sortSafe([3, NaN, 1, null])); // [1, 3, NaN, null]
console.log([...sortTyped([10, 9, 1])]);  // [1, 9, 10]
console.log(sortNatural(['item10', 'item2'])); // ['item2', 'item10']
console.log(countingSort([4, 2, 2, 8, 3]));    // [2,2,3,4,8]

module.exports = { sortAsc, sortDesc, sortByAbs, sortSafe, sortTyped, sortNatural, countingSort, sortInPlace, sortBroken };
