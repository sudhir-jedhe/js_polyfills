/**
 * Check whether a number is prime.
 *
 * Trial division only needs divisors up to sqrt(n), and after checking 2
 * and 3 you can step through 6k +/- 1, skipping two thirds of the candidates.
 *
 * Time  O(sqrt(n))
 */

/**
 * @param {number} n
 * @returns {boolean}
 */
function isPrime(n) {
  if (!Number.isInteger(n) || n < 2) return false;
  if (n < 4) return true;          // 2 and 3
  if (n % 2 === 0 || n % 3 === 0) return false;

  // Every prime above 3 is of the form 6k - 1 or 6k + 1.
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }

  return true;
}

/** The naive version, for comparison. */
function isPrimeNaive(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

/** All primes up to n — Sieve of Eratosthenes, O(n log log n). */
function primesUpTo(n) {
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

/** Prime factorisation, with multiplicities. */
function primeFactors(n) {
  const factors = [];
  let value = Math.abs(n);

  for (let p = 2; p * p <= value; p++) {
    while (value % p === 0) {
      factors.push(p);
      value /= p;
    }
  }

  if (value > 1) factors.push(value);
  return factors;
}

/** The next prime at or after n. */
function nextPrime(n) {
  let candidate = Math.max(2, Math.ceil(n));
  while (!isPrime(candidate)) candidate++;
  return candidate;
}

/** Miller-Rabin — deterministic for values below 3.3e14 with these bases. */
function isPrimeMillerRabin(n) {
  if (n < 2) return false;
  for (const p of [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]) {
    if (n === p) return true;
    if (n % p === 0) return false;
  }

  let d = BigInt(n) - 1n;
  let r = 0n;
  while (d % 2n === 0n) {
    d /= 2n;
    r++;
  }

  const modPow = (base, exp, mod) => {
    let result = 1n;
    let b = base % mod;
    let e = exp;
    while (e > 0n) {
      if (e & 1n) result = (result * b) % mod;
      b = (b * b) % mod;
      e >>= 1n;
    }
    return result;
  };

  const bn = BigInt(n);

  for (const a of [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n]) {
    let x = modPow(a, d, bn);
    if (x === 1n || x === bn - 1n) continue;

    let composite = true;
    for (let i = 1n; i < r; i++) {
      x = (x * x) % bn;
      if (x === bn - 1n) {
        composite = false;
        break;
      }
    }

    if (composite) return false;
  }

  return true;
}

// ---- Examples ----
console.log(isPrime(2), isPrime(17), isPrime(1), isPrime(91)); // true true false false
console.log(primesUpTo(30));            // [2,3,5,7,11,13,17,19,23,29]
console.log(primeFactors(360));         // [2,2,2,3,3,5]
console.log(nextPrime(100));            // 101
console.log(isPrimeMillerRabin(1000003));// true

module.exports = { isPrime, isPrimeNaive, primesUpTo, primeFactors, nextPrime, isPrimeMillerRabin };
