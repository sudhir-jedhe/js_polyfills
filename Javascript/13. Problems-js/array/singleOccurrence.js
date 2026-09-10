/**
 * Find elements with a single occurrence.
 *
 * XOR solves the "everything twice except one" case in O(1) space; a
 * frequency map handles the general case.
 */

/** The one value appearing once when all others appear twice. */
const singleNumber = (arr) => arr.reduce((acc, n) => acc ^ n, 0);

/** Every value appearing exactly once, in order of appearance. */
function singleOccurrences(arr) {
  const counts = new Map();
  for (const item of arr) counts.set(item, (counts.get(item) || 0) + 1);
  return [...counts.entries()].filter(([, n]) => n === 1).map(([v]) => v);
}

/** The FIRST value appearing exactly once. */
function firstSingle(arr) {
  const counts = new Map();
  for (const item of arr) counts.set(item, (counts.get(item) || 0) + 1);

  for (const item of arr) {
    if (counts.get(item) === 1) return item;
  }

  return undefined;
}

/** Values appearing exactly n times. */
function occurringExactly(arr, n) {
  const counts = new Map();
  for (const item of arr) counts.set(item, (counts.get(item) || 0) + 1);
  return [...counts.entries()].filter(([, c]) => c === n).map(([v]) => v);
}

/**
 * TWO values appear once, all others twice (LeetCode 260).
 * XOR everything, isolate a differing bit, and split on it.
 */
function twoSingleNumbers(arr) {
  const xorAll = arr.reduce((acc, n) => acc ^ n, 0);
  const bit = xorAll & -xorAll;

  let a = 0;
  let b = 0;

  for (const n of arr) {
    if (n & bit) a ^= n;
    else b ^= n;
  }

  return [a, b];
}

/**
 * Everything appears three times except one (LeetCode 137).
 * Track bits seen once and twice; a bit seen three times clears from both.
 */
function singleAmongTriples(arr) {
  let ones = 0;
  let twos = 0;

  for (const n of arr) {
    ones = (ones ^ n) & ~twos;
    twos = (twos ^ n) & ~ones;
  }

  return ones;
}

/** In a SORTED array, binary search finds the single element in O(log n). */
function singleInSorted(sorted) {
  let lo = 0;
  let hi = sorted.length - 1;

  while (lo < hi) {
    let mid = (lo + hi) >> 1;
    if (mid % 2 === 1) mid--;

    if (sorted[mid] === sorted[mid + 1]) lo = mid + 2;
    else hi = mid;
  }

  return sorted[lo];
}

// ---- Examples ----
console.log(singleNumber([4, 1, 2, 1, 2]));       // 4
console.log(singleOccurrences([1, 2, 2, 3, 4, 4]));// [1, 3]
console.log(firstSingle([2, 2, 1, 3]));           // 1
console.log(occurringExactly([1, 1, 2, 3, 3, 3], 3)); // [3]
console.log(twoSingleNumbers([1, 2, 1, 3, 2, 5]));// [3, 5] (order may vary)
console.log(singleAmongTriples([2, 2, 3, 2]));    // 3
console.log(singleInSorted([1, 1, 2, 3, 3]));     // 2

module.exports = { singleNumber, singleOccurrences, firstSingle, occurringExactly, twoSingleNumbers, singleAmongTriples, singleInSorted };
