/**
 * Random helpers.
 *
 * Small utilities built on Math.random(): booleans, picks, shuffles, ids
 * and weighted choice.
 */

/** true with probability `p`. */
const randomBool = (p = 0.5) => Math.random() < p;

/** Random integer in [min, max] inclusive. */
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/** One random element. */
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

/** `n` distinct random elements. */
function sampleSize(arr, n) {
  return shuffle(arr).slice(0, n);
}

/**
 * Fisher-Yates shuffle — uniform over all permutations.
 * Returns a new array; the input is untouched.
 */
function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Weighted pick: weightedSample(['a','b'], [3, 1]) picks 'a' 75% of the time.
 */
function weightedSample(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;

  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r < 0) return items[i];
  }

  return items[items.length - 1];
}

/** Short random id, base36. */
const randomId = (length = 8) =>
  Array.from({ length }, () => Math.random().toString(36)[2]).join('');

/**
 * Seeded PRNG (mulberry32) — reproducible randomness for tests.
 * @param {number} seed
 * @returns {() => number} a Math.random-compatible function
 */
function seededRandom(seed) {
  let a = seed >>> 0;
  return function () {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- Examples ----
console.log(randomBool(0.9));
console.log(randomInt(1, 10));
console.log(sample(['red', 'green', 'blue']));
console.log(shuffle([1, 2, 3, 4, 5]));
console.log(sampleSize([1, 2, 3, 4, 5], 2));
console.log(weightedSample(['common', 'rare'], [9, 1]));
console.log(randomId());

const rng = seededRandom(42);
console.log(rng(), rng()); // same two numbers on every run

module.exports = {
  randomBool,
  randomInt,
  sample,
  sampleSize,
  shuffle,
  weightedSample,
  randomId,
  seededRandom,
};
