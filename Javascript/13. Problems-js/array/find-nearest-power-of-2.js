/**
 * Find the nearest power of 2 for every array element.
 *
 * For each value, return the power of 2 closest to it. Ties (exactly
 * halfway) go to the larger power, which is the usual convention.
 */

/** Largest power of 2 that is <= n. */
const lowerPowerOfTwo = (n) => (n < 1 ? 0 : 2 ** Math.floor(Math.log2(n)));

/** Smallest power of 2 that is >= n. */
const upperPowerOfTwo = (n) => (n < 1 ? 1 : 2 ** Math.ceil(Math.log2(n)));

/**
 * The nearest one. Compares the distance to each neighbour.
 * @param {number} n
 * @returns {number}
 */
function nearestPowerOfTwo(n) {
  if (n <= 0) return 1;

  const lower = lowerPowerOfTwo(n);
  const upper = lower === n ? n : lower * 2;

  // Ties go up.
  return n - lower < upper - n ? lower : upper;
}

/** Applied across an array. */
const nearestPowersOfTwo = (arr) => arr.map(nearestPowerOfTwo);

/** Is n a power of two? Only one bit is set. */
const isPowerOfTwo = (n) => Number.isInteger(n) && n > 0 && (n & (n - 1)) === 0;

/**
 * Next power of 2 via bit smearing — no floating point, so it is exact for
 * 32-bit values where Math.log2 can round badly.
 */
function nextPowerOfTwoBits(n) {
  if (n <= 1) return 1;

  let v = n - 1;
  v |= v >> 1;
  v |= v >> 2;
  v |= v >> 4;
  v |= v >> 8;
  v |= v >> 16;

  return v + 1;
}

/** Base-2 logarithm as an integer (position of the highest set bit). */
const log2Floor = (n) => 31 - Math.clz32(n);

// ---- Examples ----
console.log(nearestPowerOfTwo(5));        // 4
console.log(nearestPowerOfTwo(6));        // 8  (tie-ish, 6 is closer to 8? |6-4|=2, |8-6|=2 -> up)
console.log(nearestPowerOfTwo(1));        // 1
console.log(nearestPowersOfTwo([3, 5, 9, 17])); // [4, 4, 8, 16]
console.log(lowerPowerOfTwo(100), upperPowerOfTwo(100)); // 64 128
console.log(isPowerOfTwo(64));            // true
console.log(nextPowerOfTwoBits(1000));    // 1024
console.log(log2Floor(1000));             // 9

module.exports = { nearestPowerOfTwo, nearestPowersOfTwo, lowerPowerOfTwo, upperPowerOfTwo, isPowerOfTwo, nextPowerOfTwoBits, log2Floor };
