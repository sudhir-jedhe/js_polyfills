/**
 * Find the missing number in an array of 1..n (or 0..n).
 *
 * Two O(n) / O(1) approaches: the arithmetic-sum formula, and XOR, which
 * cannot overflow.
 */

/** Sum formula: expected total minus actual total. */
function missingNumber(arr, n = arr.length + 1) {
  const expected = (n * (n + 1)) / 2;
  const actual = arr.reduce((a, b) => a + b, 0);
  return expected - actual;
}

/** XOR — immune to integer overflow, same O(n)/O(1). */
function missingNumberXor(arr, n = arr.length + 1) {
  let xor = 0;

  for (let i = 1; i <= n; i++) xor ^= i;
  for (const value of arr) xor ^= value;

  return xor;
}

/** LeetCode 268 variant: the range is 0..n and n === arr.length. */
function missingNumberZeroBased(nums) {
  let xor = nums.length;
  for (let i = 0; i < nums.length; i++) xor ^= i ^ nums[i];
  return xor;
}

/** Several missing numbers from 1..n. */
function missingNumbers(arr, n) {
  const present = new Set(arr);
  const out = [];

  for (let i = 1; i <= n; i++) {
    if (!present.has(i)) out.push(i);
  }

  return out;
}

/**
 * All numbers in [1, n] missing from an array of length n whose values are
 * in [1, n] (LeetCode 448) — O(1) extra space by negating in place.
 */
function findDisappearedNumbers(nums) {
  const arr = [...nums];

  for (const value of arr) {
    const index = Math.abs(value) - 1;
    if (arr[index] > 0) arr[index] = -arr[index]; // mark as seen
  }

  const out = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > 0) out.push(i + 1);
  }

  return out;
}

/** The smallest MISSING POSITIVE integer (LeetCode 41). */
function firstMissingPositive(nums) {
  const arr = [...nums];
  const n = arr.length;

  // Place each value v in [1, n] at index v - 1.
  for (let i = 0; i < n; i++) {
    while (arr[i] > 0 && arr[i] <= n && arr[arr[i] - 1] !== arr[i]) {
      const target = arr[i] - 1;
      [arr[i], arr[target]] = [arr[target], arr[i]];
    }
  }

  for (let i = 0; i < n; i++) {
    if (arr[i] !== i + 1) return i + 1;
  }

  return n + 1;
}

// ---- Examples ----
console.log(missingNumber([1, 2, 4, 5], 5));       // 3
console.log(missingNumberXor([1, 2, 4, 5], 5));    // 3
console.log(missingNumberZeroBased([3, 0, 1]));    // 2
console.log(missingNumbers([1, 3, 5], 5));         // [2, 4]
console.log(findDisappearedNumbers([4, 3, 2, 7, 8, 2, 3, 1])); // [5, 6]
console.log(firstMissingPositive([3, 4, -1, 1]));  // 2

module.exports = { missingNumber, missingNumberXor, missingNumberZeroBased, missingNumbers, findDisappearedNumbers, firstMissingPositive };
