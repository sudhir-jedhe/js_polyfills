/**
 * Take elements by condition from the start or the end of an array.
 *
 * takeWhile / takeRightWhile and their drop counterparts — the family that
 * covers "give me the leading run that matches".
 */

/** From the start, while the predicate holds. */
function takeWhile(arr, predicate) {
  const out = [];

  for (let i = 0; i < arr.length; i++) {
    if (!predicate(arr[i], i, arr)) break;
    out.push(arr[i]);
  }

  return out;
}

/** From the END, while the predicate holds. */
function takeRightWhile(arr, predicate) {
  let start = arr.length;
  while (start > 0 && predicate(arr[start - 1], start - 1, arr)) start--;
  return arr.slice(start);
}

/** Drop from the start while the predicate holds. */
function dropWhile(arr, predicate) {
  let start = 0;
  while (start < arr.length && predicate(arr[start], start, arr)) start++;
  return arr.slice(start);
}

/** Drop from the end while the predicate holds. */
function dropRightWhile(arr, predicate) {
  let end = arr.length;
  while (end > 0 && predicate(arr[end - 1], end - 1, arr)) end--;
  return arr.slice(0, end);
}

/** Take from either end depending on the sign of `n`. */
const takeEnd = (arr, n) => (n >= 0 ? arr.slice(0, n) : arr.slice(n));

/** Take up to `count` elements matching the predicate, from anywhere. */
function takeMatching(arr, predicate, count = Infinity) {
  const out = [];

  for (let i = 0; i < arr.length && out.length < count; i++) {
    if (predicate(arr[i], i, arr)) out.push(arr[i]);
  }

  return out;
}

/** Trim matching values from both ends. */
function trimBy(arr, predicate) {
  let start = 0;
  let end = arr.length;

  while (start < end && predicate(arr[start])) start++;
  while (end > start && predicate(arr[end - 1])) end--;

  return arr.slice(start, end);
}

/** Split into the leading run and the rest. */
const span = (arr, predicate) => [takeWhile(arr, predicate), dropWhile(arr, predicate)];

/** Lazy take, so an infinite generator can be consumed safely. */
function* takeLazy(iterable, count) {
  let taken = 0;

  for (const item of iterable) {
    if (taken++ >= count) return;
    yield item;
  }
}

// ---- Examples ----
const arr = [1, 2, 3, 10, 4, 5];

console.log(takeWhile(arr, (n) => n < 5));      // [1, 2, 3]
console.log(takeRightWhile(arr, (n) => n < 6)); // [4, 5]
console.log(dropWhile(arr, (n) => n < 5));      // [10, 4, 5]
console.log(dropRightWhile(arr, (n) => n < 6)); // [1,2,3,10]
console.log(takeEnd(arr, -2));                  // [4, 5]
console.log(takeMatching(arr, (n) => n % 2 === 0, 2)); // [2, 10]
console.log(trimBy([0, 0, 1, 2, 0], (n) => n === 0));  // [1, 2]
console.log(span(arr, (n) => n < 5));           // [[1,2,3], [10,4,5]]

function* naturals() {
  for (let i = 1; ; i++) yield i;
}
console.log([...takeLazy(naturals(), 5)]);      // [1,2,3,4,5]

module.exports = { takeWhile, takeRightWhile, dropWhile, dropRightWhile, takeEnd, takeMatching, trimBy, span, takeLazy };
