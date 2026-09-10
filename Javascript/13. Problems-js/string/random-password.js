/**
 * Generate a random password.
 *
 * Guarantees at least one character from each required set, then fills the
 * rest and shuffles, so the required characters are not always at the front.
 * Uses crypto when available — Math.random is not suitable for secrets.
 */

const SETS = {
  lower: 'abcdefghijkmnopqrstuvwxyz',   // no 'l'
  upper: 'ABCDEFGHJKLMNPQRSTUVWXYZ',    // no 'I', 'O'
  digit: '23456789',                    // no '0', '1'
  symbol: '!@#$%^&*()-_=+[]{};:,.?',
};

/** Uniform random integer in [0, max) — rejection-sampled, crypto-backed. */
function randomInt(max) {
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

const pick = (chars) => chars[randomInt(chars.length)];

/** Fisher-Yates shuffle using the same secure RNG. */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * @param {number} length
 * @param {{lower?:boolean, upper?:boolean, digit?:boolean, symbol?:boolean}} [options]
 * @returns {string}
 */
function randomPassword(length = 16, options = {}) {
  const enabled = { lower: true, upper: true, digit: true, symbol: true, ...options };
  const active = Object.keys(SETS).filter((name) => enabled[name]);

  if (active.length === 0) throw new Error('At least one character set is required');
  if (length < active.length) throw new Error(`Length must be at least ${active.length}`);

  // One guaranteed character per active set...
  const chars = active.map((name) => pick(SETS[name]));

  // ...then fill the rest from the combined pool.
  const pool = active.map((name) => SETS[name]).join('');
  while (chars.length < length) chars.push(pick(pool));

  return shuffle(chars).join('');
}

/** Memorable passphrase: several random words joined by a separator. */
function passphrase(wordList, count = 4, separator = '-') {
  return Array.from({ length: count }, () => wordList[randomInt(wordList.length)]).join(separator);
}

/** Rough entropy in bits, to compare options honestly. */
const entropyBits = (length, poolSize) => Math.round(length * Math.log2(poolSize));

// ---- Examples ----
console.log(randomPassword());                       // e.g. 'k7$Rm2Qp!eX4vTz9'
console.log(randomPassword(8, { symbol: false }));   // letters + digits only
console.log(passphrase(['correct', 'horse', 'battery', 'staple', 'orange'], 4));
console.log(entropyBits(16, 70), 'bits');            // ~98 bits

module.exports = { randomPassword, passphrase, entropyBits, SETS };
