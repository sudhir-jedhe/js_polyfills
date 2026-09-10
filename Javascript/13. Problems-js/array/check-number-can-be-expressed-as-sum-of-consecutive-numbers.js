/**
 * Can a number be expressed as the sum of two or more consecutive positive
 * integers?
 *
 * The elegant result: exactly the powers of 2 CANNOT. Everything else can.
 * (A sum of k consecutive integers starting at a is k*a + k(k-1)/2; solving
 * for a shows a solution exists unless n is a power of two.)
 */

/** O(1) test using the powers-of-two result. */
const canBeSumOfConsecutive = (n) => n > 2 && (n & (n - 1)) !== 0;

/**
 * Constructive version: return one such run, or null.
 * Sliding window over 1..ceil(n/2).
 * Time  O(sqrt(n)) via the closed form below, O(n) here
 */
function findConsecutiveRun(n) {
  let start = 1;
  let sum = 1;

  for (let end = 2; start < end; end++) {
    sum += end;

    while (sum > n && start < end) sum -= start++;

    if (sum === n && end - start >= 1) {
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
  }

  return null;
}

/**
 * All the ways to write n as a sum of consecutive positive integers.
 * For a run of k terms starting at a: n = k*a + k(k-1)/2, so
 * a = (n - k(k-1)/2) / k must be a positive integer.
 * Time O(sqrt(n))
 */
function allConsecutiveRuns(n) {
  const out = [];

  for (let k = 2; (k * (k + 1)) / 2 <= n; k++) {
    const numerator = n - (k * (k - 1)) / 2;
    if (numerator > 0 && numerator % k === 0) {
      const start = numerator / k;
      out.push(Array.from({ length: k }, (_, i) => start + i));
    }
  }

  return out;
}

/** How many such representations exist (odd divisors of n, minus one). */
function countConsecutiveRuns(n) {
  let count = 0;

  for (let d = 1; d * d <= n; d++) {
    if (n % d !== 0) continue;
    if (d % 2 === 1) count++;
    const other = n / d;
    if (other !== d && other % 2 === 1) count++;
  }

  return count - 1; // exclude the trivial single-term run
}

// ---- Examples ----
console.log(canBeSumOfConsecutive(15)); // true  (1+2+3+4+5)
console.log(canBeSumOfConsecutive(16)); // false (a power of 2)
console.log(canBeSumOfConsecutive(9));  // true  (4+5)
console.log(findConsecutiveRun(15));    // [1,2,3,4,5]
console.log(allConsecutiveRuns(15));    // [[7,8],[4,5,6],[1,2,3,4,5]]
console.log(countConsecutiveRuns(15));  // 3

module.exports = { canBeSumOfConsecutive, findConsecutiveRun, allConsecutiveRuns, countConsecutiveRuns };
