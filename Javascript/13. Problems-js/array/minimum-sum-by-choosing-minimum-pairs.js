/**
 * Minimum sum by repeatedly choosing the minimum of pairs.
 *
 * Several related greedy problems live under this name:
 *   - sum of min(pair) over an optimal pairing (LeetCode 561, Array Partition)
 *   - minimum sum formed by pairing digits into two numbers
 *   - minimum sum of a chosen pair
 */

/**
 * Array Partition (LeetCode 561): pair the numbers to MAXIMISE the sum of
 * each pair's minimum. Sorting and taking every other element is optimal —
 * pairing neighbours wastes the least.
 */
function maxSumOfPairMins(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  let total = 0;

  for (let i = 0; i < sorted.length; i += 2) total += sorted[i];
  return total;
}

/** The mirror: MINIMISE the sum of each pair's minimum — pair each smallest
 *  value with the largest, so small values are "used up" as the minimum
 *  as few times as... actually pair the smallest ones together. */
function minSumOfPairMins(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  let total = 0;

  // Pair smallest with largest so each small value is the minimum of its pair.
  for (let lo = 0, hi = sorted.length - 1; lo < hi; lo++, hi--) {
    total += sorted[lo];
  }

  return total;
}

/**
 * Minimum sum of two numbers formed from all the digits of an array:
 * sort ascending and deal the digits alternately into two numbers.
 */
function minSumFromDigits(digits) {
  const sorted = [...digits].sort((a, b) => a - b);

  let a = '';
  let b = '';

  sorted.forEach((digit, i) => {
    if (i % 2 === 0) a += digit;
    else b += digit;
  });

  return { a: Number(a || 0), b: Number(b || 0), sum: Number(a || 0) + Number(b || 0) };
}

/** Minimum sum of any single pair. */
function minPairSum(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  return sorted.length >= 2 ? sorted[0] + sorted[1] : null;
}

/**
 * Minimise the MAXIMUM pair sum (LeetCode 1877): pair smallest with
 * largest so the sums even out.
 */
function minimiseMaxPairSum(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  let best = -Infinity;

  for (let lo = 0, hi = sorted.length - 1; lo < hi; lo++, hi--) {
    best = Math.max(best, sorted[lo] + sorted[hi]);
  }

  return best;
}

/** The pairing itself, for the minimise-max-sum strategy. */
function optimalPairs(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const pairs = [];

  for (let lo = 0, hi = sorted.length - 1; lo < hi; lo++, hi--) {
    pairs.push([sorted[lo], sorted[hi]]);
  }

  return pairs;
}

// ---- Examples ----
console.log(maxSumOfPairMins([1, 4, 3, 2]));   // 4  (min(1,2) + min(3,4))
console.log(minSumOfPairMins([1, 4, 3, 2]));   // 3  (1 + 2)
console.log(minSumFromDigits([6, 8, 4, 5, 2, 3])); // { a: 246, b: 358, sum: 604 }
console.log(minPairSum([5, 1, 9, 3]));         // 4
console.log(minimiseMaxPairSum([3, 5, 2, 3])); // 7
console.log(optimalPairs([3, 5, 2, 3]));       // [[2,5],[3,3]]

module.exports = { maxSumOfPairMins, minSumOfPairMins, minSumFromDigits, minPairSum, minimiseMaxPairSum, optimalPairs };
