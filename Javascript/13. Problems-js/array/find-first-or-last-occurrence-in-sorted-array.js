/**
 * Find the first or last occurrence of a number in a sorted array.
 *
 * Binary search, but instead of stopping at the first hit, keep narrowing
 * toward the edge you want.
 *
 * Time  O(log n)
 * Space O(1)
 */

/** Index of the FIRST occurrence, or -1. */
function firstOccurrence(sorted, target) {
  let lo = 0;
  let hi = sorted.length - 1;
  let found = -1;

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;

    if (sorted[mid] === target) {
      found = mid;
      hi = mid - 1; // keep looking to the LEFT
    } else if (sorted[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }

  return found;
}

/** Index of the LAST occurrence, or -1. */
function lastOccurrence(sorted, target) {
  let lo = 0;
  let hi = sorted.length - 1;
  let found = -1;

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;

    if (sorted[mid] === target) {
      found = mid;
      lo = mid + 1; // keep looking to the RIGHT
    } else if (sorted[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }

  return found;
}

/** Both ends at once (LeetCode 34). */
const searchRange = (sorted, target) => [firstOccurrence(sorted, target), lastOccurrence(sorted, target)];

/** How many times the target appears — O(log n). */
function countOccurrences(sorted, target) {
  const first = firstOccurrence(sorted, target);
  return first === -1 ? 0 : lastOccurrence(sorted, target) - first + 1;
}

/** lowerBound: first index whose value is >= target (insertion point). */
function lowerBound(sorted, target) {
  let lo = 0;
  let hi = sorted.length;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] < target) lo = mid + 1;
    else hi = mid;
  }

  return lo;
}

/** upperBound: first index whose value is > target. */
function upperBound(sorted, target) {
  let lo = 0;
  let hi = sorted.length;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] <= target) lo = mid + 1;
    else hi = mid;
  }

  return lo;
}

// ---- Examples ----
const sorted = [1, 2, 2, 2, 3, 4, 5];

console.log(firstOccurrence(sorted, 2));  // 1
console.log(lastOccurrence(sorted, 2));   // 3
console.log(searchRange(sorted, 2));      // [1, 3]
console.log(searchRange(sorted, 9));      // [-1, -1]
console.log(countOccurrences(sorted, 2)); // 3
console.log(lowerBound(sorted, 3));       // 4
console.log(upperBound(sorted, 2));       // 4

module.exports = { firstOccurrence, lastOccurrence, searchRange, countOccurrences, lowerBound, upperBound };
