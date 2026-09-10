/**
 * Two Sum (LeetCode 1).
 *
 * Given an array of integers and a target, return the indices of the two
 * numbers that add up to the target. Exactly one solution is assumed and
 * an element may not be used twice.
 *
 * Time  O(n)
 * Space O(n)
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @returns {[number, number] | []}
 */
function twoSum(nums, target) {
  const seen = new Map(); // value -> index

  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }

  return [];
}

/**
 * Two-pointer variant for a SORTED array — O(1) extra space,
 * but returns indices into the sorted array.
 */
function twoSumSorted(sorted, target) {
  let lo = 0;
  let hi = sorted.length - 1;

  while (lo < hi) {
    const sum = sorted[lo] + sorted[hi];
    if (sum === target) return [lo, hi];
    if (sum < target) lo++;
    else hi--;
  }

  return [];
}

/** All unique pairs of VALUES that sum to target. */
function allPairsSummingTo(nums, target) {
  const seen = new Set();
  const pairs = new Set();

  for (const n of nums) {
    const need = target - n;
    if (seen.has(need)) pairs.add(JSON.stringify([Math.min(n, need), Math.max(n, need)]));
    seen.add(n);
  }

  return [...pairs].map((s) => JSON.parse(s));
}

// ---- Examples ----
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6));      // [1, 2]
console.log(twoSum([3, 3], 6));         // [0, 1]
console.log(twoSum([1, 2], 100));       // []

console.log(twoSumSorted([1, 3, 4, 5, 7], 8));   // [1, 4]
console.log(allPairsSummingTo([1, 5, 3, 3, 7, -1], 6)); // [[1,5],[3,3],[-1,7]]

module.exports = { twoSum, twoSumSorted, allPairsSummingTo };
