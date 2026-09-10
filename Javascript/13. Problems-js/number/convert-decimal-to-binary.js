/**
 * Convert a decimal number to binary.
 *
 * Repeated division by 2, collecting remainders from the bottom up.
 * Handles negatives and fractional parts.
 */

/**
 * @param {number} n
 * @returns {string}
 */
function decimalToBinary(n) {
  if (!Number.isFinite(n)) return String(n);

  const negative = n < 0;
  let value = Math.abs(Math.trunc(n));

  if (value === 0) return negative ? '-0' : '0';

  let bits = '';
  while (value > 0) {
    bits = (value % 2) + bits;
    value = Math.floor(value / 2);
  }

  return negative ? `-${bits}` : bits;
}

/** Fractional part too: 5.625 -> '101.101'. */
function decimalToBinaryFraction(n, precision = 20) {
  const whole = decimalToBinary(Math.trunc(n));
  let frac = Math.abs(n) - Math.abs(Math.trunc(n));

  if (frac === 0) return whole;

  let out = '';
  while (frac > 0 && out.length < precision) {
    frac *= 2;
    if (frac >= 1) {
      out += '1';
      frac -= 1;
    } else {
      out += '0';
    }
  }

  return `${whole}.${out}`;
}

/** Built-in, for comparison. */
const decimalToBinaryBuiltIn = (n) => (n >>> 0).toString(2);

// ---- Examples ----
console.log(decimalToBinary(10));           // '1010'
console.log(decimalToBinary(0));            // '0'
console.log(decimalToBinary(-6));           // '-110'
console.log(decimalToBinaryFraction(5.625));// '101.101'
console.log(decimalToBinaryBuiltIn(255));   // '11111111'

module.exports = { decimalToBinary, decimalToBinaryFraction, decimalToBinaryBuiltIn };
