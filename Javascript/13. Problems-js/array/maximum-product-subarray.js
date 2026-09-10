/**
 * Maximum Product Subarray (LeetCode 152).
 *
 * Unlike the sum version, a large NEGATIVE product can become the maximum
 * after one more negative number — so the running minimum must be tracked
 * alongside the running maximum.
 *
 * Time  O(n)
 * Space O(1)
 */

/**
 * @param {number[]} nums
 * @returns {number}
 */
function maxProduct(nums) {
  if (nums.length === 0) return 0;

  let best = nums[0];
  let curMax = nums[0];
  let curMin = nums[0];

  for (let i = 1; i < nums.length; i++) {
    const n = nums[i];

    // A negative n swaps the roles of the running max and min.
    if (n < 0) [curMax, curMin] = [curMin, curMax];

    curMax = Math.max(n, curMax * n);
    curMin = Math.min(n, curMin * n);

    best = Math.max(best, curMax);
  }

  return best;
}

/** The subarray itself, with its bounds. */
function maxProductSubarray(nums) {
  if (!nums.length) return { product: 0, subarray: [] };

  let best = nums[0];
  let bestStart = 0;
  let bestEnd = 0;

  let curMax = nums[0];
  let curMin = nums[0];
  let maxStart = 0;
  let minStart = 0;

  for (let i = 1; i < nums.length; i++) {
    const n = nums[i];

    const candidates = [
      { value: n, start: i },
      { value: curMax * n, start: maxStart },
      { value: curMin * n, start: minStart },
    ];

    const nextMax = candidates.reduce((a, b) => (b.value > a.value ? b : a));
    const nextMin = candidates.reduce((a, b) => (b.value < a.value ? b : a));

    curMax = nextMax.value;
    maxStart = nextMax.start;
    curMin = nextMin.value;
    minStart = nextMin.start;

    if (curMax > best) {
      best = curMax;
      bestStart = maxStart;
      bestEnd = i;
    }
  }

  return { product: best, subarray: nums.slice(bestStart, bestEnd + 1) };
}

/**
 * Prefix/suffix scan — an elegant alternative. Any maximum-product subarray
 * touches one end of a zero-free block, so scanning both directions and
 * resetting on zeros finds it.
 */
function maxProductTwoPass(nums) {
  let best = -Infinity;
  let product = 1;

  for (const n of nums) {
    product *= n;
    best = Math.max(best, product);
    if (product === 0) product = 1;
  }

  product = 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    product *= nums[i];
    best = Math.max(best, product);
    if (product === 0) product = 1;
  }

  return best;
}

/** Maximum product of any k elements (not necessarily contiguous). */
function maxProductOfK(nums, k) {
  const sorted = [...nums].sort((a, b) => a - b);
  let best = -Infinity;

  // Take i from the negative end and k - i from the positive end.
  for (let i = 0; i <= k; i++) {
    if (i > sorted.length || k - i > sorted.length - i) continue;

    const left = sorted.slice(0, i);
    const right = sorted.slice(sorted.length - (k - i));
    if (left.length + right.length !== k) continue;

    const product = [...left, ...right].reduce((a, b) => a * b, 1);
    best = Math.max(best, product);
  }

  return best;
}

// ---- Examples ----
console.log(maxProduct([2, 3, -2, 4]));       // 6
console.log(maxProduct([-2, 0, -1]));         // 0
console.log(maxProduct([-2, 3, -4]));         // 24
console.log(maxProductSubarray([2, 3, -2, 4]));// { product: 6, subarray: [2,3] }
console.log(maxProductTwoPass([2, 3, -2, 4]));// 6
console.log(maxProductOfK([-10, -10, 1, 3, 2], 3)); // 300

module.exports = { maxProduct, maxProductSubarray, maxProductTwoPass, maxProductOfK };
