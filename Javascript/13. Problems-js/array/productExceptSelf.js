/**
 * Product of Array Except Self (LeetCode 238).
 *
 * For each index, the product of every other element — WITHOUT using
 * division, so a zero anywhere does not break it.
 *
 * Two passes: prefix products left-to-right, then suffix products
 * right-to-left, multiplied in place.
 *
 * Time  O(n)
 * Space O(1) beyond the output
 */

/**
 * @param {number[]} nums
 * @returns {number[]}
 */
function productExceptSelf(nums) {
  const n = nums.length;
  const out = new Array(n).fill(1);

  // out[i] becomes the product of everything to the LEFT of i.
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    out[i] = prefix;
    prefix *= nums[i];
  }

  // Multiply in the product of everything to the RIGHT of i.
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    out[i] *= suffix;
    suffix *= nums[i];
  }

  return out;
}

/**
 * The division approach, with the zero cases handled explicitly.
 * Shorter, but fails on floating point and needs the zero special cases.
 */
function productExceptSelfDivision(nums) {
  const zeros = nums.filter((n) => n === 0).length;

  if (zeros > 1) return new Array(nums.length).fill(0); // every product is 0

  const product = nums.reduce((acc, n) => (n === 0 ? acc : acc * n), 1);

  if (zeros === 1) {
    // Only the position of the zero gets a non-zero product.
    return nums.map((n) => (n === 0 ? product : 0));
  }

  return nums.map((n) => product / n);
}

/** SUM except self, the same prefix/suffix idea. */
function sumExceptSelf(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  return nums.map((n) => total - n);
}

/** Maximum except self. */
function maxExceptSelf(nums) {
  const n = nums.length;
  const prefix = new Array(n).fill(-Infinity);
  const suffix = new Array(n).fill(-Infinity);

  for (let i = 1; i < n; i++) prefix[i] = Math.max(prefix[i - 1], nums[i - 1]);
  for (let i = n - 2; i >= 0; i--) suffix[i] = Math.max(suffix[i + 1], nums[i + 1]);

  return nums.map((_, i) => Math.max(prefix[i], suffix[i]));
}

/** Running prefix products, exposed for reuse. */
const prefixProducts = (nums) => {
  let product = 1;
  return nums.map((n) => (product *= n));
};

// ---- Examples ----
console.log(productExceptSelf([1, 2, 3, 4]));          // [24, 12, 8, 6]
console.log(productExceptSelf([-1, 1, 0, -3, 3]));     // [0, 0, 9, 0, 0]
console.log(productExceptSelfDivision([1, 2, 3, 4]));  // [24, 12, 8, 6]
console.log(productExceptSelfDivision([0, 0, 3]));     // [0, 0, 0]
console.log(sumExceptSelf([1, 2, 3]));                 // [5, 4, 3]
console.log(maxExceptSelf([1, 5, 3]));                 // [5, 3, 5]
console.log(prefixProducts([1, 2, 3, 4]));             // [1, 2, 6, 24]

module.exports = { productExceptSelf, productExceptSelfDivision, sumExceptSelf, maxExceptSelf, prefixProducts };
