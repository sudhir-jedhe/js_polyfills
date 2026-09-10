/**
 * Binary representation of the next number.
 *
 * Given a binary string, return the binary representation of value + 1
 * without converting to a Number (so it works for arbitrarily long inputs).
 *
 * Trick: scan from the right flipping 1s to 0 until the first 0, flip it to
 * 1. If every digit was 1, prepend a new leading 1.
 */

/**
 * @param {string} bin
 * @returns {string}
 */
function nextBinary(bin) {
  const digits = String(bin).split('');

  let i = digits.length - 1;
  while (i >= 0 && digits[i] === '1') {
    digits[i] = '0';
    i--;
  }

  if (i < 0) return `1${digits.join('')}`;

  digits[i] = '1';
  return digits.join('');
}

/** Same result via BigInt. */
const nextBinaryBigInt = (bin) => (BigInt(`0b${bin}`) + 1n).toString(2);

// ---- Examples ----
console.log(nextBinary('10010'));  // '10011'
console.log(nextBinary('111'));    // '1000'
console.log(nextBinary('0'));      // '1'
console.log(nextBinaryBigInt('1011')); // '1100'

module.exports = { nextBinary, nextBinaryBigInt };
