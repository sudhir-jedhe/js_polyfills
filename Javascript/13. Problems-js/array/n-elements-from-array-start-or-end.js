/**
 * Take n elements from the start or the end of an array.
 *
 * slice does all of it; the point is the sign conventions and the
 * predicate-driven cousins.
 */

/** First n. A negative n is treated as 0. */
const take = (arr, n = 1) => arr.slice(0, Math.max(0, n));

/** Last n. */
const takeRight = (arr, n = 1) => (n <= 0 ? [] : arr.slice(-n));

/** Positive n takes from the start, negative n from the end. */
const takeEnd = (arr, n) => (n >= 0 ? take(arr, n) : takeRight(arr, -n));

/** Drop n from the start. */
const drop = (arr, n = 1) => arr.slice(Math.max(0, n));

/** Drop n from the end. */
const dropRight = (arr, n = 1) => (n <= 0 ? [...arr] : arr.slice(0, -n));

/** Take from the start while a predicate holds. */
function takeWhile(arr, predicate) {
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    if (!predicate(arr[i], i, arr)) break;
    out.push(arr[i]);
  }
  return out;
}

/** Take from the END while a predicate holds. */
function takeRightWhile(arr, predicate) {
  let i = arr.length;
  while (i > 0 && predicate(arr[i - 1], i - 1, arr)) i--;
  return arr.slice(i);
}

/** Both ends at once: the first n and the last n. */
const ends = (arr, n) => ({ head: take(arr, n), tail: takeRight(arr, n) });

/** A middle slice: skip the first n and the last m. */
const middle = (arr, n = 1, m = n) => arr.slice(n, arr.length - m);

// ---- Examples ----
const arr = [1, 2, 3, 4, 5];

console.log(take(arr, 2));        // [1, 2]
console.log(takeRight(arr, 2));   // [4, 5]
console.log(takeEnd(arr, -3));    // [3, 4, 5]
console.log(drop(arr, 2));        // [3, 4, 5]
console.log(dropRight(arr, 2));   // [1, 2, 3]
console.log(takeWhile(arr, (n) => n < 3));      // [1, 2]
console.log(takeRightWhile(arr, (n) => n > 3)); // [4, 5]
console.log(ends(arr, 2));        // { head: [1,2], tail: [4,5] }
console.log(middle(arr, 1));      // [2, 3, 4]

module.exports = { take, takeRight, takeEnd, drop, dropRight, takeWhile, takeRightWhile, ends, middle };
