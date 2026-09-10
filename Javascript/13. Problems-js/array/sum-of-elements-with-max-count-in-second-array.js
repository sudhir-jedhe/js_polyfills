/**
 * Sum of the elements of the first array such that the number of elements
 * less than or equal to them in the second array is maximum.
 *
 * For each value of A, count how many values of B are <= it. Keep the
 * values of A that achieve the maximum count and sum them.
 *
 * Sorting B and binary searching gives O(n log m) instead of O(n * m).
 */

/** How many values in `sorted` are <= target — upper bound, O(log n). */
function countLessOrEqual(sorted, target) {
  let lo = 0;
  let hi = sorted.length;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] <= target) lo = mid + 1;
    else hi = mid;
  }

  return lo;
}

/**
 * @param {number[]} a
 * @param {number[]} b
 * @returns {{ sum: number, count: number, elements: number[] }}
 */
function sumOfMaxCountElements(a, b) {
  const sortedB = [...b].sort((x, y) => x - y);

  let bestCount = -1;
  let elements = [];

  for (const value of a) {
    const count = countLessOrEqual(sortedB, value);

    if (count > bestCount) {
      bestCount = count;
      elements = [value];
    } else if (count === bestCount) {
      elements.push(value);
    }
  }

  return { sum: elements.reduce((s, n) => s + n, 0), count: bestCount, elements };
}

/** The count for every element of A — the full mapping. */
function countsForEach(a, b) {
  const sortedB = [...b].sort((x, y) => x - y);
  return a.map((value) => ({ value, count: countLessOrEqual(sortedB, value) }));
}

/**
 * The related LeetCode 1385: count elements of A with NO element of B
 * within distance d.
 */
function findTheDistanceValue(a, b, d) {
  const sortedB = [...b].sort((x, y) => x - y);

  return a.filter((value) => {
    const index = countLessOrEqual(sortedB, value + d);
    // Any b in [value - d, value + d] disqualifies this element.
    const lower = countLessOrEqual(sortedB, value - d - 1);
    return index === lower;
  }).length;
}

/** Merge-based counting when both arrays are already sorted — O(n + m). */
function countsForEachSorted(sortedA, sortedB) {
  const out = [];
  let j = 0;

  for (const value of sortedA) {
    while (j < sortedB.length && sortedB[j] <= value) j++;
    out.push({ value, count: j });
  }

  return out;
}

// ---- Examples ----
const a = [1, 5, 3, 8];
const b = [2, 4, 6];

console.log(countsForEach(a, b));      // 1->0, 5->2, 3->1, 8->3
console.log(sumOfMaxCountElements(a, b)); // { sum: 8, count: 3, elements: [8] }
console.log(sumOfMaxCountElements([9, 9, 1], [1, 2]));  // both 9s tie
console.log(findTheDistanceValue([4, 5, 8], [10, 9, 1, 8], 2)); // 2
console.log(countsForEachSorted([1, 3, 5], [2, 4, 6]));

module.exports = { sumOfMaxCountElements, countsForEach, countLessOrEqual, findTheDistanceValue, countsForEachSorted };
