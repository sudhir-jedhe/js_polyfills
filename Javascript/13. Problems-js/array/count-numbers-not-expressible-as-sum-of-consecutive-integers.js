/**
 * Count numbers up to N that CANNOT be expressed as the sum of at least two
 * consecutive positive integers.
 *
 * Those numbers are exactly the powers of 2 (1, 2, 4, 8, 16, ...), so the
 * answer is floor(log2(N)) + 1.
 *
 * Time  O(log n)
 * Space O(1)
 */

/**
 * @param {number} n
 * @returns {number}
 */
function countNotExpressible(n) {
  if (n < 1) return 0;

  let count = 0;
  for (let power = 1; power <= n; power *= 2) count++;
  return count;
}

/** Closed form using logarithms. */
const countNotExpressibleLog = (n) => (n < 1 ? 0 : Math.floor(Math.log2(n)) + 1);

/** The numbers themselves. */
function listNotExpressible(n) {
  const out = [];
  for (let power = 1; power <= n; power *= 2) out.push(power);
  return out;
}

/** Is n a power of two? The bit trick: only one bit is set. */
const isPowerOfTwo = (n) => n > 0 && (n & (n - 1)) === 0;

/**
 * Brute-force check, useful for verifying the closed form:
 * n is expressible iff it has an odd divisor greater than 1.
 */
function isExpressibleBrute(n) {
  for (let k = 2; (k * (k + 1)) / 2 <= n; k++) {
    const numerator = n - (k * (k - 1)) / 2;
    if (numerator > 0 && numerator % k === 0) return true;
  }
  return false;
}

// ---- Examples ----
console.log(countNotExpressible(10));     // 4  -> 1, 2, 4, 8
console.log(countNotExpressible(100));    // 7  -> 1..64
console.log(countNotExpressibleLog(100)); // 7
console.log(listNotExpressible(20));      // [1, 2, 4, 8, 16]
console.log(isPowerOfTwo(64));            // true

// Cross-check the theory against brute force.
const mismatches = Array.from({ length: 200 }, (_, i) => i + 1)
  .filter((n) => isExpressibleBrute(n) === isPowerOfTwo(n));
console.log('mismatches:', mismatches.length); // 0

module.exports = { countNotExpressible, countNotExpressibleLog, listNotExpressible, isPowerOfTwo, isExpressibleBrute };
