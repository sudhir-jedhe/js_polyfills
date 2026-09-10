/**
 * Largest sum of a contiguous INCREASING subarray.
 *
 * Walk once, extending the current run while the values keep increasing and
 * restarting the sum when they do not.
 *
 * Time  O(n)
 * Space O(1)
 */

/**
 * @param {number[]} arr
 * @returns {{ sum: number, start: number, end: number }}
 */
function maxIncreasingSubarraySum(arr) {
  if (arr.length === 0) return { sum: 0, start: -1, end: -1 };

  let bestSum = arr[0];
  let bestStart = 0;
  let bestEnd = 0;

  let currentSum = arr[0];
  let currentStart = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > arr[i - 1]) {
      currentSum += arr[i];
    } else {
      currentSum = arr[i];
      currentStart = i;
    }

    if (currentSum > bestSum) {
      bestSum = currentSum;
      bestStart = currentStart;
      bestEnd = i;
    }
  }

  return { sum: bestSum, start: bestStart, end: bestEnd };
}

/** The subarray itself. */
function maxIncreasingSubarray(arr) {
  const { start, end } = maxIncreasingSubarraySum(arr);
  return start === -1 ? [] : arr.slice(start, end + 1);
}

/** LONGEST increasing run rather than the largest-sum one (LeetCode 674). */
function longestIncreasingRun(arr) {
  if (arr.length === 0) return [];

  let bestStart = 0;
  let bestLength = 1;
  let currentStart = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] <= arr[i - 1]) currentStart = i;

    if (i - currentStart + 1 > bestLength) {
      bestLength = i - currentStart + 1;
      bestStart = currentStart;
    }
  }

  return arr.slice(bestStart, bestStart + bestLength);
}

/** Maximum sum of ANY contiguous subarray — Kadane's algorithm. */
function maxSubarraySum(arr) {
  let best = -Infinity;
  let current = 0;

  for (const n of arr) {
    current = Math.max(n, current + n);
    best = Math.max(best, current);
  }

  return best;
}

/** Maximum sum of an increasing SUBSEQUENCE (not necessarily contiguous). */
function maxIncreasingSubsequenceSum(arr) {
  const dp = [...arr]; // dp[i] = best sum of an increasing subsequence ending at i

  for (let i = 1; i < arr.length; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[j] < arr[i]) dp[i] = Math.max(dp[i], dp[j] + arr[i]);
    }
  }

  return arr.length ? Math.max(...dp) : 0;
}

// ---- Examples ----
console.log(maxIncreasingSubarraySum([1, 2, 3, 2, 5, 1, 7]));
console.log(maxIncreasingSubarray([2, 1, 4, 7, 3, 6]));      // [1, 4, 7]
console.log(longestIncreasingRun([1, 3, 5, 4, 7]));          // [1, 3, 5]
console.log(maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4]));// 6
console.log(maxIncreasingSubsequenceSum([1, 101, 2, 3, 100])); // 106

module.exports = {
  maxIncreasingSubarraySum,
  maxIncreasingSubarray,
  longestIncreasingRun,
  maxSubarraySum,
  maxIncreasingSubsequenceSum,
};
