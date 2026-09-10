/**
 * Prime numbers.
 *
 * Primality testing, generation, factorisation and the related counting
 * problems — the toolkit that most prime questions reduce to.
 */

/** Trial division with the 6k +/- 1 optimisation. O(sqrt(n)). */
function isPrime(n) {
  if (!Number.isInteger(n) || n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;

  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }

  return true;
}

/** Sieve of Eratosthenes — all primes up to n. */
function sieve(n) {
  if (n < 2) return [];

  const composite = new Uint8Array(n + 1);
  const primes = [];

  for (let i = 2; i <= n; i++) {
    if (composite[i]) continue;
    primes.push(i);
    for (let j = i * i; j <= n; j += i) composite[j] = 1;
  }

  return primes;
}

/** Count of primes below n (LeetCode 204). */
function countPrimes(n) {
  if (n < 3) return 0;

  const composite = new Uint8Array(n);
  let count = 0;

  for (let i = 2; i < n; i++) {
    if (composite[i]) continue;
    count++;
    for (let j = i * i; j < n; j += i) composite[j] = 1;
  }

  return count;
}

/** Prime factorisation as { prime: exponent }. */
function primeFactorisation(n) {
  const factors = new Map();
  let value = Math.abs(n);

  for (let p = 2; p * p <= value; p++) {
    while (value % p === 0) {
      factors.set(p, (factors.get(p) || 0) + 1);
      value /= p;
    }
  }

  if (value > 1) factors.set(value, (factors.get(value) || 0) + 1);
  return Object.fromEntries(factors);
}

/** The nth prime (1-indexed). */
function nthPrime(n) {
  if (n < 1) return null;

  // Upper bound from the prime number theorem, with slack for small n.
  const limit = n < 6 ? 15 : Math.ceil(n * (Math.log(n) + Math.log(Math.log(n))));
  return sieve(limit)[n - 1];
}

/** Twin primes (p, p + 2) up to n. */
function twinPrimes(n) {
  const primes = sieve(n);
  const set = new Set(primes);
  return primes.filter((p) => set.has(p + 2)).map((p) => [p, p + 2]);
}

/** Are two numbers coprime? */
function areCoprime(a, b) {
  const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
  return gcd(Math.abs(a), Math.abs(b)) === 1;
}

/** Euler's totient: how many integers below n are coprime to it. */
function totient(n) {
  let result = n;

  for (const prime of Object.keys(primeFactorisation(n)).map(Number)) {
    result = (result / prime) * (prime - 1);
  }

  return Math.round(result);
}

// ---- Examples ----
console.log(isPrime(97));            // true
console.log(sieve(30));              // [2,3,5,7,11,13,17,19,23,29]
console.log(countPrimes(100));       // 25
console.log(primeFactorisation(360));// { '2': 3, '3': 2, '5': 1 }
console.log(nthPrime(10));           // 29
console.log(twinPrimes(50));         // [[3,5],[5,7],[11,13],[17,19],[29,31],[41,43]]
console.log(areCoprime(9, 28));      // true
console.log(totient(36));            // 12

module.exports = { isPrime, sieve, countPrimes, primeFactorisation, nthPrime, twinPrimes, areCoprime, totient };
