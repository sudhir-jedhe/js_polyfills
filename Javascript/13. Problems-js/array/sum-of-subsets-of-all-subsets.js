/**
 * Sum of the subsets of all the subsets of an array.
 *
 * The naive route generates every subset, then every sub-subset — O(3^n).
 * The closed form is far better: each element appears in a fixed number of
 * (subset, sub-subset) pairs, so the answer is
 *
 *     total * 3^(n-1)
 *
 * because for each element, every OTHER element independently is: absent,
 * in the subset only, or in both — three choices — and the element itself
 * must be in both.
 *
 * Time  O(n)
 */

/** The closed form. O(n). */
function sumOfSubsetsOfAllSubsets(arr) {
  const n = arr.length;
  if (n === 0) return 0;

  const total = arr.reduce((a, b) => a + b, 0);
  return total * 3 ** (n - 1);
}

/** Exact for large n, using BigInt. */
function sumOfSubsetsOfAllSubsetsBigInt(arr) {
  const n = BigInt(arr.length);
  if (n === 0n) return 0n;

  const total = arr.reduce((a, b) => a + BigInt(b), 0n);
  return total * 3n ** (n - 1n);
}

/** All subsets of an array, via bitmasks. */
function allSubsets(arr) {
  const out = [];

  for (let mask = 0; mask < 1 << arr.length; mask++) {
    const subset = [];
    for (let i = 0; i < arr.length; i++) {
      if (mask & (1 << i)) subset.push(arr[i]);
    }
    out.push(subset);
  }

  return out;
}

/** The O(3^n) brute force, for verifying the closed form. */
function sumOfSubsetsOfAllSubsetsBrute(arr) {
  let total = 0;

  for (const subset of allSubsets(arr)) {
    for (const subSubset of allSubsets(subset)) {
      total += subSubset.reduce((a, b) => a + b, 0);
    }
  }

  return total;
}

/**
 * Sum of ALL subset sums (one level, not two): each element appears in
 * 2^(n-1) subsets, so the answer is total * 2^(n-1).
 */
function sumOfAllSubsetSums(arr) {
  const n = arr.length;
  return n === 0 ? 0 : arr.reduce((a, b) => a + b, 0) * 2 ** (n - 1);
}

/** Sum of the MINIMUMS of every subset. */
function sumOfSubsetMinimums(arr) {
  const sorted = [...arr].sort((a, b) => a - b);

  // sorted[i] is the minimum of the 2^(n-1-i) subsets drawn from the
  // elements at or after i that include it.
  return sorted.reduce((total, value, i) => total + value * 2 ** (sorted.length - 1 - i), 0);
}

/** Sum of the MAXIMUMS of every subset. */
function sumOfSubsetMaximums(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  return sorted.reduce((total, value, i) => total + value * 2 ** i, 0);
}

// ---- Examples ----
console.log(sumOfSubsetsOfAllSubsets([1, 1]));        // 2 * 3 = 6
console.log(sumOfSubsetsOfAllSubsetsBrute([1, 1]));   // 6
console.log(sumOfSubsetsOfAllSubsets([1, 2, 3]));     // 6 * 9 = 54
console.log(sumOfSubsetsOfAllSubsetsBrute([1, 2, 3]));// 54
console.log(sumOfAllSubsetSums([1, 2, 3]));           // 24
console.log(sumOfSubsetMinimums([1, 2, 3]));          // 1*4 + 2*2 + 3*1 = 11
console.log(sumOfSubsetMaximums([1, 2, 3]));          // 1*1 + 2*2 + 3*4 = 17
console.log(sumOfSubsetsOfAllSubsetsBigInt([1, 2, 3]).toString()); // '54'

module.exports = { sumOfSubsetsOfAllSubsets, sumOfSubsetsOfAllSubsetsBigInt, sumOfSubsetsOfAllSubsetsBrute, sumOfAllSubsetSums, sumOfSubsetMinimums, sumOfSubsetMaximums, allSubsets };
