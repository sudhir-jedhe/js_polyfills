/**
 * Convert a floating point decimal number to octal.
 *
 * Integer part: repeated division by 8.
 * Fraction part: repeated multiplication by 8, taking the integer digit.
 */

/**
 * @param {number} n
 * @param {number} [precision=8] fraction digits to emit
 * @returns {string}
 */
function decimalToOctal(n, precision = 8) {
  if (!Number.isFinite(n)) return String(n);

  const negative = n < 0;
  const abs = Math.abs(n);

  // Integer part
  let whole = Math.trunc(abs);
  let intPart = '';
  if (whole === 0) {
    intPart = '0';
  } else {
    while (whole > 0) {
      intPart = (whole % 8) + intPart;
      whole = Math.floor(whole / 8);
    }
  }

  // Fraction part
  let frac = abs - Math.trunc(abs);
  let fracPart = '';
  while (frac > 0 && fracPart.length < precision) {
    frac *= 8;
    const digit = Math.floor(frac);
    fracPart += digit;
    frac -= digit;
  }

  const out = fracPart ? `${intPart}.${fracPart}` : intPart;
  return negative ? `-${out}` : out;
}

/** Built-in for the integer case. */
const toOctalBuiltIn = (n) => Math.trunc(n).toString(8);

// ---- Examples ----
console.log(decimalToOctal(8));        // '10'
console.log(decimalToOctal(64.5));     // '100.4'
console.log(decimalToOctal(10.25));    // '12.2'
console.log(decimalToOctal(-9.75));    // '-11.6'
console.log(toOctalBuiltIn(255));      // '377'

module.exports = { decimalToOctal, toOctalBuiltIn };
