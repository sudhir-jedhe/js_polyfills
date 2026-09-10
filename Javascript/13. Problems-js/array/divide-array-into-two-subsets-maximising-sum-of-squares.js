/**
 * Divide an array into two subsets such that the sum of the squares of the
 * two subset sums is maximum.
 *
 * Total is fixed, so with subset sums S and T = total - S:
 *   S^2 + T^2 = 2S^2 - 2*S*total + total^2
 * That is a parabola in S, maximised at the EXTREMES of the achievable
 * range — so put everything in one subset, or as much as possible.
 *
 * Handled below both as the closed-form answer and as an explicit DP over
 * the reachable subset sums, which is what the problem usually intends when
 * subset sizes are constrained.
 */

/** All subset sums reachable from the array (values up to `total`). */
function reachableSums(arr) {
  const total = arr.reduce((a, b) => a + b, 0);
  const reachable = new Array(total + 1).fill(false);
  reachable[0] = true;

  for (const value of arr) {
    for (let s = total; s >= value; s--) {
      if (reachable[s - value]) reachable[s] = true;
    }
  }

  return reachable;
}

/**
 * Maximise S^2 + (total - S)^2 over the reachable subset sums.
 * @param {number[]} arr
 */
function maxSumOfSquares(arr) {
  const total = arr.reduce((a, b) => a + b, 0);
  const reachable = reachableSums(arr);

  let best = -Infinity;
  let bestSum = 0;

  for (let s = 0; s <= total; s++) {
    if (!reachable[s]) continue;
    const value = s * s + (total - s) ** 2;
    if (value > best) {
      best = value;
      bestSum = s;
    }
  }

  return { subsetSum: bestSum, otherSum: total - bestSum, value: best };
}

/**
 * The MINIMUM of the same expression is reached when the sums are as close
 * as possible — the partition problem.
 */
function minSumOfSquares(arr) {
  const total = arr.reduce((a, b) => a + b, 0);
  const reachable = reachableSums(arr);

  let best = Infinity;
  let bestSum = 0;

  for (let s = 0; s <= Math.floor(total / 2); s++) {
    if (!reachable[s]) continue;
    const value = s * s + (total - s) ** 2;
    if (value < best) {
      best = value;
      bestSum = s;
    }
  }

  return { subsetSum: bestSum, otherSum: total - bestSum, value: best };
}

/** Recover one subset achieving a given sum. */
function findSubsetWithSum(arr, target) {
  const out = [];

  function build(index, remaining) {
    if (remaining === 0) return true;
    if (index >= arr.length || remaining < 0) return false;

    out.push(arr[index]);
    if (build(index + 1, remaining - arr[index])) return true;
    out.pop();

    return build(index + 1, remaining);
  }

  return build(0, target) ? out : null;
}

// ---- Examples ----
console.log(maxSumOfSquares([1, 2, 3, 4]));   // everything on one side
console.log(minSumOfSquares([1, 6, 11, 5]));  // balanced split
console.log(findSubsetWithSum([1, 6, 11, 5], 11)); // [1, 5, ...] or [11]
console.log(reachableSums([1, 2]).map((v, i) => (v ? i : null)).filter((v) => v !== null));
// [0, 1, 2, 3]

module.exports = { maxSumOfSquares, minSumOfSquares, reachableSums, findSubsetWithSum };
