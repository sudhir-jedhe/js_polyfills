/**
 * Find the correct position to insert an element into a sorted array
 * (LeetCode 35 — Search Insert Position).
 *
 * Binary search for the lower bound: the first index whose value is >= the
 * target. That index is both the answer when the value exists and the
 * insertion point when it does not.
 *
 * Time  O(log n)
 * Space O(1)
 */

/**
 * @param {number[]} sorted ascending
 * @param {number} target
 * @returns {number} insertion index in [0, sorted.length]
 */
function searchInsert(sorted, target) {
  let lo = 0;
  let hi = sorted.length;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] < target) lo = mid + 1;
    else hi = mid;
  }

  return lo;
}

/** upperBound: insert AFTER any equal values, keeping insertion stable. */
function searchInsertRight(sorted, target) {
  let lo = 0;
  let hi = sorted.length;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] <= target) lo = mid + 1;
    else hi = mid;
  }

  return lo;
}

/** Actually insert, returning a new array. */
const insertSorted = (sorted, value) => {
  const index = searchInsertRight(sorted, value);
  return [...sorted.slice(0, index), value, ...sorted.slice(index)];
};

/** Insert in place with splice. */
function insertSortedInPlace(sorted, value) {
  sorted.splice(searchInsertRight(sorted, value), 0, value);
  return sorted;
}

/** With a custom comparator, for objects. */
function searchInsertBy(sorted, value, compare) {
  let lo = 0;
  let hi = sorted.length;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (compare(sorted[mid], value) < 0) lo = mid + 1;
    else hi = mid;
  }

  return lo;
}

// ---- Examples ----
console.log(searchInsert([1, 3, 5, 6], 5));      // 2
console.log(searchInsert([1, 3, 5, 6], 2));      // 1
console.log(searchInsert([1, 3, 5, 6], 7));      // 4
console.log(searchInsert([1, 3, 5, 6], 0));      // 0
console.log(searchInsertRight([1, 2, 2, 3], 2)); // 3
console.log(insertSorted([1, 3, 5], 4));         // [1, 3, 4, 5]
console.log(searchInsertBy([{ n: 1 }, { n: 5 }], { n: 3 }, (a, b) => a.n - b.n)); // 1

module.exports = { searchInsert, searchInsertRight, insertSorted, insertSortedInPlace, searchInsertBy };
