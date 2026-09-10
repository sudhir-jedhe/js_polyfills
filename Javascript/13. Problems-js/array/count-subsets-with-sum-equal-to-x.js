/**
 * Count subsets with sum equal to X.
 *
 * Classic 0/1 knapsack counting. Three versions: plain recursion (to show
 * the recurrence), memoised recursion, and the O(n * x) rolling DP that you
 * would actually ship.
 */

/**
 * Plain recursion — exponential, included for the recurrence:
 * count(i, target) = count(i-1, target) + count(i-1, target - arr[i])
 * Time O(2^n)
 */
function countSubsetsRecursive(arr, target, index = arr.length - 1) {
  if (target === 0 && index < 0) return 1;
  if (index < 0) return 0;

  const exclude = countSubsetsRecursive(arr, target, index - 1);
  const include = arr[index] <= target
    ? countSubsetsRecursive(arr, target - arr[index], index - 1)
    : 0;

  return exclude + include;
}

/** Memoised recursion — O(n * target). */
function countSubsetsMemo(arr, target) {
  const memo = new Map();

  function count(index, remaining) {
    if (remaining === 0 && index < 0) return 1;
    if (index < 0) return 0;

    const key = `${index}:${remaining}`;
    if (memo.has(key)) return memo.get(key);

    let total = count(index - 1, remaining);
    if (arr[index] <= remaining) total += count(index - 1, remaining - arr[index]);

    memo.set(key, total);
    return total;
  }

  return count(arr.length - 1, target);
}

/**
 * Bottom-up with a rolling 1-D array.
 * dp[s] = number of subsets of the items seen so far that sum to s.
 * Iterating s downwards keeps each item used at most once.
 *
 * Time  O(n * target)
 * Space O(target)
 */
function countSubsets(arr, target) {
  if (target < 0) return 0;

  const dp = new Array(target + 1).fill(0);
  dp[0] = 1; // the empty subset

  for (const value of arr) {
    if (value === 0) {
      // A zero can be in or out of every subset, doubling the count.
      for (let s = 0; s <= target; s++) dp[s] *= 2;
      continue;
    }
    for (let s = target; s >= value; s--) dp[s] += dp[s - value];
  }

  return dp[target];
}

/** The subsets themselves, when you need to see them. */
function findSubsetsWithSum(arr, target) {
  const out = [];

  function build(index, remaining, current) {
    if (remaining === 0) {
      out.push([...current]);
      return;
    }
    if (index >= arr.length || remaining < 0) return;

    current.push(arr[index]);
    build(index + 1, remaining - arr[index], current);
    current.pop();

    build(index + 1, remaining, current);
  }

  build(0, target, []);
  return out;
}

/** Does ANY subset reach the target (subset-sum decision problem)? */
function hasSubsetWithSum(arr, target) {
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;

  for (const value of arr) {
    for (let s = target; s >= value; s--) dp[s] = dp[s] || dp[s - value];
  }

  return dp[target];
}

// ---- Examples ----
console.log(countSubsets([1, 2, 3, 3], 6));          // 3
console.log(countSubsetsMemo([1, 2, 3, 3], 6));      // 3
console.log(countSubsetsRecursive([1, 2, 3, 3], 6)); // 3
console.log(countSubsets([2, 3, 5, 6, 8, 10], 10));  // 3
console.log(findSubsetsWithSum([1, 2, 3, 3], 6));    // [[1,2,3],[1,2,3],[3,3]]
console.log(hasSubsetWithSum([3, 34, 4, 12, 5, 2], 9)); // true

module.exports = { countSubsets, countSubsetsMemo, countSubsetsRecursive, findSubsetsWithSum, hasSubsetWithSum };
