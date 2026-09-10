/**
 * Least Common Multiple (LCM) and Greatest Common Divisor (GCD).
 *
 * lcm(a, b) = |a * b| / gcd(a, b), and the division is done FIRST to keep
 * the intermediate value small and avoid overflow.
 */

/** Euclid's algorithm, iterative. */
function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    [x, y] = [y, x % y];
  }

  return x;
}

/** Recursive form of the same. */
const gcdRecursive = (a, b) => (b === 0 ? Math.abs(a) : gcdRecursive(b, a % b));

/** LCM of two numbers. Divide before multiplying. */
function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a / gcd(a, b) * b);
}

/** GCD of a whole list. */
const gcdMany = (...nums) => nums.reduce((acc, n) => gcd(acc, n));

/** LCM of a whole list. */
const lcmMany = (...nums) => nums.reduce((acc, n) => lcm(acc, n));

/** BigInt versions, exact for numbers beyond Number.MAX_SAFE_INTEGER. */
function gcdBigInt(a, b) {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;

  while (y !== 0n) [x, y] = [y, x % y];
  return x;
}

const lcmBigInt = (a, b) => (a === 0n || b === 0n ? 0n : (a / gcdBigInt(a, b)) * b);

/**
 * Extended Euclid: returns { gcd, x, y } with a*x + b*y === gcd.
 * Used for modular inverses.
 */
function extendedGcd(a, b) {
  if (b === 0) return { gcd: a, x: 1, y: 0 };

  const { gcd: g, x, y } = extendedGcd(b, a % b);
  return { gcd: g, x: y, y: x - Math.floor(a / b) * y };
}

/** Are two numbers coprime? */
const areCoprime = (a, b) => gcd(a, b) === 1;

/** Reduce a fraction to lowest terms. */
function simplifyFraction(numerator, denominator) {
  const divisor = gcd(numerator, denominator) || 1;
  const sign = denominator < 0 ? -1 : 1;
  return [(sign * numerator) / divisor, (sign * denominator) / divisor];
}

// ---- Examples ----
console.log(gcd(12, 18));            // 6
console.log(lcm(4, 6));              // 12
console.log(lcm(21, 6));             // 42
console.log(gcdMany(12, 18, 24));    // 6
console.log(lcmMany(2, 3, 4));       // 12
console.log(lcmBigInt(123456789012345678n, 987654321098765432n).toString());
console.log(extendedGcd(30, 12));    // { gcd: 6, x: 1, y: -2 }
console.log(areCoprime(9, 28));      // true
console.log(simplifyFraction(6, -8));// [-3, 4]

module.exports = { gcd, gcdRecursive, lcm, gcdMany, lcmMany, gcdBigInt, lcmBigInt, extendedGcd, areCoprime, simplifyFraction };
