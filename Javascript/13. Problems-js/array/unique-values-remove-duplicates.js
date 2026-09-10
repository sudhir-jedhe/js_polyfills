/**
 * Unique values in an array (remove duplicates).
 *
 * A Set covers the common case in one line and preserves first-appearance
 * order. Everything else here is for objects, custom equality and
 * performance corners.
 */

/** The one-liner. */
const unique = (arr) => [...new Set(arr)];

/** Array.from over a Set — identical, and allows a mapper. */
const uniqueFrom = (arr, mapper) => Array.from(new Set(arr), mapper);

/** By a key function, for objects. First occurrence wins. */
function uniqueBy(arr, keyFn) {
  const seen = new Set();

  return arr.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** By a key function, but LAST occurrence wins. */
function uniqueByLast(arr, keyFn) {
  const byKey = new Map();
  for (const item of arr) byKey.set(keyFn(item), item);
  return [...byKey.values()];
}

/** With a custom equality function — O(n^2), so keep the input small. */
const uniqueWith = (arr, isEqual) =>
  arr.filter((item, i) => arr.findIndex((other) => isEqual(item, other)) === i);

/** Deep structural uniqueness. */
function uniqueDeep(arr) {
  const seen = new Map();

  for (const item of arr) {
    const key = JSON.stringify(item);
    if (!seen.has(key)) seen.set(key, item);
  }

  return [...seen.values()];
}

/**
 * NaN and -0: Set uses SameValueZero, so NaN deduplicates correctly and
 * -0 collapses into 0 — which indexOf-based approaches get wrong.
 */
const sameValueZeroDemo = () => ({
  set: [...new Set([NaN, NaN, 0, -0])],
  indexOf: [NaN, NaN, 0, -0].filter((v, i, a) => a.indexOf(v) === i),
});

/** Unique across several arrays. */
const uniqueAcross = (...arrays) => [...new Set(arrays.flat())];

/** Values that appear EXACTLY once (not just deduplicated). */
function onlyOnce(arr) {
  const counts = new Map();
  for (const item of arr) counts.set(item, (counts.get(item) || 0) + 1);
  return arr.filter((item) => counts.get(item) === 1);
}

// ---- Examples ----
console.log(unique([1, 2, 2, 3, 1]));          // [1, 2, 3]
console.log(uniqueFrom(['a', 'a', 'b'], (s) => s.toUpperCase())); // ['A','B']
console.log(uniqueBy([{ id: 1, v: 'a' }, { id: 1, v: 'b' }], (o) => o.id)); // v: 'a'
console.log(uniqueByLast([{ id: 1, v: 'a' }, { id: 1, v: 'b' }], (o) => o.id)); // v: 'b'
console.log(uniqueWith([1.1, 1.2, 2.5], (a, b) => Math.floor(a) === Math.floor(b)));
console.log(uniqueDeep([{ a: 1 }, { a: 1 }, { a: 2 }]).length); // 2
console.log(sameValueZeroDemo());
console.log(uniqueAcross([1, 2], [2, 3]));     // [1, 2, 3]
console.log(onlyOnce([1, 2, 2, 3]));           // [1, 3]

module.exports = { unique, uniqueFrom, uniqueBy, uniqueByLast, uniqueWith, uniqueDeep, uniqueAcross, onlyOnce };
