/**
 * Maximum Subarray (LeetCode 53) — Kadane's algorithm.
 *
 * At each position the best subarray ending here is either just this
 * element, or this element extending the previous best.
 *
 * Time  O(n)
 * Space O(1)
 */

/** The maximum sum. Handles all-negative arrays correctly. */
function maxSubarraySum(arr) {
  if (arr.length === 0) return 0;

  let best = arr[0];
  let current = arr[0];

  for (let i = 1; i < arr.length; i++) {
    current = Math.max(arr[i], current + arr[i]);
    best = Math.max(best, current);
  }

  return best;
}

/** The subarray itself, with its bounds. */
function maxSubarray(arr) {
  if (arr.length === 0) return { sum: 0, start: -1, end: -1, subarray: [] };

  let best = arr[0];
  let current = arr[0];
  let bestStart = 0;
  let bestEnd = 0;
  let currentStart = 0;

  for (let i = 1; i < arr.length; i++) {
    if (current + arr[i] < arr[i]) {
      current = arr[i];
      currentStart = i; // start a fresh run here
    } else {
      current += arr[i];
    }

    if (current > best) {
      best = current;
      bestStart = currentStart;
      bestEnd = i;
    }
  }

  return { sum: best, start: bestStart, end: bestEnd, subarray: arr.slice(bestStart, bestEnd + 1) };
}

/**
 * Circular maximum subarray (LeetCode 918).
 * Either the answer does not wrap (plain Kadane), or it wraps — in which
 * case it is total minus the MINIMUM subarray.
 */
function maxSubarraySumCircular(arr) {
  let total = 0;
  let maxSum = -Infinity;
  let curMax = 0;
  let minSum = Infinity;
  let curMin = 0;

  for (const n of arr) {
    total += n;
    curMax = Math.max(n, curMax + n);
    maxSum = Math.max(maxSum, curMax);
    curMin = Math.min(n, curMin + n);
    minSum = Math.min(minSum, curMin);
  }

  // All negative: total - minSum would be 0, an empty subarray, so guard it.
  return maxSum > 0 ? Math.max(maxSum, total - minSum) : maxSum;
}

/** Divide and conquer version — O(n log n), the classic alternative. */
function maxSubarrayDivideConquer(arr, lo = 0, hi = arr.length - 1) {
  if (lo > hi) return -Infinity;
  if (lo === hi) return arr[lo];

  const mid = (lo + hi) >> 1;

  let leftBest = -Infinity;
  let sum = 0;
  for (let i = mid; i >= lo; i--) {
    sum += arr[i];
    leftBest = Math.max(leftBest, sum);
  }

  let rightBest = -Infinity;
  sum = 0;
  for (let i = mid + 1; i <= hi; i++) {
    sum += arr[i];
    rightBest = Math.max(rightBest, sum);
  }

  return Math.max(
    maxSubarrayDivideConquer(arr, lo, mid),
    maxSubarrayDivideConquer(arr, mid + 1, hi),
    leftBest + rightBest
  );
}

/** Minimum subarray sum — Kadane with the comparisons flipped. */
function minSubarraySum(arr) {
  let best = arr[0];
  let current = arr[0];

  for (let i = 1; i < arr.length; i++) {
    current = Math.min(arr[i], current + arr[i]);
    best = Math.min(best, current);
  }

  return best;
}

// ---- Examples ----
console.log(maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(maxSubarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));    // [4,-1,2,1]
console.log(maxSubarraySum([-3, -1, -2]));                    // -1
console.log(maxSubarraySumCircular([5, -3, 5]));              // 10
console.log(maxSubarrayDivideConquer([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(minSubarraySum([3, -4, 2, -3, -1, 7, -5]));       // -6

module.exports = { maxSubarraySum, maxSubarray, maxSubarraySumCircular, maxSubarrayDivideConquer, minSubarraySum };
