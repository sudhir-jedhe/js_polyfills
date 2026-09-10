/**
 * Generate a random N-digit number.
 *
 * "N digits" means the first digit is never 0, so the value lies in
 * [10^(n-1), 10^n - 1].
 */

/**
 * @param {number} n number of digits
 * @returns {number}
 */
function generateNDigitNumber(n) {
  if (!Number.isInteger(n) || n < 1) throw new RangeError('n must be a positive integer');
  if (n > 15) throw new RangeError('Use generateNDigitString for n > 15 (precision limit)');

  const min = 10 ** (n - 1);
  const max = 10 ** n - 1;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** String form — no precision ceiling, good for OTPs and IDs. */
function generateNDigitString(n) {
  let out = String(Math.floor(Math.random() * 9) + 1); // first digit 1-9
  while (out.length < n) out += Math.floor(Math.random() * 10);
  return out;
}

/** Zero-padded code, where a leading 0 IS allowed (typical OTP). */
function generateCode(n) {
  return String(Math.floor(Math.random() * 10 ** n)).padStart(n, '0');
}

// ---- Examples ----
console.log(generateNDigitNumber(4));  // e.g. 8371
console.log(generateNDigitString(12)); // e.g. '904812736450'
console.log(generateCode(6));          // e.g. '004219'

module.exports = { generateNDigitNumber, generateNDigitString, generateCode };
