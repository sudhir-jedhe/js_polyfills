/**
 * Bifurcate an array — split it into two groups.
 *
 * bifurcate takes a parallel array of booleans; bifurcateBy takes a
 * predicate. Both return [truthyGroup, falsyGroup].
 */

/**
 * Split according to a parallel array of filter values.
 * @param {Array} arr
 * @param {boolean[]} filter
 * @returns {[Array, Array]}
 */
const bifurcate = (arr, filter) =>
  arr.reduce(
    (acc, item, i) => {
      acc[filter[i] ? 0 : 1].push(item);
      return acc;
    },
    [[], []]
  );

/**
 * Split according to a predicate.
 * @param {Array} arr
 * @param {(item:*, index:number) => boolean} predicate
 * @returns {[Array, Array]}
 */
const bifurcateBy = (arr, predicate) =>
  arr.reduce(
    (acc, item, i) => {
      acc[predicate(item, i) ? 0 : 1].push(item);
      return acc;
    },
    [[], []]
  );

/** Split into n groups by a key function. */
function partitionBy(arr, keyFn) {
  const groups = new Map();

  for (const item of arr) {
    const key = keyFn(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }

  return groups;
}

/** Split at an index: [before, from]. */
const splitAt = (arr, index) => [arr.slice(0, index), arr.slice(index)];

/** Split into chunks of a fixed size. */
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

/** Split into n roughly equal parts. */
function splitIntoParts(arr, parts) {
  const out = [];
  const base = Math.floor(arr.length / parts);
  let extra = arr.length % parts;
  let index = 0;

  for (let i = 0; i < parts; i++) {
    const size = base + (extra-- > 0 ? 1 : 0);
    out.push(arr.slice(index, index + size));
    index += size;
  }

  return out;
}

// ---- Examples ----
console.log(bifurcate(['beep', 'boop', 'foo', 'bar'], [true, true, false, true]));
// [['beep', 'boop', 'bar'], ['foo']]

console.log(bifurcateBy([1, 2, 3, 4, 5], (n) => n % 2 === 0));
// [[2, 4], [1, 3, 5]]

console.log(partitionBy(['ant', 'bee', 'ape'], (w) => w[0])); // Map { a: [...], b: [...] }
console.log(splitAt([1, 2, 3, 4], 2));          // [[1,2], [3,4]]
console.log(chunk([1, 2, 3, 4, 5], 2));         // [[1,2],[3,4],[5]]
console.log(splitIntoParts([1, 2, 3, 4, 5], 3));// [[1,2],[3,4],[5]]

module.exports = { bifurcate, bifurcateBy, partitionBy, splitAt, chunk, splitIntoParts };
