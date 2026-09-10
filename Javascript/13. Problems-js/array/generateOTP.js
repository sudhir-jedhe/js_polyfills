/**
 * Generate a one-time password (OTP).
 *
 * Math.random is NOT suitable for anything security-sensitive — it is
 * predictable. Use the crypto RNG, and reject-sample so the distribution
 * stays uniform.
 */

/** Uniform random integer in [0, max) using the crypto RNG. */
function secureRandomInt(max) {
  const cryptoObj = globalThis.crypto ?? require('node:crypto').webcrypto;
  const limit = Math.floor(0xffffffff / max) * max;

  const buf = new Uint32Array(1);
  let value;

  do {
    cryptoObj.getRandomValues(buf);
    value = buf[0];
  } while (value >= limit);

  return value % max;
}

/**
 * Numeric OTP of the given length. Leading zeros are preserved, so the
 * result is a string.
 * @param {number} length
 * @returns {string}
 */
function generateOTP(length = 6) {
  let out = '';
  for (let i = 0; i < length; i++) out += secureRandomInt(10);
  return out;
}

/** Alphanumeric OTP, with look-alike characters removed. */
function generateAlphanumericOTP(length = 8) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I, O, 0, 1
  let out = '';
  for (let i = 0; i < length; i++) out += alphabet[secureRandomInt(alphabet.length)];
  return out;
}

/** An OTP bundled with its expiry, which is how it is actually used. */
function createOTP({ length = 6, ttlSeconds = 300 } = {}) {
  const code = generateOTP(length);
  const expiresAt = Date.now() + ttlSeconds * 1000;

  return {
    code,
    expiresAt,
    isValid(input) {
      // Constant-time-ish comparison, so timing does not leak the code.
      if (Date.now() > expiresAt) return false;
      if (input.length !== code.length) return false;

      let diff = 0;
      for (let i = 0; i < code.length; i++) diff |= code.charCodeAt(i) ^ input.charCodeAt(i);
      return diff === 0;
    },
  };
}

/** The insecure version, kept as a counter-example. */
const insecureOTP = (length = 6) =>
  String(Math.floor(Math.random() * 10 ** length)).padStart(length, '0');

// ---- Examples ----
console.log(generateOTP());              // e.g. '048213'
console.log(generateOTP(4));             // e.g. '9021'
console.log(generateAlphanumericOTP());  // e.g. 'K7RM2XQ9'

const otp = createOTP({ ttlSeconds: 60 });
console.log(otp.code, otp.isValid(otp.code), otp.isValid('000000'));
console.log(insecureOTP()); // predictable — do not use for real auth

module.exports = { generateOTP, generateAlphanumericOTP, createOTP, secureRandomInt };
