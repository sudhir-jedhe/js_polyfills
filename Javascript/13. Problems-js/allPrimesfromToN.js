/**
 * All primes from 1 to N.
 *
 * Sieve of Eratosthenes.
 * Time  O(n log log n)
 * Space O(n)
 */

/**
 * @param {number} n inclusive upper bound
 * @returns {number[]}
 */
function allPrimesToN(n) {
  if (!Number.isFinite(n) || n < 2) return [];

  const isComposite = new Uint8Array(n + 1);
  const primes = [];

  for (let i = 2; i <= n; i++) {
    if (isComposite[i]) continue;
    primes.push(i);
    // Start at i*i: smaller multiples already marked by smaller primes.
    for (let j = i * i; j <= n; j += i) isComposite[j] = 1;
  }

  return primes;
}

// ---- Examples ----
console.log(allPrimesToN(30)); // [2,3,5,7,11,13,17,19,23,29]
console.log(allPrimesToN(2));  // [2]
console.log(allPrimesToN(1));  // []

module.exports = { allPrimesToN };
