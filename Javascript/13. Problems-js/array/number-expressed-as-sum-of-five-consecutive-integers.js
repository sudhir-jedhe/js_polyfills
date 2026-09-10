/**
 * Check whether a number can be expressed as the sum of five consecutive
 * integers.
 *
 * (n-2) + (n-1) + n + (n+1) + (n+2) = 5n, so a number is such a sum exactly
 * when it is divisible by 5 — and the middle term is value / 5.
 *
 * Time  O(1)
 */

/** Divisible by 5 means yes; the middle number is value / 5. */
function asFiveConsecutive(value) {
  if (value % 5 !== 0) return null;

  const middle = value / 5;
  return [middle - 2, middle - 1, middle, middle + 1, middle + 2];
}

/** Boolean form. */
const isSumOfFiveConsecutive = (value) => value % 5 === 0;

/**
 * The general k-term version. The sum of k consecutive integers starting
 * at a is k*a + k(k-1)/2, so a = (value - k(k-1)/2) / k must be an integer.
 */
function asKConsecutive(value, k) {
  const numerator = value - (k * (k - 1)) / 2;
  if (numerator % k !== 0) return null;

  const start = numerator / k;
  return Array.from({ length: k }, (_, i) => start + i);
}

/** Restricted to POSITIVE integers, which is the usual puzzle. */
function asKConsecutivePositive(value, k) {
  const run = asKConsecutive(value, k);
  return run && run[0] > 0 ? run : null;
}

/** Every way to write the value as consecutive POSITIVE integers. */
function allConsecutiveRuns(value) {
  const out = [];

  for (let k = 2; (k * (k + 1)) / 2 <= value; k++) {
    const run = asKConsecutivePositive(value, k);
    if (run) out.push(run);
  }

  return out;
}

/** Sum of an arithmetic run, for verification. */
const sum = (arr) => arr.reduce((a, b) => a + b, 0);

// ---- Examples ----
console.log(asFiveConsecutive(25));       // [3, 4, 5, 6, 7]
console.log(asFiveConsecutive(15));       // [1, 2, 3, 4, 5]
console.log(asFiveConsecutive(23));       // null
console.log(isSumOfFiveConsecutive(100)); // true
console.log(asKConsecutive(15, 3));       // [4, 5, 6]
console.log(allConsecutiveRuns(15));      // [[7,8],[4,5,6],[1,2,3,4,5]]
console.log(sum(asFiveConsecutive(25)));  // 25

module.exports = { asFiveConsecutive, isSumOfFiveConsecutive, asKConsecutive, asKConsecutivePositive, allConsecutiveRuns };
