/**
 * Minimum operations for adjacent e / e+1 pairing.
 *
 * Pair up adjacent elements so that each pair holds values differing by
 * exactly 1 (e and e+1). Each operation increments or decrements one
 * element by 1; the cost of a pair (a, b) is what it takes to turn it into
 * some (e, e+1) or (e+1, e).
 *
 * Greedy over disjoint adjacent pairs, with a DP that lets pairs be skipped.
 *
 * Time  O(n)
 */

/** Cheapest cost to make (a, b) into a valid e / e+1 pair. */
function pairCost(a, b) {
  // Either b = a + 1 (cost |b - a - 1|) or a = b + 1 (cost |a - b - 1|).
  return Math.min(Math.abs(b - a - 1), Math.abs(a - b - 1));
}

/** Pair positions 0-1, 2-3, 4-5, ... and sum the costs. */
function costFixedPairing(arr) {
  let total = 0;

  for (let i = 0; i + 1 < arr.length; i += 2) {
    total += pairCost(arr[i], arr[i + 1]);
  }

  return total;
}

/**
 * DP that may LEAVE an element unpaired: at each index, either skip it or
 * pair it with its neighbour.
 * dp[i] = minimum cost for the first i elements.
 */
function minOperationsPairing(arr) {
  const n = arr.length;
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;
  if (n >= 1) dp[1] = 0; // one element left unpaired costs nothing

  for (let i = 2; i <= n; i++) {
    dp[i] = Math.min(
      dp[i - 1],                                 // leave arr[i-1] unpaired
      dp[i - 2] + pairCost(arr[i - 2], arr[i - 1]) // pair the last two
    );
  }

  return dp[n];
}

/** Which pairs the DP chose. */
function pairingPlan(arr) {
  const n = arr.length;
  const dp = new Array(n + 1).fill(Infinity);
  const choice = new Array(n + 1).fill(null);

  dp[0] = 0;
  if (n >= 1) {
    dp[1] = 0;
    choice[1] = 'skip';
  }

  for (let i = 2; i <= n; i++) {
    const skip = dp[i - 1];
    const pair = dp[i - 2] + pairCost(arr[i - 2], arr[i - 1]);

    if (skip <= pair) {
      dp[i] = skip;
      choice[i] = 'skip';
    } else {
      dp[i] = pair;
      choice[i] = 'pair';
    }
  }

  const pairs = [];
  const skipped = [];

  for (let i = n; i > 0; ) {
    if (choice[i] === 'pair') {
      pairs.unshift([i - 2, i - 1]);
      i -= 2;
    } else {
      skipped.unshift(i - 1);
      i -= 1;
    }
  }

  return { cost: dp[n], pairs, skipped };
}

/** Minimum increments so every adjacent pair differs by at least 1. */
function minIncrementsForUnique(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  let operations = 0;

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] <= sorted[i - 1]) {
      operations += sorted[i - 1] + 1 - sorted[i];
      sorted[i] = sorted[i - 1] + 1;
    }
  }

  return operations;
}

// ---- Examples ----
console.log(pairCost(3, 4));                 // 0 — already e, e+1
console.log(pairCost(3, 3));                 // 1
console.log(costFixedPairing([1, 2, 5, 5])); // 0 + 1 = 1
console.log(minOperationsPairing([1, 2, 5, 5]));
console.log(pairingPlan([4, 4, 7, 9]));
console.log(minIncrementsForUnique([3, 2, 1, 2, 1, 7])); // 6

module.exports = { pairCost, costFixedPairing, minOperationsPairing, pairingPlan, minIncrementsForUnique };
