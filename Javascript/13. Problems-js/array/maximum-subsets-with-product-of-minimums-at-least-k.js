/**
 * Maximum number of subsets an array can be split into such that, for each
 * subset, (minimum of the subset) * (size of the subset) is at least k.
 *
 * Greedy: sort DESCENDING and grow a subset until the current element (the
 * running minimum) times the size reaches k, then close it and start again.
 * Taking the largest values first keeps each subset's minimum as high as
 * possible, so subsets close as early as they can.
 *
 * Time  O(n log n)
 * Space O(1)
 */

/**
 * @param {number[]} arr
 * @param {number} k
 * @returns {number} how many valid subsets can be formed
 */
function maxSubsets(arr, k) {
  const sorted = [...arr].sort((a, b) => b - a);

  let subsets = 0;
  let size = 0;

  for (const value of sorted) {
    size++;
    // `value` is the smallest so far, since the array is descending.
    if (value * size >= k) {
      subsets++;
      size = 0; // close this subset
    }
  }

  return subsets;
}

/** The subsets themselves, for inspection. */
function buildSubsets(arr, k) {
  const sorted = [...arr].sort((a, b) => b - a);

  const out = [];
  let current = [];

  for (const value of sorted) {
    current.push(value);
    if (value * current.length >= k) {
      out.push(current);
      current = [];
    }
  }

  return { subsets: out, leftover: current };
}

/**
 * The closely related LeetCode 1296-style problem: split into groups where
 * each group's size is at least k... a simpler counting version.
 */
const maxGroupsOfSize = (arr, k) => Math.floor(arr.length / k);

/** Verify a proposed split. */
const isValidSplit = (subsets, k) =>
  subsets.every((subset) => Math.min(...subset) * subset.length >= k);

/** Brute-force check for tiny inputs, to confirm the greedy is optimal. */
function maxSubsetsBrute(arr, k) {
  let best = 0;

  const search = (remaining, current, count) => {
    if (current.length && Math.min(...current) * current.length >= k) {
      best = Math.max(best, count + 1);
      search(remaining, [], count + 1);
      return;
    }
    if (!remaining.length) {
      best = Math.max(best, count);
      return;
    }

    for (let i = 0; i < remaining.length; i++) {
      const rest = [...remaining.slice(0, i), ...remaining.slice(i + 1)];
      search(rest, [...current, remaining[i]], count);
    }
  };

  search(arr, [], 0);
  return best;
}

// ---- Examples ----
console.log(maxSubsets([7, 9, 2, 5], 7));   // 2
console.log(maxSubsets([2, 2, 2], 7));      // 0
console.log(maxSubsets([1, 1, 1, 1], 2));   // 2
console.log(buildSubsets([7, 9, 2, 5], 7));
console.log(isValidSplit([[9], [7]], 7));   // true
console.log(maxGroupsOfSize([1, 2, 3, 4, 5], 2)); // 2

module.exports = { maxSubsets, buildSubsets, maxGroupsOfSize, isValidSplit, maxSubsetsBrute };
