/**
 * Convert a negative number to positive.
 *
 * Several approaches, all returning the absolute value.
 */

/** Clearest: built-in. */
const toPositive = (n) => Math.abs(n);

/** Conditional negation. */
const toPositiveTernary = (n) => (n < 0 ? -n : n);

/**
 * Bitwise trick (32-bit integers only).
 * (n ^ mask) - mask where mask is n's sign bit sign-extended.
 */
function toPositiveBitwise(n) {
  const mask = n >> 31;
  return (n ^ mask) - mask;
}

/** Works on a whole array. */
const allToPositive = (arr) => arr.map(Math.abs);

// ---- Examples ----
console.log(toPositive(-42));         // 42
console.log(toPositive(42));          // 42
console.log(toPositiveTernary(-3.5)); // 3.5
console.log(toPositiveBitwise(-7));   // 7
console.log(allToPositive([-1, 2, -3])); // [1, 2, 3]

module.exports = { toPositive, toPositiveTernary, toPositiveBitwise, allToPositive };
