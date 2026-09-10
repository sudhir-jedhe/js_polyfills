/**
 * Number of subarrays with sum exactly K (LeetCode 560).
 *
 * Prefix sums plus a hash map: if prefix[j] - prefix[i] === k, then the
 * subarray (i, j] sums to k. So for each j, count how many earlier prefixes
 * equal prefix[j] - k.
 *
 * Time  O(n)
 * Space O(n)
 *
 * Works with negative numbers, which is why the sliding window does NOT.
 */

/**
 * @param {number[]} arr
 * @param {number} k
 * @returns {number}
 */
function countSubarraysWithSum(arr, k) {
  const seen = new Map([[0, 1]]); // an empty prefix sums to 0
  let running = 0;
  let count = 0;

  for (const value of arr) {
    running += value;
    count += seen.get(running - k) || 0;
    seen.set(running, (seen.get(running) || 0) + 1);
  }

  return count;
}

/** The subarrays themselves, as [start, end] index pairs. */
function findSubarraysWithSum(arr, k) {
  const starts = new Map([[0, [0]]]); // prefix value -> indexes where it occurred
  let running = 0;
  const out = [];

  for (let j = 0; j < arr.length; j++) {
    running += arr[j];

    for (const i of starts.get(running - k) || []) out.push([i, j]);

    if (!starts.has(running)) starts.set(running, []);
    starts.get(running).push(j + 1);
  }

  return out;
}

/**
 * Sliding window — only valid for NON-NEGATIVE values, but O(1) space.
 */
function countSubarraysNonNegative(arr, k) {
  let count = 0;
  let sum = 0;
  let left = 0;

  for (let right = 0; right < arr.length; right++) {
    sum += arr[right];
    while (sum > k && left <= right) sum -= arr[left++];
    if (sum === k) count++;
  }

  return count;
}

/** Longest subarray with sum k (LeetCode 325). */
function longestSubarrayWithSum(arr, k) {
  const firstIndex = new Map([[0, -1]]);
  let running = 0;
  let best = 0;

  for (let i = 0; i < arr.length; i++) {
    running += arr[i];

    if (firstIndex.has(running - k)) {
      best = Math.max(best, i - firstIndex.get(running - k));
    }

    // Keep only the FIRST occurrence, so the span stays as long as possible.
    if (!firstIndex.has(running)) firstIndex.set(running, i);
  }

  return best;
}

/** Subarrays whose sum is divisible by k (LeetCode 974). */
function countSubarraysDivisibleByK(arr, k) {
  const counts = new Map([[0, 1]]);
  let running = 0;
  let count = 0;

  for (const value of arr) {
    running = (((running + value) % k) + k) % k; // keep the remainder positive
    count += counts.get(running) || 0;
    counts.set(running, (counts.get(running) || 0) + 1);
  }

  return count;
}

// ---- Examples ----
console.log(countSubarraysWithSum([1, 1, 1], 2));        // 2
console.log(countSubarraysWithSum([1, 2, 3], 3));        // 2
console.log(countSubarraysWithSum([1, -1, 0], 0));       // 3
console.log(findSubarraysWithSum([1, 2, 3], 3));         // [[0,1],[2,2]]
console.log(countSubarraysNonNegative([1, 2, 3], 3));    // 2
console.log(longestSubarrayWithSum([1, -1, 5, -2, 3], 3));// 4
console.log(countSubarraysDivisibleByK([4, 5, 0, -2, -3, 1], 5)); // 7

module.exports = { countSubarraysWithSum, findSubarraysWithSum, countSubarraysNonNegative, longestSubarrayWithSum, countSubarraysDivisibleByK };
