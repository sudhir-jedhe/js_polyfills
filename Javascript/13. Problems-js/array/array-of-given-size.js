/**
 * Create an array of a given size.
 *
 * `new Array(n)` gives you HOLES, not values — map and forEach skip them.
 * Array.from and fill produce real elements.
 */

/** Filled with a single value. */
const arrayOf = (size, value) => new Array(size).fill(value);

/**
 * Generated from the index. This is the one to reach for by default.
 * arrayFrom(5, i => i * 2) -> [0, 2, 4, 6, 8]
 */
const arrayFrom = (size, fn = (i) => i) => Array.from({ length: size }, (_, i) => fn(i));

/** Why `new Array(n).map(...)` does not work. */
const holesAreSkipped = (size) => new Array(size).map((_, i) => i);

/** A range of numbers, like Python's range(). */
function range(start, end, step = 1) {
  if (end === undefined) [start, end] = [0, start];

  const length = Math.max(0, Math.ceil((end - start) / step));
  return Array.from({ length }, (_, i) => start + i * step);
}

/**
 * IMPORTANT: fill with an object and every slot holds the SAME reference.
 * Use Array.from when each element must be its own object.
 */
const sharedReferenceTrap = (size) => new Array(size).fill({ count: 0 });
const independentObjects = (size) => Array.from({ length: size }, () => ({ count: 0 }));

/** A 2-D grid, with independent rows. */
const grid = (rows, cols, value = 0) =>
  Array.from({ length: rows }, () => new Array(cols).fill(value));

// ---- Examples ----
console.log(arrayOf(3, 'x'));        // ['x', 'x', 'x']
console.log(arrayFrom(5));           // [0, 1, 2, 3, 4]
console.log(arrayFrom(4, (i) => i * i)); // [0, 1, 4, 9]
console.log(holesAreSkipped(3));     // [ <3 empty items> ]  <- map skipped them
console.log(range(5));               // [0,1,2,3,4]
console.log(range(2, 10, 3));        // [2, 5, 8]

const shared = sharedReferenceTrap(3);
shared[0].count = 9;
console.log(shared[1].count);        // 9  <- same object!

const separate = independentObjects(3);
separate[0].count = 9;
console.log(separate[1].count);      // 0
console.log(grid(2, 3));             // [[0,0,0], [0,0,0]]

module.exports = { arrayOf, arrayFrom, range, independentObjects, grid };
