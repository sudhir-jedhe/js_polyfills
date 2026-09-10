/**
 * Find the three largest elements in an array.
 *
 * One pass with three running maxima — O(n) time, O(1) space, and no sort.
 */

/** Three largest DISTINCT values, descending. */
function largestThreeDistinct(arr) {
  let first = -Infinity;
  let second = -Infinity;
  let third = -Infinity;

  for (const value of arr) {
    if (value > first) {
      third = second;
      second = first;
      first = value;
    } else if (value > second && value < first) {
      third = second;
      second = value;
    } else if (value > third && value < second) {
      third = value;
    }
  }

  return [first, second, third].filter((v) => v !== -Infinity);
}

/** Three largest INCLUDING duplicates. */
function largestThree(arr) {
  const best = [];

  for (const value of arr) {
    best.push(value);
    best.sort((a, b) => b - a);
    if (best.length > 3) best.pop();
  }

  return best;
}

/** Sort-based — clearer, O(n log n). */
const largestThreeSorted = (arr) => [...arr].sort((a, b) => b - a).slice(0, 3);

/** Three smallest, the mirror. */
const smallestThree = (arr) => [...arr].sort((a, b) => a - b).slice(0, 3);

/** Their indexes rather than the values. */
const largestThreeIndexes = (arr) =>
  arr
    .map((value, index) => ({ value, index }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map((item) => item.index);

/** Maximum product of any three elements (LeetCode 628) — the classic follow-up. */
function maximumProductOfThree(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const n = sorted.length;

  // Either the three largest, or the two most negative times the largest.
  return Math.max(
    sorted[n - 1] * sorted[n - 2] * sorted[n - 3],
    sorted[0] * sorted[1] * sorted[n - 1]
  );
}

// ---- Examples ----
console.log(largestThreeDistinct([10, 4, 3, 50, 23, 90])); // [90, 50, 23]
console.log(largestThreeDistinct([10, 10, 10]));           // [10]
console.log(largestThree([10, 10, 10, 5]));                // [10, 10, 10]
console.log(largestThreeSorted([5, 1, 9, 3]));             // [9, 5, 3]
console.log(smallestThree([5, 1, 9, 3]));                  // [1, 3, 5]
console.log(largestThreeIndexes([5, 1, 9, 3]));            // [2, 0, 3]
console.log(maximumProductOfThree([-10, -10, 5, 2]));      // 500

module.exports = { largestThreeDistinct, largestThree, largestThreeSorted, smallestThree, largestThreeIndexes, maximumProductOfThree };
