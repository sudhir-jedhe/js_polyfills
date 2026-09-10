/**
 * Count the ways to split an array into two subsets whose sums differ by k.
 *
 * If one subset sums to S1 and the other to S2:
 *   S1 + S2 = total
 *   S1 - S2 = k
 * so S1 = (total + k) / 2. The problem reduces to "count subsets summing to
 * (total + k) / 2", which is the standard counting knapsack.
 *
 * Time  O(n * total)
 * Space O(total)
 */

/** Count subsets of `arr` that sum to `target`. */
function countSubsetsWithSum(arr, target) {
  if (target < 0) return 0;

  const dp = new Array(target + 1).fill(0);
  dp[0] = 1;

  for (const value of arr) {
    if (value === 0) {
      for (let s = 0; s <= target; s++) dp[s] *= 2; // in or out
      continue;
    }
    for (let s = target; s >= value; s--) dp[s] += dp[s - value];
  }

  return dp[target];
}

/**
 * @param {number[]} arr non-negative integers
 * @param {number} k required difference
 * @returns {number}
 */
function countSplitsWithDifference(arr, k) {
  const total = arr.reduce((a, b) => a + b, 0);
  const target = total + k;

  // (total + k) must be non-negative and even for an integer subset sum.
  if (target < 0 || target % 2 !== 0) return 0;

  return countSubsetsWithSum(arr, target / 2);
}

/**
 * The minimum achievable difference between the two subset sums
 * (partition problem). Find the subset sum closest to total / 2.
 */
function minimumSubsetDifference(arr) {
  const total = arr.reduce((a, b) => a + b, 0);
  const half = Math.floor(total / 2);

  const reachable = new Array(half + 1).fill(false);
  reachable[0] = true;

  for (const value of arr) {
    for (let s = half; s >= value; s--) reachable[s] = reachable[s] || reachable[s - value];
  }

  for (let s = half; s >= 0; s--) {
    if (reachable[s]) return total - 2 * s;
  }

  return total;
}

/** Can the array be split into two subsets of EQUAL sum (LeetCode 416)? */
function canPartitionEqually(arr) {
  const total = arr.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;

  const target = total / 2;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;

  for (const value of arr) {
    for (let s = target; s >= value; s--) dp[s] = dp[s] || dp[s - value];
  }

  return dp[target];
}

// ---- Examples ----
console.log(countSplitsWithDifference([1, 1, 2, 3], 1)); // 3
console.log(countSplitsWithDifference([1, 2, 3, 4], 10));// 0
console.log(countSubsetsWithSum([1, 1, 2, 3], 4));       // 3
console.log(minimumSubsetDifference([1, 6, 11, 5]));     // 1
console.log(canPartitionEqually([1, 5, 11, 5]));         // true
console.log(canPartitionEqually([1, 2, 3, 5]));          // false

module.exports = { countSplitsWithDifference, countSubsetsWithSum, minimumSubsetDifference, canPartitionEqually };
