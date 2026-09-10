/**
 * Remove elements from the start of an array until the passed function
 * returns true.
 *
 * lodash calls this `dropWhile` (drop while FALSE, stop at the first true).
 * The whole family of take/drop from either end is here.
 */

/** Drop from the start until the predicate returns true. */
function dropUntil(arr, predicate) {
  let start = 0;
  while (start < arr.length && !predicate(arr[start], start, arr)) start++;
  return arr.slice(start);
}

/** Drop from the start WHILE the predicate is true. */
function dropWhile(arr, predicate) {
  let start = 0;
  while (start < arr.length && predicate(arr[start], start, arr)) start++;
  return arr.slice(start);
}

/** Drop from the END while the predicate is true. */
function dropRightWhile(arr, predicate) {
  let end = arr.length;
  while (end > 0 && predicate(arr[end - 1], end - 1, arr)) end--;
  return arr.slice(0, end);
}

/** Take from the start while the predicate is true. */
function takeWhile(arr, predicate) {
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    if (!predicate(arr[i], i, arr)) break;
    out.push(arr[i]);
  }
  return out;
}

/** Take from the start UNTIL the predicate is true (the match is excluded). */
const takeUntil = (arr, predicate) => takeWhile(arr, (...args) => !predicate(...args));

/** Split at the first element satisfying the predicate. */
function splitAtFirst(arr, predicate) {
  const index = arr.findIndex(predicate);
  return index === -1 ? [[...arr], []] : [arr.slice(0, index), arr.slice(index)];
}

/** Trim matching values from both ends, like String.prototype.trim. */
function trimBy(arr, predicate) {
  let start = 0;
  let end = arr.length;

  while (start < end && predicate(arr[start])) start++;
  while (end > start && predicate(arr[end - 1])) end--;

  return arr.slice(start, end);
}

// ---- Examples ----
const arr = [1, 2, 3, 4, 5, 1];

console.log(dropUntil(arr, (n) => n > 3));      // [4, 5, 1]
console.log(dropWhile(arr, (n) => n < 3));      // [3, 4, 5, 1]
console.log(dropRightWhile(arr, (n) => n < 3)); // [1,2,3,4,5]
console.log(takeWhile(arr, (n) => n < 4));      // [1, 2, 3]
console.log(takeUntil(arr, (n) => n === 4));    // [1, 2, 3]
console.log(splitAtFirst(arr, (n) => n === 4)); // [[1,2,3], [4,5,1]]
console.log(trimBy([0, 0, 1, 2, 0], (n) => n === 0)); // [1, 2]

module.exports = { dropUntil, dropWhile, dropRightWhile, takeWhile, takeUntil, splitAtFirst, trimBy };
