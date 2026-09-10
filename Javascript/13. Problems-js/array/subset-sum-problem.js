/**
 * Subset Sum Problem (where the array sum is at most N).
 *
 * Decide whether some subset sums to a target, and find which subset. When
 * the total is bounded by N, the pseudo-polynomial DP is O(n * N), which is
 * the whole reason this constraint is stated.
 *
 * Time  O(n * target)
 * Space O(target)
 */

/** Can any subset reach the target? */
function hasSubsetWithSum(arr, target) {
  if (target < 0) return false;

  const dp = new Array(target + 1).fill(false);
  dp[0] = true;

  for (const value of arr) {
    // Downwards, so each element is used at most once.
    for (let s = target; s >= value; s--) {
      if (dp[s - value]) dp[s] = true;
    }
  }

  return dp[target];
}

/** The subset itself, or null. */
function findSubsetWithSum(arr, target) {
  const n = arr.length;

  // reachable[i][s] = can the first i elements sum to s?
  const reachable = Array.from({ length: n + 1 }, () => new Array(target + 1).fill(false));
  for (let i = 0; i <= n; i++) reachable[i][0] = true;

  for (let i = 1; i <= n; i++) {
    for (let s = 0; s <= target; s++) {
      reachable[i][s] =
        reachable[i - 1][s] || (arr[i - 1] <= s && reachable[i - 1][s - arr[i - 1]]);
    }
  }

  if (!reachable[n][target]) return null;

  const subset = [];
  let s = target;

  for (let i = n; i > 0; i--) {
    // If the answer did not come from excluding arr[i-1], it was included.
    if (!reachable[i - 1][s]) {
      subset.unshift(arr[i - 1]);
      s -= arr[i - 1];
    }
  }

  return subset;
}

/** Every subset summing to the target. */
function allSubsetsWithSum(arr, target) {
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

/** Bitset version — one BigInt as a 1-bit-per-sum reachability set. */
function hasSubsetWithSumBitset(arr, target) {
  let reachable = 1n; // bit 0 set: sum 0 is reachable

  for (const value of arr) {
    reachable |= reachable << BigInt(value);
  }

  return ((reachable >> BigInt(target)) & 1n) === 1n;
}

/** All reachable sums. */
function reachableSums(arr) {
  const total = arr.reduce((a, b) => a + b, 0);
  const dp = new Array(total + 1).fill(false);
  dp[0] = true;

  for (const value of arr) {
    for (let s = total; s >= value; s--) {
      if (dp[s - value]) dp[s] = true;
    }
  }

  return dp.map((ok, s) => (ok ? s : -1)).filter((s) => s !== -1);
}

/** The reachable sum CLOSEST to the target. */
function closestReachableSum(arr, target) {
  const sums = reachableSums(arr);
  return sums.reduce((best, s) => (Math.abs(s - target) < Math.abs(best - target) ? s : best), sums[0]);
}

// ---- Examples ----
console.log(hasSubsetWithSum([3, 34, 4, 12, 5, 2], 9));  // true
console.log(hasSubsetWithSum([3, 34, 4, 12, 5, 2], 30)); // false
console.log(findSubsetWithSum([3, 34, 4, 12, 5, 2], 9)); // [4, 5]
console.log(allSubsetsWithSum([1, 2, 3, 3], 6));
console.log(hasSubsetWithSumBitset([3, 34, 4, 12, 5, 2], 9)); // true
console.log(reachableSums([1, 2, 4]));                   // [0..7]
console.log(closestReachableSum([3, 34, 4, 12, 5, 2], 30)); // 29 or 31

module.exports = { hasSubsetWithSum, findSubsetWithSum, allSubsetsWithSum, hasSubsetWithSumBitset, reachableSums, closestReachableSum };
