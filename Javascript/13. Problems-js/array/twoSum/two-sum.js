/**
 * Two Sum (LeetCode 1).
 *
 * Given an array of integers and a target, return the indices of the two
 * numbers that add up to the target.
 *
 * The hash-map pass is the answer: for each element, ask whether its
 * complement has already been seen.
 *
 * Time  O(n)
 * Space O(n)
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @returns {[number, number] | []}
 */
function twoSum(nums, target) {
  const seen = new Map(); // value -> index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) return [seen.get(complement), i];
    seen.set(nums[i], i);
  }

  return [];
}

/** Brute force — O(n^2), the baseline to beat. */
function twoSumBrute(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}

/**
 * Two-pointer version for a SORTED array — O(1) extra space
 * (LeetCode 167; note it returns 1-based indices there).
 */
function twoSumSorted(sorted, target) {
  let lo = 0;
  let hi = sorted.length - 1;

  while (lo < hi) {
    const sum = sorted[lo] + sorted[hi];
    if (sum === target) return [lo, hi];
    if (sum < target) lo++;
    else hi--;
  }

  return [];
}

/** Every unique PAIR of values summing to the target. */
function allPairs(nums, target) {
  const seen = new Set();
  const pairs = new Set();

  for (const n of nums) {
    const complement = target - n;
    if (seen.has(complement)) {
      pairs.add(`${Math.min(n, complement)},${Math.max(n, complement)}`);
    }
    seen.add(n);
  }

  return [...pairs].map((s) => s.split(',').map(Number));
}

/** How many index pairs sum to the target, counting duplicates. */
function countPairs(nums, target) {
  const counts = new Map();
  let count = 0;

  for (const n of nums) {
    count += counts.get(target - n) || 0;
    counts.set(n, (counts.get(n) || 0) + 1);
  }

  return count;
}

/** Two Sum on a BST (LeetCode 653), using an inorder walk plus two pointers. */
function twoSumBST(root, target) {
  const values = [];

  (function inorder(node) {
    if (!node) return;
    inorder(node.left);
    values.push(node.val);
    inorder(node.right);
  })(root);

  const pair = twoSumSorted(values, target);
  return pair.length ? [values[pair[0]], values[pair[1]]] : [];
}

// ---- Examples ----
console.log(twoSum([2, 7, 11, 15], 9));   // [0, 1]
console.log(twoSum([3, 2, 4], 6));        // [1, 2]
console.log(twoSum([3, 3], 6));           // [0, 1]
console.log(twoSum([1, 2], 100));         // []
console.log(twoSumBrute([2, 7, 11, 15], 9));   // [0, 1]
console.log(twoSumSorted([1, 3, 4, 5, 7], 8)); // [1, 4]
console.log(allPairs([1, 5, 3, 3, 7, -1], 6)); // [[1,5],[3,3],[-1,7]]
console.log(countPairs([1, 5, 3, 3, 7], 6));   // 3

module.exports = { twoSum, twoSumBrute, twoSumSorted, allPairs, countPairs, twoSumBST };
