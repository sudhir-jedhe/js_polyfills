/**
 * Split an array into chunks.
 *
 * Fixed size, fixed count, by predicate, and lazily.
 */

/** Chunks of at most `size`; the last one may be shorter. */
function chunk(arr, size) {
  if (size <= 0) throw new RangeError('size must be positive');

  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

/** Loop version — the same result, sometimes easier to read. */
function chunkLoop(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/** Exactly `count` chunks, as evenly sized as possible. */
function chunkInto(arr, count) {
  const out = [];
  const base = Math.floor(arr.length / count);
  let extra = arr.length % count;
  let index = 0;

  for (let i = 0; i < count; i++) {
    const size = base + (extra-- > 0 ? 1 : 0);
    out.push(arr.slice(index, index + size));
    index += size;
  }

  return out;
}

/** Start a new chunk whenever the predicate returns true. */
function chunkBy(arr, shouldSplit) {
  const out = [];
  let current = [];

  for (let i = 0; i < arr.length; i++) {
    if (i > 0 && shouldSplit(arr[i], arr[i - 1], i)) {
      out.push(current);
      current = [];
    }
    current.push(arr[i]);
  }

  if (current.length) out.push(current);
  return out;
}

/** Group consecutive EQUAL values into runs. */
const chunkRuns = (arr) => chunkBy(arr, (current, previous) => current !== previous);

/** Lazy generator — never materialises the whole result. */
function* chunkLazy(iterable, size) {
  let current = [];

  for (const item of iterable) {
    current.push(item);
    if (current.length === size) {
      yield current;
      current = [];
    }
  }

  if (current.length) yield current;
}

/** Sliding windows of size k, overlapping by k - 1. */
const windows = (arr, size) =>
  Array.from({ length: Math.max(0, arr.length - size + 1) }, (_, i) => arr.slice(i, i + size));

/** Split a string into chunks. */
const chunkString = (str, size) => String(str).match(new RegExp(`.{1,${size}}`, 'g')) || [];

// ---- Examples ----
console.log(chunk([1, 2, 3, 4, 5], 2));       // [[1,2],[3,4],[5]]
console.log(chunkLoop([1, 2, 3], 5));         // [[1,2,3]]
console.log(chunkInto([1, 2, 3, 4, 5], 3));   // [[1,2],[3,4],[5]]
console.log(chunkBy([1, 2, 10, 11], (a, b) => a - b > 5)); // [[1,2],[10,11]]
console.log(chunkRuns([1, 1, 2, 2, 2, 3]));   // [[1,1],[2,2,2],[3]]
console.log([...chunkLazy([1, 2, 3, 4, 5], 2)]);
console.log(windows([1, 2, 3, 4], 2));        // [[1,2],[2,3],[3,4]]
console.log(chunkString('abcdefg', 3));       // ['abc','def','g']

module.exports = { chunk, chunkLoop, chunkInto, chunkBy, chunkRuns, chunkLazy, windows, chunkString };
