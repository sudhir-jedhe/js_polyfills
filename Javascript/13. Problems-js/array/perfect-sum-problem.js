/**
 * Perfect Sum Problem.
 *
 * Count (and list) the subsets of an array whose elements sum to a given
 * target. Zeros are the classic trap: each zero doubles the count, since it
 * can be in or out of any subset.
 *
 * Time  O(n * target)
 * Space O(target)
 */

/**
 * @param {number[]} arr non-negative integers
 * @param {number} target
 * @returns {number}
 */
function perfectSumCount(arr, target) {
  if (target < 0) return 0;

  const zeros = arr.filter((n) => n === 0).length;
  const nonZero = arr.filter((n) => n !== 0);

  const dp = new Array(target + 1).fill(0);
  dp[0] = 1;

  for (const value of nonZero) {
    // Downwards, so each value is used at most once per subset.
    for (let s = target; s >= value; s--) dp[s] += dp[s - value];
  }

  // Each zero can independently be in or out.
  return dp[target] * 2 ** zeros;
}

/** The subsets themselves. */
function perfectSumSubsets(arr, target) {
  const out = [];

  function build(index, remaining, current) {
    if (remaining === 0) {
      out.push([...current]);
      // Keep going: remaining zeros still form new subsets.
      for (let i = index; i < arr.length; i++) {
        if (arr[i] === 0) {
          current.push(0);
          build(i + 1, 0, current);
          current.pop();
        }
      }
      return;
    }

    if (index >= arr.length || remaining < 0) return;

    current.push(arr[index]);
    build(index + 1, remaining - arr[index], current);
    current.pop();

    build(index + 1, remaining, current);
  }

  build(0, target, []);
  return out;
}

/** Does ANY subset reach the target? */
function hasSubsetWithSum(arr, target) {
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;

  for (const value of arr) {
    for (let s = target; s >= value; s--) dp[s] = dp[s] || dp[s - value];
  }

  return dp[target];
}

/** The MINIMUM number of elements needed to reach the target, or -1. */
function minElementsForSum(arr, target) {
  const dp = new Array(target + 1).fill(Infinity);
  dp[0] = 0;

  for (const value of arr) {
    for (let s = target; s >= value; s--) {
      dp[s] = Math.min(dp[s], dp[s - value] + 1);
    }
  }

  return dp[target] === Infinity ? -1 : dp[target];
}

/** Counting with UNLIMITED reuse of each value (coin change 2). */
function countWithRepetition(coins, target) {
  const dp = new Array(target + 1).fill(0);
  dp[0] = 1;

  for (const coin of coins) {
    // Upwards this time, so a coin may be reused.
    for (let s = coin; s <= target; s++) dp[s] += dp[s - coin];
  }

  return dp[target];
}

// ---- Examples ----
console.log(perfectSumCount([2, 3, 5, 6, 8, 10], 10));  // 3
console.log(perfectSumCount([1, 2, 3, 3], 6));          // 3
console.log(perfectSumCount([0, 0, 1], 1));             // 4 (zeros double it)
console.log(perfectSumSubsets([2, 3, 5, 6, 8, 10], 10));
console.log(hasSubsetWithSum([3, 34, 4, 12, 5, 2], 9)); // true
console.log(minElementsForSum([1, 5, 11], 11));         // 1
console.log(countWithRepetition([1, 2, 5], 5));         // 4

module.exports = { perfectSumCount, perfectSumSubsets, hasSubsetWithSum, minElementsForSum, countWithRepetition };
