/**
 * Partition an array of non-negative integers into two subsets whose
 * AVERAGES are equal (LeetCode 805 — Split Array With Same Average).
 *
 * If both subsets share the average, each equals the overall average, so a
 * subset of size k must sum to total * k / n. Search only sizes up to n/2
 * and only sums that are integral — that prunes almost everything.
 *
 * Time  O(n^2 * total)
 */

/**
 * @param {number[]} nums non-negative integers
 * @returns {boolean}
 */
function canSplitWithSameAverage(nums) {
  const n = nums.length;
  if (n < 2) return false;

  const total = nums.reduce((a, b) => a + b, 0);

  // Quick rejection: no size k in 1..n/2 gives an integral target sum.
  const half = Math.floor(n / 2);
  let possible = false;
  for (let k = 1; k <= half; k++) {
    if ((total * k) % n === 0) {
      possible = true;
      break;
    }
  }
  if (!possible) return false;

  // reachable[k] = set of sums achievable using exactly k elements.
  const reachable = Array.from({ length: half + 1 }, () => new Set());
  reachable[0].add(0);

  for (const value of nums) {
    for (let k = half; k >= 1; k--) {
      for (const sum of reachable[k - 1]) reachable[k].add(sum + value);
    }
  }

  for (let k = 1; k <= half; k++) {
    if ((total * k) % n === 0 && reachable[k].has((total * k) / n)) return true;
  }

  return false;
}

/** The actual subsets, when one exists. */
function findEqualAverageSplit(nums) {
  const n = nums.length;
  const total = nums.reduce((a, b) => a + b, 0);
  const half = Math.floor(n / 2);

  for (let k = 1; k <= half; k++) {
    if ((total * k) % n !== 0) continue;
    const target = (total * k) / n;

    const subset = findSubset(nums, k, target);
    if (subset) {
      const used = [...subset];
      const rest = [];
      const pool = [...nums];

      for (const value of used) pool.splice(pool.indexOf(value), 1);
      rest.push(...pool);

      return { a: used, b: rest, average: total / n };
    }
  }

  return null;
}

/** Find any k elements summing to target. */
function findSubset(nums, k, target, index = 0, current = []) {
  if (current.length === k) return target === 0 ? current : null;
  if (index >= nums.length) return null;

  const withIt = findSubset(nums, k, target - nums[index], index + 1, [...current, nums[index]]);
  if (withIt) return withIt;

  return findSubset(nums, k, target, index + 1, current);
}

/** Equal SUM partition, the simpler cousin (LeetCode 416). */
function canPartitionEqualSum(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;

  const target = total / 2;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;

  for (const value of nums) {
    for (let s = target; s >= value; s--) dp[s] = dp[s] || dp[s - value];
  }

  return dp[target];
}

// ---- Examples ----
console.log(canSplitWithSameAverage([1, 2, 3, 4, 5, 6, 7, 8]));  // true
console.log(canSplitWithSameAverage([3, 1]));                    // false
console.log(findEqualAverageSplit([1, 2, 3, 4, 5, 6, 7, 8]));
console.log(canPartitionEqualSum([1, 5, 11, 5]));                // true
console.log(canPartitionEqualSum([1, 2, 3, 5]));                 // false

module.exports = { canSplitWithSameAverage, findEqualAverageSplit, canPartitionEqualSum, findSubset };
