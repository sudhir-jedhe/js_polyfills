/**
 * Check whether the product of every subsequence of an array is a perfect
 * square.
 *
 * Key insight: a product is a perfect square exactly when every prime
 * appears an even number of times. Since the single-element subsequences
 * are themselves subsequences, EVERY element must already be a perfect
 * square. That condition is also sufficient, because a product of perfect
 * squares is a perfect square.
 *
 * Time  O(n)
 */

/** Integer square-root test that avoids floating point surprises. */
function isPerfectSquare(n) {
  if (n < 0 || !Number.isInteger(n)) return false;
  const root = Math.round(Math.sqrt(n));
  return root * root === n;
}

/**
 * @param {number[]} arr
 * @returns {boolean}
 */
const everySubsequenceProductIsSquare = (arr) => arr.every(isPerfectSquare);

/**
 * The related, harder question: is the product of the WHOLE array a perfect
 * square? Track the parity of each prime's exponent with a bitmask-free
 * Set — a prime toggles in and out as it is seen an odd/even number of times.
 */
function productIsPerfectSquare(arr) {
  const oddPrimes = new Set();

  for (const n of arr) {
    if (n === 0) return true; // 0 is a perfect square
    let value = Math.abs(n);

    for (let p = 2; p * p <= value; p++) {
      while (value % p === 0) {
        value /= p;
        if (oddPrimes.has(p)) oddPrimes.delete(p);
        else oddPrimes.add(p);
      }
    }

    if (value > 1) {
      if (oddPrimes.has(value)) oddPrimes.delete(value);
      else oddPrimes.add(value);
    }
  }

  return oddPrimes.size === 0;
}

/** The square-free kernel of n: n divided by its largest square factor. */
function squareFreePart(n) {
  let value = Math.abs(n);
  let result = 1;

  for (let p = 2; p * p <= value; p++) {
    let count = 0;
    while (value % p === 0) {
      value /= p;
      count++;
    }
    if (count % 2 === 1) result *= p;
  }

  return result * (value > 1 ? value : 1);
}

// ---- Examples ----
console.log(everySubsequenceProductIsSquare([1, 4, 100])); // true
console.log(everySubsequenceProductIsSquare([1, 4, 5]));   // false
console.log(isPerfectSquare(144));      // true
console.log(isPerfectSquare(145));      // false
console.log(productIsPerfectSquare([2, 8]));    // true  (16)
console.log(productIsPerfectSquare([2, 3]));    // false
console.log(squareFreePart(72));        // 2   (72 = 36 * 2)

module.exports = { everySubsequenceProductIsSquare, isPerfectSquare, productIsPerfectSquare, squareFreePart };
