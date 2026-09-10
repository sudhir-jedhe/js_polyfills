/**
 * Largest Divisible Subset (LeetCode 368).
 *
 * Find the largest subset where every pair (a, b) satisfies a % b === 0 or
 * b % a === 0. Sorting makes divisibility transitive along the chain, so
 * this becomes a longest-increasing-subsequence style DP.
 *
 * Time  O(n^2)
 * Space O(n)
 */

/**
 * @param {number[]} nums distinct positive integers
 * @returns {number[]}
 */
function largestDivisibleSubset(nums) {
  if (nums.length === 0) return [];

  const sorted = [...nums].sort((a, b) => a - b);
  const n = sorted.length;

  const length = new Array(n).fill(1);  // best chain ending at i
  const previous = new Array(n).fill(-1); // for reconstruction

  let bestIndex = 0;

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      // Sorted, so sorted[i] >= sorted[j]; one divisibility check suffices.
      if (sorted[i] % sorted[j] === 0 && length[j] + 1 > length[i]) {
        length[i] = length[j] + 1;
        previous[i] = j;
      }
    }

    if (length[i] > length[bestIndex]) bestIndex = i;
  }

  const out = [];
  for (let i = bestIndex; i !== -1; i = previous[i]) out.unshift(sorted[i]);
  return out;
}

/** Just the size of the largest such subset. */
const largestDivisibleSubsetSize = (nums) => largestDivisibleSubset(nums).length;

/** Every divisor of n. */
function divisors(n) {
  const out = [];

  for (let d = 1; d * d <= n; d++) {
    if (n % d !== 0) continue;
    out.push(d);
    if (d !== n / d) out.push(n / d);
  }

  return out.sort((a, b) => a - b);
}

/** The classic Longest Increasing Subsequence, the same DP shape. */
function longestIncreasingSubsequence(nums) {
  const tails = [];        // tails[i] = smallest tail of an LIS of length i+1
  const tailIndex = [];
  const previous = new Array(nums.length).fill(-1);

  for (let i = 0; i < nums.length; i++) {
    let lo = 0;
    let hi = tails.length;

    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < nums[i]) lo = mid + 1;
      else hi = mid;
    }

    tails[lo] = nums[i];
    tailIndex[lo] = i;
    previous[i] = lo > 0 ? tailIndex[lo - 1] : -1;
  }

  const out = [];
  for (let i = tailIndex[tails.length - 1]; i !== undefined && i !== -1; i = previous[i]) {
    out.unshift(nums[i]);
  }

  return out;
}

// ---- Examples ----
console.log(largestDivisibleSubset([1, 2, 3]));        // [1, 2] or [1, 3]
console.log(largestDivisibleSubset([1, 2, 4, 8]));     // [1, 2, 4, 8]
console.log(largestDivisibleSubset([3, 4, 16, 8]));    // [4, 8, 16]
console.log(largestDivisibleSubsetSize([1, 2, 4, 8])); // 4
console.log(divisors(36));                             // [1,2,3,4,6,9,12,18,36]
console.log(longestIncreasingSubsequence([10, 9, 2, 5, 3, 7, 101, 18])); // length 4

module.exports = { largestDivisibleSubset, largestDivisibleSubsetSize, divisors, longestIncreasingSubsequence };
