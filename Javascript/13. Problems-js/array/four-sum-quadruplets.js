/**
 * Print all the quadruplets with a given 4-sum (LeetCode 18).
 *
 * Sort, fix the outer two indexes, then run a two-pointer scan over the
 * remainder. Skipping equal neighbours is what keeps the results unique.
 *
 * Time  O(n^3)
 * Space O(1) beyond the output
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @returns {number[][]} unique quadruplets summing to target
 */
function fourSum(nums, target) {
  const arr = [...nums].sort((a, b) => a - b);
  const n = arr.length;
  const out = [];

  for (let i = 0; i < n - 3; i++) {
    if (i > 0 && arr[i] === arr[i - 1]) continue; // skip duplicate first values

    // Pruning: the smallest / largest possible sums from here.
    if (arr[i] + arr[i + 1] + arr[i + 2] + arr[i + 3] > target) break;
    if (arr[i] + arr[n - 3] + arr[n - 2] + arr[n - 1] < target) continue;

    for (let j = i + 1; j < n - 2; j++) {
      if (j > i + 1 && arr[j] === arr[j - 1]) continue;

      let lo = j + 1;
      let hi = n - 1;

      while (lo < hi) {
        const sum = arr[i] + arr[j] + arr[lo] + arr[hi];

        if (sum === target) {
          out.push([arr[i], arr[j], arr[lo], arr[hi]]);

          while (lo < hi && arr[lo] === arr[lo + 1]) lo++;
          while (lo < hi && arr[hi] === arr[hi - 1]) hi--;

          lo++;
          hi--;
        } else if (sum < target) lo++;
        else hi--;
      }
    }
  }

  return out;
}

/** Three-sum, the same shape one level down (LeetCode 15). */
function threeSum(nums, target = 0) {
  const arr = [...nums].sort((a, b) => a - b);
  const out = [];

  for (let i = 0; i < arr.length - 2; i++) {
    if (i > 0 && arr[i] === arr[i - 1]) continue;

    let lo = i + 1;
    let hi = arr.length - 1;

    while (lo < hi) {
      const sum = arr[i] + arr[lo] + arr[hi];

      if (sum === target) {
        out.push([arr[i], arr[lo], arr[hi]]);
        while (lo < hi && arr[lo] === arr[lo + 1]) lo++;
        while (lo < hi && arr[hi] === arr[hi - 1]) hi--;
        lo++;
        hi--;
      } else if (sum < target) lo++;
      else hi--;
    }
  }

  return out;
}

/**
 * Generic k-sum by recursion down to the two-pointer base case.
 * Time  O(n^(k-1))
 */
function kSum(nums, target, k) {
  const arr = [...nums].sort((a, b) => a - b);

  function solve(start, target, k) {
    const out = [];
    if (start >= arr.length) return out;

    if (k === 2) {
      let lo = start;
      let hi = arr.length - 1;

      while (lo < hi) {
        const sum = arr[lo] + arr[hi];

        if (sum === target) {
          out.push([arr[lo], arr[hi]]);
          while (lo < hi && arr[lo] === arr[lo + 1]) lo++;
          while (lo < hi && arr[hi] === arr[hi - 1]) hi--;
          lo++;
          hi--;
        } else if (sum < target) lo++;
        else hi--;
      }

      return out;
    }

    for (let i = start; i < arr.length - k + 1; i++) {
      if (i > start && arr[i] === arr[i - 1]) continue;
      for (const rest of solve(i + 1, target - arr[i], k - 1)) out.push([arr[i], ...rest]);
    }

    return out;
  }

  return solve(0, target, k);
}

/** Count quadruplets across FOUR arrays summing to zero (LeetCode 454). */
function fourSumCount(a, b, c, d) {
  const sums = new Map();

  for (const x of a) {
    for (const y of b) sums.set(x + y, (sums.get(x + y) || 0) + 1);
  }

  let count = 0;
  for (const z of c) {
    for (const w of d) count += sums.get(-(z + w)) || 0;
  }

  return count;
}

// ---- Examples ----
console.log(fourSum([1, 0, -1, 0, -2, 2], 0));
// [[-2,-1,1,2], [-2,0,0,2], [-1,0,0,1]]

console.log(fourSum([2, 2, 2, 2, 2], 8));  // [[2,2,2,2]]
console.log(threeSum([-1, 0, 1, 2, -1, -4])); // [[-1,-1,2],[-1,0,1]]
console.log(kSum([1, 0, -1, 0, -2, 2], 0, 4));
console.log(fourSumCount([1, 2], [-2, -1], [-1, 2], [0, 2])); // 2

module.exports = { fourSum, threeSum, kSum, fourSumCount };
