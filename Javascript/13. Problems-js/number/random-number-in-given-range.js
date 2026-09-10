/**
 * Random number in a given range.
 *
 * Math.random() returns [0, 1). Scaling gives [min, max) for floats;
 * integers need care so both endpoints stay equally likely.
 */

/** Float in [min, max). */
const randomFloat = (min, max) => Math.random() * (max - min) + min;

/** Integer in [min, max] — both ends inclusive, uniform. */
function randomInt(min, max) {
  const lo = Math.ceil(min);
  const hi = Math.floor(max);
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

/** Integer in [min, max) — upper bound exclusive. */
function randomIntExclusive(min, max) {
  const lo = Math.ceil(min);
  const hi = Math.floor(max);
  return Math.floor(Math.random() * (hi - lo)) + lo;
}

/**
 * Cryptographically secure integer in [min, max], rejection-sampled so the
 * distribution stays uniform. Needs Web Crypto / node:crypto.
 */
function secureRandomInt(min, max) {
  const range = max - min + 1;
  const bytes = Math.ceil(Math.log2(range) / 8) || 1;
  const maxValid = Math.floor(256 ** bytes / range) * range;

  const buf = new Uint8Array(bytes);
  const cryptoObj = globalThis.crypto || require('node:crypto').webcrypto;

  let value;
  do {
    cryptoObj.getRandomValues(buf);
    value = buf.reduce((acc, b) => acc * 256 + b, 0);
  } while (value >= maxValid);

  return min + (value % range);
}

/** Pick a random element from an array. */
const randomItem = (arr) => arr[randomInt(0, arr.length - 1)];

// ---- Examples ----
console.log(randomFloat(1, 5));       // e.g. 3.7241
console.log(randomInt(1, 6));         // e.g. 4  (dice roll)
console.log(randomIntExclusive(0, 3));// 0, 1 or 2
console.log(secureRandomInt(1, 100)); // e.g. 63
console.log(randomItem(['a', 'b', 'c']));

module.exports = { randomFloat, randomInt, randomIntExclusive, secureRandomInt, randomItem };
