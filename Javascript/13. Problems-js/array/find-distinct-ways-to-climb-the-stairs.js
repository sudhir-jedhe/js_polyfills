/**
 * Climbing stairs (LeetCode 70) and its variants.
 *
 * With steps of 1 or 2 the answer is the Fibonacci sequence:
 * ways(n) = ways(n-1) + ways(n-2).
 *
 * Time  O(n)
 * Space O(1)
 */

/** Steps of 1 or 2. Iterative, constant space. */
function climbStairs(n) {
  if (n <= 2) return Math.max(n, 1);

  let prev = 1; // ways(1)
  let current = 2; // ways(2)

  for (let i = 3; i <= n; i++) {
    [prev, current] = [current, prev + current];
  }

  return current;
}

/** Memoised recursion — the same recurrence, top down. */
function climbStairsMemo(n, memo = new Map()) {
  if (n <= 2) return Math.max(n, 1);
  if (memo.has(n)) return memo.get(n);

  const ways = climbStairsMemo(n - 1, memo) + climbStairsMemo(n - 2, memo);
  memo.set(n, ways);
  return ways;
}

/** Arbitrary allowed step sizes: climbStairsSteps(4, [1, 2, 3]). */
function climbStairsSteps(n, steps = [1, 2]) {
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;

  for (let i = 1; i <= n; i++) {
    for (const step of steps) {
      if (i >= step) dp[i] += dp[i - step];
    }
  }

  return dp[n];
}

/** Minimum cost to reach the top, paying to leave each step (LeetCode 746). */
function minCostClimbingStairs(cost) {
  let a = 0;
  let b = 0;

  for (let i = 2; i <= cost.length; i++) {
    [a, b] = [b, Math.min(b + cost[i - 1], a + cost[i - 2])];
  }

  return b;
}

/** List the actual step sequences — exponential, so keep n small. */
function listClimbSequences(n, steps = [1, 2]) {
  const out = [];

  function walk(remaining, path) {
    if (remaining === 0) {
      out.push([...path]);
      return;
    }
    for (const step of steps) {
      if (step <= remaining) {
        path.push(step);
        walk(remaining - step, path);
        path.pop();
      }
    }
  }

  walk(n, []);
  return out;
}

// ---- Examples ----
console.log(climbStairs(2));                  // 2
console.log(climbStairs(5));                  // 8
console.log(climbStairsMemo(10));             // 89
console.log(climbStairsSteps(4, [1, 2, 3]));  // 7
console.log(minCostClimbingStairs([10, 15, 20])); // 15
console.log(listClimbSequences(4));           // 5 sequences

module.exports = { climbStairs, climbStairsMemo, climbStairsSteps, minCostClimbingStairs, listClimbSequences };
